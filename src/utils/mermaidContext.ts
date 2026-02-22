import * as vscode from 'vscode';
import { MermaidDiagramType } from '../i18n/messages';

export type MermaidCodeBlock = {
    code: string;
    codeOffset: number;
    range: vscode.Range;
};

export function getMermaidCodeBlocks(document: vscode.TextDocument): MermaidCodeBlock[] {
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

    return blocks;
}

export function getDiagramTypeAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
): MermaidDiagramType | undefined {
    const offset = document.offsetAt(position);
    const blocks = getMermaidCodeBlocks(document);

    for (const block of blocks) {
        const codeOffset = block.codeOffset;
        const code = block.code;
        if (offset < codeOffset || offset >= codeOffset + code.length) {
            continue;
        }

        return normalizeDiagramType(code);
    }

    return undefined;
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