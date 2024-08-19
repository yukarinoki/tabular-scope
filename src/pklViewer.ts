import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { getWebviewContent } from './webviewHelper';

export class PKLViewer {
    private getPythonPath(): string {
        const config = vscode.workspace.getConfiguration('tabularScope');
        return config.get('pythonPath') || 'python';
    }

    public async showPKL(fileUri?: vscode.Uri) {
        console.log('showPKL called with fileUri:', fileUri);

        let filePath: string | undefined;

        if (fileUri) {
            filePath = fileUri.fsPath;
            console.log('File path from fileUri:', filePath);
        } else {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'pkl') {
                filePath = editor.document.uri.fsPath;
                console.log('File path from active editor:', filePath);
            } else {
                console.log('No active PKL editor, showing file dialog');
                const selectedFile = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'PKL Files': ['pkl']
                    }
                });
                if (selectedFile && selectedFile[0]) {
                    filePath = selectedFile[0].fsPath;
                    console.log('File path from dialog:', filePath);
                }
            }
        }

        if (!filePath) {
            console.log('No file path selected');
            vscode.window.showErrorMessage('No PKL file selected');
            return;
        }

        console.log('Attempting to read PKL file:', filePath);

        try {
            const data = await this.readPKLFile(filePath);
            console.log('PKL file read successfully');
            this.showDataInWebview(data, filePath);
        } catch (error) {
            console.error('Failed to read PKL file:', error);
            vscode.window.showErrorMessage('Failed to read PKL file: ' + error);
        }
    }

    private async readPKLFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const pythonScript = `
import pandas as pd
import sys
import json

df = pd.read_pickle(sys.argv[1])
print(df.to_json(orient='split'))
            `;

            const tempScriptPath = '/tmp/read_pkl.py';
            fs.writeFileSync(tempScriptPath, pythonScript);

            const pythonPath = this.getPythonPath();
            console.log('Using Python path:', pythonPath);

            const process = child_process.spawn(pythonPath, [tempScriptPath, filePath]);
            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                console.log('Python process closed with code:', code);
                if (code === 0) {
                    resolve(output);
                } else {
                    console.error('Python script error:', error);
                    reject(new Error(error));
                }
                fs.unlinkSync(tempScriptPath);
            });
        });
    }

    private showDataInWebview(jsonData: string, filePath: string) {
        console.log('Showing data in webview for file:', filePath);

        const panel = vscode.window.createWebviewPanel(
            'pklViewer',
            `PKL Viewer: ${filePath.split('/').pop()}`,
            vscode.ViewColumn.Beside,
            {}
        );

        const data = JSON.parse(jsonData);
        const columns = data.columns;
        const rows = data.data;

        panel.webview.html = getWebviewContent(columns, rows);
    }
}
