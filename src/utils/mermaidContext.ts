import * as vscode from 'vscode';
import { MermaidDiagramType } from '../i18n/messages';

export type MermaidCodeBlock = {
    code: string;
    codeOffset: number;
    range: vscode.Range;
};

type MermaidCodeBlockCache = {
    version: number;
    blocks: MermaidCodeBlock[];
};

const codeBlockCache = new Map<string, MermaidCodeBlockCache>();

export function getMermaidCodeBlocks(document: vscode.TextDocument): MermaidCodeBlock[] {
    const cacheKey = document.uri.toString();
    const cached = codeBlockCache.get(cacheKey);
    if (cached && cached.version === document.version) {
        return cached.blocks;
    }

    const fullText = document.getText();
    const regex = /```mermaid\s*([\s\S]*?)```/g;
    const blocks: MermaidCodeBlock[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(fullText)) !== null) {
        const code = match[1];
        const codeOffset = match.index + match[0].indexOf(code);
        const start = document.positionAt(codeOffset);
        const end = document.positionAt(codeOffset + code.length);
        blocks.push({
            code,
            codeOffset,
            range: new vscode.Range(start, end),
        });
    }

    codeBlockCache.set(cacheKey, {
        version: document.version,
        blocks,
    });

    return blocks;
}

export function findMermaidCodeBlockAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
): MermaidCodeBlock | undefined {
    const offset = document.offsetAt(position);
    return getMermaidCodeBlocks(document).find(
        (block) => offset >= block.codeOffset && offset < block.codeOffset + block.code.length
    );
}

export function getDiagramTypeAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
): MermaidDiagramType | undefined {
    const block = findMermaidCodeBlockAtPosition(document, position);
    if (!block) {
        return undefined;
    }

    return normalizeDiagramType(block.code);
}


function normalizeDiagramType(code: string): MermaidDiagramType | undefined {
    const lines = code
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) {
        return undefined;
    }

    const firstLine = lines[0].toLowerCase();
    if (firstLine.startsWith('classdiagram')) {
        return 'classDiagram';
    }

    if (firstLine.startsWith('sequencediagram')) {
        return 'sequenceDiagram';
    }

    if (firstLine.startsWith('statediagram')) {
        return 'stateDiagram';
    }

    if (firstLine.startsWith('flowchart')) {
        return 'stateDiagram'; // フローチャートも矢印の種類はstateDiagramと同じため、ここではstateDiagramとして扱う
    }

    if (firstLine.startsWith('graph')) {
        return 'stateDiagram'; // graphも矢印の種類はstateDiagramと同じため、ここではstateDiagramとして扱う
    }

    if (firstLine.startsWith('erdiagram')) {
        return 'erDiagram';
    }

    return undefined;
}