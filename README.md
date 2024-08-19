# TabularScope

TabularScope is a Visual Studio Code extension that enhances CSV and PKL (Pickle) file viewing capabilities. It provides a user-friendly interface for working with tabular data directly within VS Code.

## Features

- **CSV and PKL Support**: Automatically recognizes and provides viewing capabilities for CSV and PKL files.
- **Quick View**: Right-click on CSV or PKL files in the file explorer to open them in a formatted table view.
- **Custom Python Environment**: Ability to specify a custom Python path for PKL file processing.

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "TabularScope"
4. Click Install

Alternatively, you can download the VSIX file from the [releases page](https://github.com/yourusername/tabular-scope/releases) and install it manually.

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

To set this:

1. Open VS Code settings (File > Preferences > Settings)
2. Search for "TabularScope"
3. In the "Python Path" field, enter the path to your Python executable.

For Anaconda environments, you might use something like:
```
/home/username/anaconda3/envs/your_env_name/bin/python
```

Or on Windows:
```
C:\Users\YourUsername\Anaconda3\envs\your_env_name\python.exe
```

## Requirements

- Visual Studio Code version 1.60.0 or higher
- Python with pandas library installed (for PKL file viewing)

## Known Issues

- Large CSV or PKL files (>100MB) may cause performance issues.
- PKL viewing requires a working Python environment with pandas installed.

## Release Notes

### 1.0.0

Initial release of TabularScope

- Basic CSV and PKL file viewing support
- Context menu integration for quick file opening
- Custom Python path configuration

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have any suggestions, please file an issue on the [GitHub repository](https://github.com/yourusername/tabular-scope/issues).

---

Enjoy viewing your tabular data with TabularScope! 📊🔍
