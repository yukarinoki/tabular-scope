import * as vscode from 'vscode';
import * as fs from 'fs';
import parse = require('csv-parse/lib/sync');
import { getWebviewContent } from './webviewHelper';

export class CSVViewer {
    public async showCSV(fileUri?: vscode.Uri) {
        let filePath: string | undefined;

        if (fileUri) {
            filePath = fileUri.fsPath;
        } else {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'csv') {
                filePath = editor.document.uri.fsPath;
            } else {
                const selectedFile = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'CSV Files': ['csv']
                    }
                });
                if (selectedFile && selectedFile[0]) {
                    filePath = selectedFile[0].fsPath;
                }
            }
        }

        if (!filePath) {
            vscode.window.showErrorMessage('No CSV file selected');
            return;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');

        try {
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            }) as Record<string, string>[];

            const headers = Object.keys(records[0]);
            const rows = records.map((record: Record<string, string>) => Object.values(record));

            this.showDataInWebview(headers, rows, filePath);
        } catch (error) {
            vscode.window.showErrorMessage('Failed to parse CSV: ' + error);
        }
    }

    private showDataInWebview(headers: string[], rows: any[][], filePath: string) {
        const panel = vscode.window.createWebviewPanel(
            'csvViewer',
            `CSV Viewer: ${filePath.split('/').pop()}`,
            vscode.ViewColumn.Beside,
            {}
        );

        panel.webview.html = getWebviewContent(headers, rows);
    }

    private looksLikeCSV(content: string): boolean {
        const lines = content.split('\n').slice(0, 5); // 最初の5行を確認
        const commaCount = lines.map(line => (line.match(/,/g) || []).length);
        const consistentCommas = commaCount.every(count => count === commaCount[0] && count > 0);
        return consistentCommas;
    }
}
