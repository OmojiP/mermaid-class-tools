import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';
import { findMermaidCodeBlockAtPosition } from '../utils/mermaidContext';

const IDENTIFIER_PATTERN = /[\p{L}_][\p{L}\p{N}_.-]*/gu;

export class MermaidClassRenameProvider implements vscode.RenameProvider {
    private readonly messages: LocaleMessages;

    constructor(messages: LocaleMessages) {
        this.messages = messages;
    }

    provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string
    ): vscode.WorkspaceEdit | undefined {
        const currentBlock = findMermaidCodeBlockAtPosition(document, position);
        if (!currentBlock) {
            return undefined;
        }

        const target = getIdentifierAtPosition(document, position, currentBlock);
        if (!target) {
            return undefined;
        }

        const oldName = target.name;
        const edit = new vscode.WorkspaceEdit();

        const { code, codeOffset } = currentBlock;
        const regex = new RegExp(IDENTIFIER_PATTERN);
        let match: RegExpExecArray | null;
        while ((match = regex.exec(code)) !== null) {
            if (match[0] === oldName) {
                const start = document.positionAt(codeOffset + match.index);
                const end = document.positionAt(codeOffset + match.index + oldName.length);
                edit.replace(document.uri, new vscode.Range(start, end), newName);
            }
        }

        return edit;
    }

    prepareRename(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Range | Thenable<vscode.Range> {
        const block = findMermaidCodeBlockAtPosition(document, position);
        if (!block) {
            return Promise.reject(this.messages.rename.notInMermaidBlock);
        }

        const target = getIdentifierAtPosition(document, position, block);
        if (!target) {
            return Promise.reject(this.messages.rename.notInMermaidBlock);
        }

        return target.range;
    }
}

function getIdentifierAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position,
    block: { code: string; codeOffset: number }
): { name: string; range: vscode.Range } | undefined {
    const positionOffset = document.offsetAt(position);
    const blockRelativeOffset = positionOffset - block.codeOffset;
    if (blockRelativeOffset < 0 || blockRelativeOffset > block.code.length) {
        return undefined;
    }

    const regex = new RegExp(IDENTIFIER_PATTERN);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(block.code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (blockRelativeOffset >= start && blockRelativeOffset <= end) {
            const absoluteStart = block.codeOffset + start;
            const absoluteEnd = block.codeOffset + end;
            return {
                name: match[0],
                range: new vscode.Range(document.positionAt(absoluteStart), document.positionAt(absoluteEnd)),
            };
        }
    }

    return undefined;
}
