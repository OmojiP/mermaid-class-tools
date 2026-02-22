import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';
import { getDiagramTypeAtPosition } from '../utils/mermaidContext';

export function createArrowCompletionProvider(messages: LocaleMessages): vscode.CompletionItemProvider {
    return {
        provideCompletionItems(document, position) {
            const diagramType = getDiagramTypeAtPosition(document, position);
            if (!diagramType) {
                return undefined;
            }

            const arrowDescriptions = messages.hover.arrowDescriptionsByDiagram[diagramType];
            const arrows = Object.keys(arrowDescriptions);
            const prefixInfo = getArrowPrefix(document, position);
            const candidateArrows =
                prefixInfo.prefix.length > 0
                    ? arrows.filter((arrow) => arrow.startsWith(prefixInfo.prefix))
                    : arrows;

            const items = candidateArrows.map((arrow) => {
                const item = new vscode.CompletionItem(arrow, vscode.CompletionItemKind.Operator);
                item.insertText = arrow;
                item.detail = `${messages.hover.title}: ${arrowDescriptions[arrow]}`;
                item.sortText = `0_${arrow}`;
                item.range = new vscode.Range(position.line, prefixInfo.startCharacter, position.line, position.character);
                return item;
            });

            return new vscode.CompletionList(items, false);
        },
    };
}

function getArrowPrefix(
    document: vscode.TextDocument,
    position: vscode.Position
): { prefix: string; startCharacter: number } {
    const lineText = document.lineAt(position.line).text;
    const leftText = lineText.slice(0, position.character);
    let index = leftText.length - 1;

    while (index >= 0 && isArrowTokenChar(leftText[index])) {
        index -= 1;
    }

    const startCharacter = index + 1;
    const prefix = leftText.slice(startCharacter);
    return { prefix, startCharacter };
}

function isArrowTokenChar(char: string): boolean {
    return (
        char === '-' ||
        char === '<' ||
        char === '>' ||
        char === '.' ||
        char === '*' ||
        char === 'o' ||
        char === ')' ||
        char === 'x' ||
        char === '|' ||
        char === '{' ||
        char === '}'
    );
}