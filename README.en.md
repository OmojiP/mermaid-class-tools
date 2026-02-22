# Mermaid Class Tools

Created with ChatGPT.
A VS Code extension that helps you write Mermaid syntax in Markdown.

![](https://raw.githubusercontent.com/OmojiP/mermaid-class-tools/main/img/use.gif)

## Usage

### Rename

- Press `F2` on the word you want to rename inside a Mermaid code block, then change the name.

### Reverse Arrows

1. Open a Markdown file that contains a Mermaid code block.
2. Move the cursor to a line with an arrow.
3. Press `Ctrl + .` (`Cmd + .` on Mac) to reverse the arrow on that line.

### Check Arrow Meaning

- Hover over an arrow to see its meaning.
- The displayed text switches between Japanese and English based on your VS Code display language.

## Settings (Per-feature ON/OFF)

You can toggle the following settings in VS Code:

- `mermaidClassTools.enableRename`: Rename feature
- `mermaidClassTools.enableArrowActions`: Quick fix for reversing arrows
- `mermaidClassTools.enableArrowCompletion`: IntelliSense suggestions for arrows
- `mermaidClassTools.enableArrowHover`: Hover descriptions for arrows
- `mermaidClassTools.enableDiagnostics`: Diagnostics for Mermaid code blocks

Changes are applied automatically after updating settings.

## Editing Localized Text

- Text is centrally managed in the map in `src/i18n/messages.ts`.
- Edit `ja` for Japanese and `en` for English.
- Settings UI labels are managed in `package.nls.json` (English) and `package.nls.ja.json` (Japanese).

## Source Structure

- `src/extension.ts`: Entry point
- `src/config.ts`: Configuration reader
- `src/constants/arrows.ts`: Arrow definitions
- `src/providers/*`: Feature providers
- `src/i18n/messages.ts`: Localization text map
- `src/utils/*`: Shared utilities

## Security Notes

- Removed legacy `vsce` dependency to minimize dependency risk.
- Package with `npm run package` (`npx @vscode/vsce package`).
- Run `npm run audit` to check vulnerabilities.

## Example

```mermaid
classDiagram
    class a
    class b
    a --> b
```

This is converted to:

```mermaid
classDiagram
    class a
    class b
    b <-- a
```

## Installation

Run `npm install`, then `npm run compile`, and press `F5` in VS Code to test the extension.

You can also install from VSIX:
Extensions tab in VS Code → `...` menu → Install from VSIX, then select the `.vsix` file.

## GitHub

https://github.com/OmojiP/mermaid-class-tools
