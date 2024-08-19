# TabularScope

TabularScope is a Visual Studio Code extension that enhances CSV file viewing and editing capabilities. It provides a user-friendly interface for working with CSV files directly within VS Code.

## Features

- **CSV Language Support**: Automatically recognizes and highlights CSV files.
- **CSV Viewer**: Displays CSV files in a formatted, easy-to-read table view.
- **Data Analysis**: (Coming soon) Provides basic statistical analysis of CSV data.

## (Not Yet) Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "TabularScope"
4. Click Install

## Usage

1. Open a CSV file in VS Code.
2. The file should automatically be recognized as CSV. If not, you can manually set the language mode to CSV by clicking on the language selector in the bottom-right corner of VS Code and selecting "CSV".
3. To view the CSV in table format:
   - Open the command palette (Ctrl+Shift+P)
   - Type "TabularScope: View CSV" and select the command

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

... (その他の内容) ...

## Contributing

Contributions are always welcome! 

## License

This project is licensed under the MIT License

## Support

If you encounter any problems or have any suggestions, please file an issue on the [GitHub repository](https://github.com/yukarinoki/tabular-scope/issues).

---

Happy CSV viewing with TabularScope! 📊🔍
