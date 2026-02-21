import * as vscode from 'vscode';
import { ARROW_REVERSE_MAP, SUPPORTED_ARROWS } from '../constants/arrows';
import { LocaleMessages } from '../i18n/messages';
import { escapeRegExp } from '../utils/regex';

export function createArrowCodeActionProvider(messages: LocaleMessages): vscode.CodeActionProvider {
    return {
        provideCodeActions(document, range) {
            const line = document.lineAt(range.start.line);
            const text = line.text;

            const matchedArrow = SUPPORTED_ARROWS.find((arrow) =>
                new RegExp(`\\b\\w+\\s+${escapeRegExp(arrow)}\\s+\\w+\\b`).test(text)
            );

            if (!matchedArrow) {
                return undefined;
            }

            const reversedArrow = ARROW_REVERSE_MAP[matchedArrow];
            if (!reversedArrow) {
                return undefined;
            }

            const reverseArrowOnlyAction = new vscode.CodeAction(
                messages.quickFix.keepPositionsReverseRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseArrowOnlyAction.edit = new vscode.WorkspaceEdit();
            reverseArrowOnlyAction.edit.replace(document.uri, line.range, text.replace(matchedArrow, reversedArrow));

            const reverseDirectionAction = new vscode.CodeAction(
                messages.quickFix.swapPositionsReverseRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseDirectionAction.edit = new vscode.WorkspaceEdit();
            reverseDirectionAction.edit.replace(
                document.uri,
                line.range,
                text.replace(new RegExp(`(\\b\\w+)\\s+${escapeRegExp(matchedArrow)}\\s+(\\b\\w+)`), (_, left, right) => {
                    return `${right} ${matchedArrow} ${left}`;
                })
            );

            const reverseArrowAndDirectionAction = new vscode.CodeAction(
                messages.quickFix.swapPositionsKeepRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseArrowAndDirectionAction.edit = new vscode.WorkspaceEdit();
            reverseArrowAndDirectionAction.edit.replace(
                document.uri,
                line.range,
                text.replace(new RegExp(`(\\b\\w+)\\s+${escapeRegExp(matchedArrow)}\\s+(\\b\\w+)`), (_, left, right) => {
                    return `${right} ${reversedArrow} ${left}`;
                })
            );

            return [reverseArrowOnlyAction, reverseDirectionAction, reverseArrowAndDirectionAction];
        },
    };
}