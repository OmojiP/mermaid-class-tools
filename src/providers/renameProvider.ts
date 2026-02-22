import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';

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
        const fullText = document.getText();
        const mermaidBlocks = getMermaidCodeBlocks(fullText);
        const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
        if (!wordRange) {
            return undefined;
        }

        const oldName = document.getText(wordRange);
        const edit = new vscode.WorkspaceEdit();
        const offset = document.offsetAt(position);

        const currentBlock = mermaidBlocks.find(
            (block) => offset >= block.rangeOffset && offset < block.rangeOffset + block.code.length
        );

        if (!currentBlock) {
            return undefined;
        }

        const { code, rangeOffset } = currentBlock;
        const regex = /\b\w+\b/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(code)) !== null) {
            if (match[0] === oldName) {
                const start = document.positionAt(rangeOffset + match.index);
                const end = document.positionAt(rangeOffset + match.index + oldName.length);
                edit.replace(document.uri, new vscode.Range(start, end), newName);
            }
        }

        return edit;
    }

    prepareRename(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Range | Thenable<vscode.Range> {
        const fullText = document.getText();
        const mermaidBlocks = getMermaidCodeBlocks(fullText);
        const offset = document.offsetAt(position);

        for (const block of mermaidBlocks) {
            const { code, rangeOffset } = block;
            if (offset >= rangeOffset && offset < rangeOffset + code.length) {
                const wordRange = document.getWordRangeAtPosition(position, /\b\w+\b/);
                if (wordRange) {
                    return wordRange;
                }
            }
        }

        return Promise.reject(this.messages.rename.notInMermaidBlock);
    }
}

function getMermaidCodeBlocks(text: string): Array<{ code: string; rangeOffset: number }> {
    const regex = /```mermaid\s*([\s\S]*?)```/g;
    const blocks: Array<{ code: string; rangeOffset: number }> = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        blocks.push({
            code: match[1],
            rangeOffset: match.index + match[0].indexOf(match[1]),
        });
    }

    return blocks;
}