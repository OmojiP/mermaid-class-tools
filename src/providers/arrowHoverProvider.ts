import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';
import { getDiagramTypeAtPosition } from '../utils/mermaidContext';

export function createArrowHoverProvider(messages: LocaleMessages): vscode.HoverProvider {
    return {
        provideHover(document, position) {
            const diagramType = getDiagramTypeAtPosition(document, position);
            if (!diagramType) {
                return undefined;
            }

            const arrowDescriptions = messages.hover.arrowDescriptionsByDiagram[diagramType];
            const arrows = Object.keys(arrowDescriptions).sort((a, b) => b.length - a.length);
            const line = document.lineAt(position.line).text;

            for (const arrow of arrows) {
                let searchIndex = 0;
                while (searchIndex < line.length) {
                    const index = line.indexOf(arrow, searchIndex);
                    if (index < 0) {
                        break;
                    }

                    const isInRange = position.character >= index && position.character <= index + arrow.length;
                    if (isInRange) {
                        const description = arrowDescriptions[arrow];
                        return new vscode.Hover(`**${messages.hover.title}**: \`${arrow}\` — ${description}`);
                    }

                    searchIndex = index + 1;
                }
            }

            return undefined;
        },
    };
}