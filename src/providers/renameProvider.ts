import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';
import { findMermaidCodeBlockAtPosition } from '../utils/mermaidContext';

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
        const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
        if (!wordRange) {
            return undefined;
        }

        const oldName = document.getText(wordRange);
        const edit = new vscode.WorkspaceEdit();
        const currentBlock = findMermaidCodeBlockAtPosition(document, position);

        if (!currentBlock) {
            return undefined;
        }

        const { code, codeOffset } = currentBlock;
        const regex = /\b\w+\b/g;
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
        if (block) {
            const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
            if (wordRange) {
                return wordRange;
            }
        }

        return Promise.reject(this.messages.rename.notInMermaidBlock);
    }
}
