import * as vscode from 'vscode';
import { MermaidDiagramType } from '../i18n/messages';

export function getDiagramTypeAtPosition(
    document: vscode.TextDocument,
    position: vscode.Position
): MermaidDiagramType | undefined {
    const fullText = document.getText();
    const offset = document.offsetAt(position);
    const regex = /```mermaid\s*([\s\S]*?)```/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(fullText)) !== null) {
        const code = match[1];
        const codeOffset = match.index + match[0].indexOf(code);
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
        return 'stateDiagram';
    }

    if (firstLine.startsWith('graph')) {
        return 'stateDiagram';
    }

    if (firstLine.startsWith('erdiagram')) {
        return 'erDiagram';
    }

    return undefined;
}