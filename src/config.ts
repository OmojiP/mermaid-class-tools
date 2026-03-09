import * as vscode from 'vscode';

export const CONFIG_SECTION = 'mermaidClassTools';

export type FeatureFlags = {
    enableRename: boolean;
    enableArrowActions: boolean;
    enableArrowCompletion: boolean;
    enableArrowHover: boolean;
    enableDiagnostics: boolean;
};

export type DiagnosticsValidationMode = 'full' | 'light';
export type DiagnosticsTriggerMode = 'onChange' | 'onSave';

export function getFeatureFlags(): FeatureFlags {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);

    return {
        enableRename: config.get<boolean>('enableRename', true),
        enableArrowActions: config.get<boolean>('enableArrowActions', true),
        enableArrowCompletion: config.get<boolean>('enableArrowCompletion', true),
        enableArrowHover: config.get<boolean>('enableArrowHover', true),
        enableDiagnostics: config.get<boolean>('enableDiagnostics', true),
    };
}

export function getDiagnosticsValidationMode(): DiagnosticsValidationMode {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
    return config.get<DiagnosticsValidationMode>('diagnosticsValidationMode', 'full');
}

export function getDiagnosticsTriggerMode(): DiagnosticsTriggerMode {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
    return config.get<DiagnosticsTriggerMode>('diagnosticsTriggerMode', 'onSave');
}