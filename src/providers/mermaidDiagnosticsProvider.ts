import * as vscode from 'vscode';
import { JSDOM } from 'jsdom';
import { getDiagnosticsTriggerMode, getDiagnosticsValidationMode } from '../config';
import { getMermaidCodeBlocks, MermaidCodeBlock } from '../utils/mermaidContext';

type MermaidModule = {
    default: {
        parse: (text: string, parseOptions?: { suppressErrors?: boolean }) => Promise<unknown>;
        render: (id: string, text: string) => Promise<unknown>;
    };
};

type MermaidParseError = {
    message?: string;
    hash?: {
        loc?: {
            first_line?: number;
            last_line?: number;
            first_column?: number;
            last_column?: number;
        };
    };
};

const importMermaid = new Function('specifier', 'return import(specifier);') as (
    specifier: string
) => Promise<MermaidModule>;

type DomPurifyModule = {
    default: {
        addHook?: (...args: unknown[]) => unknown;
        removeAllHooks?: (...args: unknown[]) => unknown;
        sanitize?: (value: string, config?: unknown) => string;
    };
};

const importDomPurify = new Function('specifier', 'return import(specifier);') as (
    specifier: string
) => Promise<DomPurifyModule>;

let mermaidModulePromise: Promise<MermaidModule> | undefined;
let domPurifyPatchedPromise: Promise<void> | undefined;
let domEnvironmentReady = false;
const DIAGNOSTIC_DEBOUNCE_MS = 500;
const MAX_VALIDATION_CACHE_SIZE = 500;

type ValidationMode = 'light' | 'full';

const validationResultCache = new Map<string, MermaidParseError | null>();

export function registerMermaidDiagnostics(context: vscode.ExtensionContext): vscode.Disposable {
    const collection = vscode.languages.createDiagnosticCollection('mermaid');
    const validator = new MermaidDiagnosticsValidator(collection);
    const triggerMode = getDiagnosticsTriggerMode();

    const openDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
        if (triggerMode === 'onChange') {
            validator.scheduleRefresh(document, { delayMs: 0, mode: 'full' });
        }
    });
    const changeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        if (triggerMode !== 'onChange') {
            return;
        }
        const mode = getDiagnosticsValidationMode();
        validator.scheduleRefresh(event.document, { mode });
    });
    const saveDisposable = vscode.workspace.onDidSaveTextDocument((document) => {
        validator.scheduleRefresh(document, { delayMs: 0, mode: 'full' });
    });
    const closeDisposable = vscode.workspace.onDidCloseTextDocument((document) => {
        validator.clearPending(document.uri);
        collection.delete(document.uri);
    });

    for (const document of vscode.workspace.textDocuments) {
        if (triggerMode === 'onChange') {
            validator.scheduleRefresh(document, { delayMs: 0, mode: 'full' });
        }
    }

    return {
        dispose: () => {
            validator.dispose();
            openDisposable.dispose();
            changeDisposable.dispose();
            saveDisposable.dispose();
            closeDisposable.dispose();
            collection.clear();
            collection.dispose();
        },
    };
}

class MermaidDiagnosticsValidator {
    private readonly collection: vscode.DiagnosticCollection;
    private readonly pendingTimers = new Map<string, NodeJS.Timeout>();
    private readonly runTokens = new Map<string, number>();

    constructor(collection: vscode.DiagnosticCollection) {
        this.collection = collection;
    }

    scheduleRefresh(
        document: vscode.TextDocument,
        options: { delayMs?: number; mode?: ValidationMode } = {}
    ): void {
        const key = document.uri.toString();
        this.clearPending(document.uri);
        const delayMs = options.delayMs ?? DIAGNOSTIC_DEBOUNCE_MS;
        const mode = options.mode ?? 'light';

        const nextToken = (this.runTokens.get(key) ?? 0) + 1;
        this.runTokens.set(key, nextToken);

        const timer = setTimeout(() => {
            this.pendingTimers.delete(key);
            void this.refresh(document, nextToken, mode);
        }, delayMs);

        this.pendingTimers.set(key, timer);
    }

    clearPending(uri: vscode.Uri): void {
        const key = uri.toString();
        const timer = this.pendingTimers.get(key);
        if (timer) {
            clearTimeout(timer);
            this.pendingTimers.delete(key);
        }
    }

    dispose(): void {
        for (const timer of this.pendingTimers.values()) {
            clearTimeout(timer);
        }
        this.pendingTimers.clear();
        this.runTokens.clear();
    }

    async refresh(document: vscode.TextDocument, token: number, mode: ValidationMode): Promise<void> {
        const key = document.uri.toString();
        if (document.languageId !== 'markdown') {
            this.collection.delete(document.uri);
            return;
        }

        const blocks = getMermaidCodeBlocks(document);
        if (blocks.length === 0) {
            this.collection.set(document.uri, []);
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];

        for (const block of blocks) {
            if (this.runTokens.get(key) !== token) {
                return;
            }

            const error = await validateCode(block.code, mode);
            if (error) {
                diagnostics.push(this.toDiagnostic(document, block, error));
            }
        }

        if (this.runTokens.get(key) !== token) {
            return;
        }

        this.collection.set(document.uri, diagnostics);
    }

    private toDiagnostic(
        document: vscode.TextDocument,
        block: MermaidCodeBlock,
        error: unknown
    ): vscode.Diagnostic {
        const parseError = error as MermaidParseError;
        const hasLocation = Boolean(parseError.hash?.loc);
        const range = hasLocation ? createErrorRange(document, block, parseError) : block.range;
        const baseMessage = parseError.message ?? 'Invalid Mermaid syntax.';
        const message = hasLocation
            ? baseMessage
            : `Mermaid render/parse error detected in this block. ${baseMessage}`;
        const severity = vscode.DiagnosticSeverity.Error;
        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'mermaid';
        return diagnostic;
    }
}

async function validateCode(code: string, mode: ValidationMode): Promise<MermaidParseError | null> {
    const cacheKey = `${mode}:${code}`;
    const cached = validationResultCache.get(cacheKey);
    if (cached !== undefined) {
        return cached;
    }

    let result: MermaidParseError | null = null;
    try {
        await parseWithMermaid(code);
    } catch (error) {
        result = error as MermaidParseError;
    }

    if (!result && mode === 'full') {
        try {
            await renderWithMermaid(code);
        } catch (error) {
            if (!shouldIgnoreRenderError(code, error)) {
                result = error as MermaidParseError;
            }
        }
    }

    if (validationResultCache.size >= MAX_VALIDATION_CACHE_SIZE) {
        validationResultCache.clear();
    }
    validationResultCache.set(cacheKey, result);
    return result;
}

function shouldIgnoreRenderError(code: string, error: unknown): boolean {
    const parseError = error as MermaidParseError;
    const hasLocation = Boolean(parseError.hash?.loc);
    if (hasLocation) {
        return false;
    }

    return hasJapaneseText(code);
}

function hasJapaneseText(value: string): boolean {
    return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(value);
}

async function renderWithMermaid(code: string): Promise<void> {
    const mermaid = await loadMermaid();
    const renderId = `mct_diag_${Math.random().toString(36).slice(2)}`;
    await mermaid.default.render(renderId, code);
}

async function parseWithMermaid(code: string): Promise<void> {
    const mermaid = await loadMermaid();
    await mermaid.default.parse(code, { suppressErrors: false });
}

function loadMermaid(): Promise<MermaidModule> {
    if (!mermaidModulePromise) {
        mermaidModulePromise = ensureMermaidRuntimeReady().then(() => importMermaid('mermaid'));
    }

    return mermaidModulePromise;
}

function ensureMermaidRuntimeReady(): Promise<void> {
    ensureDomEnvironment();
    return ensureDomPurifyPatched();
}

function ensureDomEnvironment(): void {
    if (domEnvironmentReady) {
        return;
    }

    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    const win = dom.window;

    (globalThis as any).window = win;
    (globalThis as any).document = win.document;
    (globalThis as any).Element = win.Element;
    (globalThis as any).HTMLElement = win.HTMLElement;
    (globalThis as any).SVGElement = win.SVGElement;
    (globalThis as any).Node = win.Node;

    if (!("navigator" in globalThis)) {
        (globalThis as any).navigator = win.navigator;
    }

    if (typeof (win.SVGElement as any).prototype.getBBox !== 'function') {
        (win.SVGElement as any).prototype.getBBox = function getBBox() {
            return { x: 0, y: 0, width: 100, height: 20 };
        };
    }

    domEnvironmentReady = true;
}

function ensureDomPurifyPatched(): Promise<void> {
    if (!domPurifyPatchedPromise) {
        domPurifyPatchedPromise = importDomPurify('dompurify').then((module) => {
            const domPurify = module.default;
            if (typeof domPurify.addHook !== 'function') {
                domPurify.addHook = () => {
                    return;
                };
            }

            if (typeof domPurify.removeAllHooks !== 'function') {
                domPurify.removeAllHooks = () => {
                    return;
                };
            }

            if (typeof domPurify.sanitize !== 'function') {
                domPurify.sanitize = (value: string) => value;
            }
        });
    }

    return domPurifyPatchedPromise;
}

function createErrorRange(
    document: vscode.TextDocument,
    block: MermaidCodeBlock,
    parseError: MermaidParseError
): vscode.Range {
    const loc = parseError.hash?.loc;
    if (!loc) {
        return fallbackRange(document, block);
    }

    const blockStart = document.positionAt(block.codeOffset);
    const startLine = blockStart.line + Math.max(0, (loc.first_line ?? 1) - 1);
    const endLine = blockStart.line + Math.max(0, (loc.last_line ?? loc.first_line ?? 1) - 1);
    const startCharacter = Math.max(0, loc.first_column ?? 0);
    const endCharacter = Math.max(startCharacter + 1, loc.last_column ?? startCharacter + 1);

    const safeStartLine = Math.min(startLine, document.lineCount - 1);
    const safeEndLine = Math.min(endLine, document.lineCount - 1);
    const maxStartChar = document.lineAt(safeStartLine).text.length;
    const maxEndChar = document.lineAt(safeEndLine).text.length;

    const safeStartCharacter = Math.min(startCharacter, maxStartChar);
    const safeEndCharacter = Math.min(endCharacter, Math.max(maxEndChar, safeStartCharacter + 1));

    return new vscode.Range(
        new vscode.Position(safeStartLine, safeStartCharacter),
        new vscode.Position(safeEndLine, safeEndCharacter)
    );
}

function fallbackRange(document: vscode.TextDocument, block: MermaidCodeBlock): vscode.Range {
    const start = block.range.start;
    const lineLength = document.lineAt(start.line).text.length;
    const end = new vscode.Position(start.line, Math.max(1, lineLength));
    return new vscode.Range(start, end);
}