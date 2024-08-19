import * as vscode from 'vscode';
import { CSVViewer } from './csvViewer';
import { PKLViewer } from './pklViewer';

export function activate(context: vscode.ExtensionContext) {
    let csvDisposable = vscode.commands.registerCommand('tabular-scope.viewCSV', (fileUri: vscode.Uri) => {
        const csvViewer = new CSVViewer();
        csvViewer.showCSV(fileUri);
    });

    let pklDisposable = vscode.commands.registerCommand('tabular-scope.viewPKL', (fileUri: vscode.Uri) => {
        console.log('viewPKL command triggered with fileUri:', fileUri);
        const pklViewer = new PKLViewer();
        pklViewer.showPKL(fileUri);
    });

    context.subscriptions.push(csvDisposable, pklDisposable);
}

export function deactivate() { }
