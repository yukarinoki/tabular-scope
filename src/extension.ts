import * as vscode from 'vscode';
import { CSVViewer } from './csvViewer';
import { PKLViewer } from './pklViewer';

export function activate(context: vscode.ExtensionContext) {
    let csvDisposable = vscode.commands.registerCommand('tabular-scope.viewCSV', () => {
        const csvViewer = new CSVViewer();
        csvViewer.showCSV();
    });

    let pklDisposable = vscode.commands.registerCommand('tabular-scope.viewPKL', () => {
        const pklViewer = new PKLViewer();
        pklViewer.showPKL();
    });

    context.subscriptions.push(csvDisposable, pklDisposable);
}

export function deactivate() { }
