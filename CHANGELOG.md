# Changelog

## [0.2.4] - 2026-03-09

### Changed

- `mermaidClassTools.diagnosticsTriggerMode` のデフォルト値を `onSave` に変更。
  - Changed default value of `mermaidClassTools.diagnosticsTriggerMode` to `onSave`.
- README の設定項目に診断関連設定（`diagnosticsValidationMode` / `diagnosticsTriggerMode`）を追記。
  - Added diagnostics-related settings (`diagnosticsValidationMode` / `diagnosticsTriggerMode`) to README.
- README の診断機能セクションに、`full`/`light` と `onChange`/`onSave` の挙動説明を追記。
  - Added behavior details for `full`/`light` and `onChange`/`onSave` in the diagnostics section of README.

## [0.2.3] - 2026-03-09

### Added

- 診断設定を追加：
  - Added diagnostics settings:
  - `mermaidClassTools.diagnosticsValidationMode`（`full` / `light`）
  - `mermaidClassTools.diagnosticsTriggerMode`（`onChange` / `onSave`）
- 設定文言のローカライズを追加（日本語/英語）。
  - Added localized setting descriptions (Japanese/English).

### Changed

- 診断実行タイミングを `diagnosticsTriggerMode` に従うように変更。
  - Diagnostics execution timing now follows `diagnosticsTriggerMode`.
- 変更時診断の検証モードを `diagnosticsValidationMode` で切り替え可能に変更。
  - Validation mode for on-change diagnostics is now configurable via `diagnosticsValidationMode`.

## [0.2.0] - 2026-02-22

### Added

#### Features

- 対応Diagram種別を追加
  - Supported diagram types added:
  - （class/sequence/state/+flowchart/+graph/+er）
- 矢印の役割説明ホバーの内容を詳細化
  - Enhanced hover descriptions for arrow roles.
- 矢印の向き変更クイックフィックスの説明文章を改善
  - Improved description text for arrow direction change quick fixes.
- 矢印の向き変更クイックフィックスの内容をDiagram種別に応じて変更
  - Arrow direction change quick fix content now varies based on diagram type.
- 矢印インテリセンスを実装
  - Implemented arrow IntelliSense.
- Mermaidのparse/renderに基づいてエラーを検出し、エラー箇所に波線を表示
  - Detect errors based on Mermaid parsing/rendering and show wavy lines at error locations.
- 設定による機能トグル追加（デフォルトON）:
  - Feature toggles in settings (default: ON):
  - `mermaidClassTools.enableRename`
  - `mermaidClassTools.enableArrowActions`
  - `mermaidClassTools.enableArrowCompletion`
  - `mermaidClassTools.enableArrowHover`
  - `mermaidClassTools.enableDiagnostics`
- 英語追加
  - Added English localization for all features and settings.

#### Other

- TypeScript移行とソースのモジュール分割（`src/providers`, `src/utils`, `src/constants`, `src/i18n`）。
  - TypeScript migration and source modularization (`src/providers`, `src/utils`, `src/constants`, `src/i18n`).
- `README.en.md` と `CONTRIBUTING.md` を追加。
  - Added `README.en.md` and `CONTRIBUTING.md`.
- VS Codeデバッグ設定（`.vscode/launch.json`, `.vscode/tasks.json`）を追加。
  - Added VS Code debug config (`.vscode/launch.json`, `.vscode/tasks.json`).


---

## [0.1.0] - 2025-05-08

### Added

3つの機能を実装。  
Implemented three core features.

- markdownのmermaid内の単語ブロックのリネーム機能  
  Rename words inside Mermaid blocks in Markdown.
- markdownのmermaid内の反転可能な矢印の反転機能  
  Reverse reversible arrows inside Mermaid blocks in Markdown.
- 矢印の役割確認用ホバー表示  
  Show hover descriptions to explain arrow roles.
