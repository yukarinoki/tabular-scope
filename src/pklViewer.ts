import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child_process from 'child_process';

export class PKLViewer {
    private getPythonPath(): string {
        const config = vscode.workspace.getConfiguration('tabularScope');
        return config.get('pythonPath') || 'python';
    }

    public async showPKL() {
        let filePath: string | undefined;

        // アクティブなエディタがある場合はそのファイルパスを使用
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'pkl') {
            filePath = editor.document.uri.fsPath;
        } else {
            // アクティブなエディタがない場合はファイル選択ダイアログを表示
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                filters: {
                    'Pickle Files': ['pkl']
                }
            });

            if (fileUri && fileUri[0]) {
                filePath = fileUri[0].fsPath;
            }
        }

        if (!filePath) {
            vscode.window.showErrorMessage('No PKL file selected');
            return;
        }

        try {
            const data = await this.readPKLFile(filePath);
            this.showDataInWebview(data, filePath);
        } catch (error) {
            vscode.window.showErrorMessage('Failed to read PKL file: ' + error);
        }
    }

    private readPKLFile(filePath: string): Promise<string> {
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
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(new Error(error));
                }
                fs.unlinkSync(tempScriptPath);
            });
        });
    }

    private showDataInWebview(jsonData: string, filePath: string) {
        const panel = vscode.window.createWebviewPanel(
            'pklViewer',
            `PKL Viewer: ${filePath.split('/').pop()}`,
            vscode.ViewColumn.Beside,
            {}
        );

        const data = JSON.parse(jsonData);
        const columns = data.columns;
        const rows = data.data;

        panel.webview.html = this.getWebviewContent(columns, rows);
    }

    private getWebviewContent(columns: string[], rows: any[][]): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PKL Viewer</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    }
}
