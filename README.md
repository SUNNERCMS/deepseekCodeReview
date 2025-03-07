# DeepSeek Code Review Assistant

A VS Code extension for managing code review comments directly in the editor.

## Features

- 📌 Add code review comments via context menu
- 📋 View all issues in a dedicated webview panel
- 🎨 Highlight problematic lines with gutter icons
- 📤 Export issues to JSON/CSV/Markdown

## Installation

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for "DeepSeek Review"
4. Click Install

## Usage

### Add an issue
1. Right-click on any code line
2. Select "Add Code Review Issue"
3. Enter description in the input box


## Configuration

Add these settings to `settings.json`:
```json
{
  "deepseekreview.severityLevels": ["low", "medium", "critical"],
  "deepseekreview.defaultExportFormat": "markdown"
}