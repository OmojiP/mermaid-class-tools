import * as vscode from 'vscode';
import { LocaleMessages } from '../i18n/messages';

export function createArrowHoverProvider(messages: LocaleMessages): vscode.HoverProvider {
    const arrows = Object.keys(messages.hover.arrowDescriptions).sort((a, b) => b.length - a.length);

    return {
        provideHover(document, position) {
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
                        const description = messages.hover.arrowDescriptions[arrow];
                        return new vscode.Hover(`**${messages.hover.title}**: \`${arrow}\` — ${description}`);
                    }

                    searchIndex = index + 1;
                }
            }

            return undefined;
        },
    };
}