import * as vscode from 'vscode';
import { CONFIG_SECTION, getFeatureFlags } from './config';
import { getLocaleMessages } from './i18n/messages';
import { createArrowCodeActionProvider } from './providers/arrowCodeActionProvider';
import { createArrowHoverProvider } from './providers/arrowHoverProvider';
import { MermaidClassRenameProvider } from './providers/renameProvider';

export function activate(context: vscode.ExtensionContext): void {
    const featureDisposables: vscode.Disposable[] = [];

    const registerFeatures = (): void => {
        disposeFeatureDisposables(featureDisposables);

        const messages = getLocaleMessages(vscode.env.language);
        const featureFlags = getFeatureFlags();

        if (featureFlags.enableRename) {
            const renameProvider = new MermaidClassRenameProvider(messages);
            featureDisposables.push(vscode.languages.registerRenameProvider('markdown', renameProvider));
        }

        if (featureFlags.enableArrowActions) {
            featureDisposables.push(
                vscode.languages.registerCodeActionsProvider('markdown', createArrowCodeActionProvider(messages), {
                    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
                })
            );
        }

        if (featureFlags.enableArrowHover) {
            featureDisposables.push(vscode.languages.registerHoverProvider('markdown', createArrowHoverProvider(messages)));
        }
    };

    registerFeatures();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(CONFIG_SECTION)) {
                registerFeatures();
            }
        })
    );

    context.subscriptions.push({
        dispose: () => disposeFeatureDisposables(featureDisposables),
    });
}

export function deactivate(): void {
    return;
}

function disposeFeatureDisposables(featureDisposables: vscode.Disposable[]): void {
    while (featureDisposables.length > 0) {
        featureDisposables.pop()?.dispose();
    }
}
