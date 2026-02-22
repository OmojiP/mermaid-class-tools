import * as vscode from 'vscode';
import { ARROW_REVERSE_MAP, SUPPORTED_ARROWS } from '../constants/arrows';
import { LocaleMessages, MermaidDiagramType } from '../i18n/messages';
import { getDiagramTypeAtPosition } from '../utils/mermaidContext';

const SEQUENCE_ARROWS = ['-->>', '--x', '--)', '->>', '-->', '->', '-x', '-)'];

export function createArrowCodeActionProvider(messages: LocaleMessages): vscode.CodeActionProvider {
    return {
        provideCodeActions(document, range) {
            const diagramType = getDiagramTypeAtPosition(document, range.start);
            const isNonReversibleDiagram = diagramType === 'sequenceDiagram' || diagramType === 'stateDiagram';

            const line = document.lineAt(range.start.line);
            const text = line.text;

            const candidateArrows = getCandidateArrows(diagramType, messages);
            const matchedArrow = candidateArrows.find((arrow) => text.includes(arrow));

            if (!matchedArrow) {
                return undefined;
            }

            const swapWithSameArrowText = createSwapPositionsText(text, matchedArrow, matchedArrow);
            if (!swapWithSameArrowText) {
                return undefined;
            }

            const reverseDirectionAction = new vscode.CodeAction(
                messages.quickFix.swapPositionsReverseRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseDirectionAction.edit = new vscode.WorkspaceEdit();
            reverseDirectionAction.edit.replace(document.uri, line.range, swapWithSameArrowText);

            if (isNonReversibleDiagram) {
                return [reverseDirectionAction];
            }

            const reversedArrow = getReversedArrow(matchedArrow, diagramType);
            if (!reversedArrow) {
                return undefined;
            }

            const reverseArrowOnlyAction = new vscode.CodeAction(
                messages.quickFix.keepPositionsReverseRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseArrowOnlyAction.edit = new vscode.WorkspaceEdit();
            reverseArrowOnlyAction.edit.replace(document.uri, line.range, replaceFirst(text, matchedArrow, reversedArrow));

            const swapWithReversedArrowText = createSwapPositionsText(text, matchedArrow, reversedArrow);
            if (!swapWithReversedArrowText) {
                return [reverseArrowOnlyAction, reverseDirectionAction];
            }

            const reverseArrowAndDirectionAction = new vscode.CodeAction(
                messages.quickFix.swapPositionsKeepRelation,
                vscode.CodeActionKind.QuickFix
            );
            reverseArrowAndDirectionAction.edit = new vscode.WorkspaceEdit();
            reverseArrowAndDirectionAction.edit.replace(document.uri, line.range, swapWithReversedArrowText);

            return [reverseArrowOnlyAction, reverseDirectionAction, reverseArrowAndDirectionAction];
        },
    };
}

function getCandidateArrows(diagramType: MermaidDiagramType | undefined, messages: LocaleMessages): string[] {
    if (diagramType === 'sequenceDiagram') {
        return SEQUENCE_ARROWS;
    }

    if (diagramType === 'erDiagram') {
        return Object.keys(messages.hover.arrowDescriptionsByDiagram.erDiagram).sort((a, b) => b.length - a.length);
    }

    return SUPPORTED_ARROWS;
}

function getReversedArrow(arrow: string, diagramType: MermaidDiagramType | undefined): string | undefined {
    if (diagramType === 'erDiagram') {
        return reverseErArrow(arrow);
    }

    return ARROW_REVERSE_MAP[arrow];
}

function reverseErArrow(arrow: string): string | undefined {
    const connector = arrow.includes('--') ? '--' : arrow.includes('..') ? '..' : undefined;
    if (!connector) {
        return undefined;
    }

    const [left, right] = arrow.split(connector);
    if (!left || !right) {
        return undefined;
    }

    const leftToRight: Record<string, string> = {
        '|o': 'o|',
        '}o': 'o{',
        '||': '||',
        '}|': '|{',
    };
    const rightToLeft: Record<string, string> = {
        'o|': '|o',
        'o{': '}o',
        '||': '||',
        '|{': '}|',
    };

    const reversedLeft = rightToLeft[right];
    const reversedRight = leftToRight[left];
    if (!reversedLeft || !reversedRight) {
        return undefined;
    }

    return `${reversedLeft}${connector}${reversedRight}`;
}

function createSwapPositionsText(text: string, arrow: string, replacementArrow: string): string | undefined {
    const arrowIndex = text.indexOf(arrow);
    if (arrowIndex < 0) {
        return undefined;
    }

    const leftSegment = text.slice(0, arrowIndex);
    const rightSegment = text.slice(arrowIndex + arrow.length);

    const leftMatch = leftSegment.match(/^(.*?)([A-Za-z_][\w.-]*)\s*$/);
    const rightMatch = rightSegment.match(/^\s*([A-Za-z_][\w.-]*)([\s\S]*)$/);
    if (!leftMatch || !rightMatch) {
        return undefined;
    }

    const prefix = leftMatch[1];
    const leftNode = leftMatch[2];
    const rightNode = rightMatch[1];
    const suffix = rightMatch[2];

    return `${prefix}${rightNode} ${replacementArrow} ${leftNode}${suffix}`;
}

function replaceFirst(text: string, target: string, replacement: string): string {
    const index = text.indexOf(target);
    if (index < 0) {
        return text;
    }

    return `${text.slice(0, index)}${replacement}${text.slice(index + target.length)}`;
}