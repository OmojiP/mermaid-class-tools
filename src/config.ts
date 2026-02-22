import * as vscode from 'vscode';

export const CONFIG_SECTION = 'mermaidClassTools';

export type FeatureFlags = {
    enableRename: boolean;
    enableArrowActions: boolean;
    enableArrowCompletion: boolean;
    enableArrowHover: boolean;
};

export function getFeatureFlags(): FeatureFlags {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);

    return {
        enableRename: config.get<boolean>('enableRename', true),
        enableArrowActions: config.get<boolean>('enableArrowActions', true),
        enableArrowCompletion: config.get<boolean>('enableArrowCompletion', true),
        enableArrowHover: config.get<boolean>('enableArrowHover', true),
    };
}