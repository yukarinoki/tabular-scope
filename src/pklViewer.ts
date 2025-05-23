import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { getWebviewContent } from './webviewHelper';

export class PKLViewer {
    private getPythonPath(): string {
        const config = vscode.workspace.getConfiguration('tabularScope');
        return config.get('pythonPath') || 'python';
    }

    private isDebugLoggingEnabled(): boolean {
        const config = vscode.workspace.getConfiguration('tabularScope');
        return config.get('enableDebugLogging') || false;
    }

    private debugLog(message: string): void {
        if (this.isDebugLoggingEnabled()) {
            console.log(`[TabularScope Debug] ${message}`);
        }
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
        this.debugLog(`Starting PKL file read for: ${filePath}`);

        try {
            const data = await this.readPKLFile(filePath);
            console.log('PKL file read successfully');
            this.debugLog('PKL file read successfully, showing in webview');
            this.showDataInWebview(data, filePath);
        } catch (error) {
            console.error('Failed to read PKL file:', error);
            this.debugLog(`PKL file read failed: ${error}`);
            vscode.window.showErrorMessage('Failed to read PKL file: ' + error);
        }
    }

    private async readPKLFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const pythonScript = `
import pandas as pd
import sys
import json
import pickle
import warnings

def robust_pickle_read(file_path):
    """
    Robust pickle reading with multiple fallback methods to handle numpy compatibility issues
    """
    methods = [
        # Method 1: Standard pandas read_pickle
        lambda: pd.read_pickle(file_path),
        
        # Method 2: Direct pickle load with pandas DataFrame reconstruction
        lambda: load_with_direct_pickle(file_path),
        
        # Method 3: Pickle load with numpy compatibility fixes
        lambda: load_with_numpy_fallback(file_path),
        
        # Method 4: Try with different pickle protocols
        lambda: load_with_protocol_fallback(file_path)
    ]
    
    last_error = None
    for i, method in enumerate(methods):
        try:
            print(f"Trying method {i+1}...", file=sys.stderr)
            result = method()
            print(f"Success with method {i+1}", file=sys.stderr)
            return result
        except Exception as e:
            print(f"Method {i+1} failed: {str(e)}", file=sys.stderr)
            last_error = e
            continue
    
    raise Exception(f"All methods failed. Last error: {str(last_error)}")

def load_with_direct_pickle(file_path):
    """Direct pickle load approach"""
    with open(file_path, 'rb') as f:
        data = pickle.load(f)
    
    # If it's already a DataFrame, return it
    if isinstance(data, pd.DataFrame):
        return data
    
    # Try to convert to DataFrame if possible
    try:
        return pd.DataFrame(data)
    except:
        # If conversion fails, create a simple DataFrame with the data
        return pd.DataFrame({'data': [str(data)]})

def load_with_numpy_fallback(file_path):
    """Load with numpy compatibility fixes"""
    import importlib
    
    # Try to fix numpy._core.numeric issue
    try:
        import numpy
        if hasattr(numpy, '_core') and not hasattr(numpy._core, 'numeric'):
            # Create the missing module reference
            numpy._core.numeric = numpy.core.numeric
    except:
        pass
    
    # Try to fix other common numpy compatibility issues
    try:
        import numpy.core.numeric as numeric
        sys.modules['numpy._core.numeric'] = numeric
    except:
        pass
    
    return pd.read_pickle(file_path)

def load_with_protocol_fallback(file_path):
    """Try loading with different pickle protocols"""
    with open(file_path, 'rb') as f:
        # Try different unpickling approaches
        try:
            # Reset file pointer
            f.seek(0)
            unpickler = pickle.Unpickler(f)
            data = unpickler.load()
            
            if isinstance(data, pd.DataFrame):
                return data
            else:
                return pd.DataFrame(data)
        except:
            # If that fails, try with encoding
            f.seek(0)
            data = pickle.load(f, encoding='latin1')
            if isinstance(data, pd.DataFrame):
                return data
            else:
                return pd.DataFrame(data)

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

try:
    file_path = sys.argv[1]
    print(f"Attempting to read PKL file: {file_path}", file=sys.stderr)
    
    df = robust_pickle_read(file_path)
    
    # Convert to JSON
    result = df.to_json(orient='split')
    print(result)
    
except Exception as e:
    print(f"Error reading PKL file: {str(e)}", file=sys.stderr)
    print(f"Suggestion: Try updating numpy/pandas or use a different Python environment", file=sys.stderr)
    sys.exit(1)
            `;

            const tempScriptPath = '/tmp/read_pkl.py';
            fs.writeFileSync(tempScriptPath, pythonScript);

            const pythonPath = this.getPythonPath();
            console.log('Using Python path:', pythonPath);
            this.debugLog(`Python path: ${pythonPath}`);
            this.debugLog(`Temp script path: ${tempScriptPath}`);
            this.debugLog(`Target PKL file: ${filePath}`);

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
                console.log('Python stderr output:', error);

                if (code === 0) {
                    resolve(output);
                } else {
                    console.error('Python script error:', error);

                    // Provide more helpful error messages
                    let userFriendlyError = error;
                    if (error.includes('numpy._core.numeric')) {
                        userFriendlyError = `Numpy compatibility issue detected. This usually happens when the PKL file was created with a different numpy version.\n\nSuggestions:\n1. Update numpy: pip install --upgrade numpy\n2. Use a different Python environment\n3. Configure a specific Python path in settings\n\nOriginal error: ${error}`;
                    } else if (error.includes('ModuleNotFoundError')) {
                        userFriendlyError = `Missing Python dependencies. Please ensure pandas and numpy are installed in your Python environment.\n\nTry: pip install pandas numpy\n\nOriginal error: ${error}`;
                    }

                    reject(new Error(userFriendlyError));
                }

                // Clean up temp file
                try {
                    fs.unlinkSync(tempScriptPath);
                } catch (cleanupError) {
                    console.warn('Failed to cleanup temp file:', cleanupError);
                }
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
