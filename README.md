# TabularScope

TabularScope is a Visual Studio Code extension that enhances CSV and PKL (Pickle) file viewing capabilities. It provides a user-friendly interface for working with tabular data directly within VS Code.

## Features

- **CSV and PKL Support**: Automatically recognizes and provides viewing capabilities for CSV and PKL files.
- **Quick View**: Right-click on CSV or PKL files in the file explorer to open them in a formatted table view.
- **Custom Python Environment**: Ability to specify a custom Python path for PKL file processing.
- **Robust PKL Reading**: Advanced error handling with multiple fallback methods for numpy compatibility issues.
- **Debug Logging**: Optional debug logging for troubleshooting PKL file reading issues.

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "TabularScope"
4. Click Install

Alternatively, you can download the VSIX file from the [releases page](https://github.com/yukarinoki/tabular-scope/releases) and install it manually.

## Usage

### Viewing CSV Files

1. Open a CSV file in VS Code or right-click on a CSV file in the file explorer.
2. Either:
   - Use the command palette (Ctrl+Shift+P) and type "TabularScope: View CSV"
   - Or, select "Open with TabularScope" from the context menu.
3. The CSV content will be displayed in a formatted table view.

### Viewing PKL Files

1. Open a PKL file in VS Code or right-click on a PKL file in the file explorer.
2. Either:
   - Use the command palette (Ctrl+Shift+P) and type "TabularScope: View PKL"
   - Or, select "Open with TabularScope" from the context menu.
3. The PKL content will be displayed in a formatted table view.

## Configuration

TabularScope can be customized with the following settings:

* `tabularScope.pythonPath`: Specify the path to the Python executable. This is useful when using Anaconda environments or custom Python installations.
* `tabularScope.enableDebugLogging`: Enable debug logging for PKL file reading operations (useful for troubleshooting).

To configure these settings:

1. Open VS Code settings (File > Preferences > Settings)
2. Search for "TabularScope"
3. Configure the desired options

### Python Path Examples

For Anaconda environments:
```bash
# Linux/macOS
/home/username/anaconda3/envs/your_env_name/bin/python

# Windows
C:\Users\username\Anaconda3\envs\your_env_name\python.exe
```

For virtual environments:
```bash
# Linux/macOS
/path/to/your/venv/bin/python

# Windows
C:\path\to\your\venv\Scripts\python.exe
```

## Requirements

- Visual Studio Code version 1.60.0 or higher
- Python with pandas and numpy libraries installed (for PKL file viewing)

### Installing Python Dependencies

Install the required dependencies using pip:

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install pandas numpy
```

For Anaconda users:
```bash
conda install pandas numpy
```

## Troubleshooting

### PKL File Reading Issues

If you encounter errors when reading PKL files, try the following:

#### Numpy Compatibility Issues
The most common issue is numpy version compatibility. PKL files created with different numpy versions may not be compatible.

**Error**: `ModuleNotFoundError: No module named 'numpy._core.numeric'`

**Solutions**:
1. **Update numpy**: `pip install --upgrade numpy`
2. **Use a different Python environment** with compatible versions
3. **Configure a specific Python path** in TabularScope settings
4. **Enable debug logging** to get more detailed error information

#### Missing Dependencies
**Error**: `ModuleNotFoundError: No module named 'pandas'`

**Solution**: Install required dependencies:
```bash
pip install pandas numpy
```

#### Python Environment Issues
1. Ensure the configured Python path is correct
2. Verify that pandas and numpy are installed in the specified environment
3. Enable debug logging for detailed troubleshooting information

### Debug Mode

Enable debug logging in settings to get detailed information about PKL file reading operations:

1. Open VS Code settings
2. Search for "TabularScope"
3. Enable "Enable Debug Logging"
4. Check the VS Code Developer Console (Help > Toggle Developer Tools) for detailed logs

## Advanced Features

### Robust PKL Reading

TabularScope now includes advanced error handling for PKL files with multiple fallback methods:

1. **Standard pandas read_pickle**: The default method
2. **Direct pickle load**: For files that can't be read by pandas directly
3. **Numpy compatibility fixes**: Automatically handles numpy version compatibility issues
4. **Protocol fallback**: Tries different pickle protocols and encodings

This ensures maximum compatibility with PKL files created in different environments.

## Known Issues

- Large CSV or PKL files (>100MB) may cause performance issues
- PKL files created with significantly different numpy/pandas versions may require environment adjustments
- Some complex PKL objects may not display properly in table format

## Release Notes

### 0.0.3

Enhanced PKL file support:
- Added robust error handling for numpy compatibility issues
- Multiple fallback methods for PKL file reading
- Debug logging functionality
- Improved error messages with troubleshooting suggestions
- Added requirements.txt for easy dependency management

### 0.0.2

Initial release of TabularScope:
- Basic CSV and PKL file viewing support
- Context menu integration for quick file opening
- Custom Python path configuration

## Contributing

Contributions are always welcome!

## License

This project is licensed under the MIT License.

## Support

If you encounter any problems or have any suggestions, please file an issue on the [GitHub repository](https://github.com/yukarinoki/tabular-scope/issues).

---

Enjoy viewing your tabular data with TabularScope! 📊🔍
