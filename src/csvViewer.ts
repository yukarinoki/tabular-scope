import * as vscode from 'vscode';
import * as fs from 'fs';
import parse = require('csv-parse/lib/sync');

export class CSVViewer {
    public async showCSV() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        console.log('File name:', document.fileName);
        console.log('Language ID:', document.languageId);
        console.log('First 100 characters:', document.getText().substring(0, 100));

        if (document.languageId !== 'csv' && !this.looksLikeCSV(document.getText())) {
            vscode.window.showErrorMessage('Active file does not appear to be a CSV');
            return;
        }


        const filePath = document.uri.fsPath;
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        try {
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });

            const panel = vscode.window.createWebviewPanel(
                'csvViewer',
                'CSV Viewer',
                vscode.ViewColumn.Beside,
                {}
            );

            panel.webview.html = this.getWebviewContent(records);
        } catch (error) {
            vscode.window.showErrorMessage('Failed to parse CSV: ' + error);
        }
    }

    private getWebviewContent(records: any[]): string {
        const headers = Object.keys(records[0]);
        const rows = records.map(record => Object.values(record));

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CSV Viewer</title>
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    }
    private looksLikeCSV(content: string): boolean {
        const lines = content.split('\n').slice(0, 5); // 最初の5行を確認
        const commaCount = lines.map(line => (line.match(/,/g) || []).length);
        const consistentCommas = commaCount.every(count => count === commaCount[0] && count > 0);
        return consistentCommas;
    }
}
