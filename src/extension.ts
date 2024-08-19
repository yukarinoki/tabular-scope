import * as vscode from 'vscode';
import { CSVViewer } from './csvViewer';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('tabular-scope.viewCSV', () => {
        const csvViewer = new CSVViewer();
        csvViewer.showCSV();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
