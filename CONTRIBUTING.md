# CONTRIBUTING

このドキュメントは開発者（Contributor）向けのガイドです。
利用者向け情報は `README.md` / `README.en.md` を参照してください。

## Development Setup

1. `npm install`
2. `npm run compile`
3. VS Codeで `F5` を押して Extension Host を起動

## Scripts

- `npm run compile`: TypeScriptビルド
- `npm run watch`: 監視ビルド
- `npm run package`: VSIXパッケージ作成（`npx @vscode/vsce package`）
- `npm run audit`: 依存関係の脆弱性チェック

## Project Structure

- `src/extension.ts`: エントリーポイント
- `src/config.ts`: 設定読み取り
- `src/constants/arrows.ts`: 矢印定義
- `src/providers/*`: 各機能プロバイダ
- `src/i18n/messages.ts`: ローカライズ文言マップ
- `src/utils/*`: 共通ユーティリティ
- `test/`: 動作確認用Markdown

## Localization

- 実行時メッセージ: `src/i18n/messages.ts`
  - `ja` と `en` を編集
- 設定画面の文言: `package.nls.json`（英語） / `package.nls.ja.json`（日本語）

## Feature Flags

設定キー（すべてデフォルトON）:

- `mermaidClassTools.enableRename`
- `mermaidClassTools.enableArrowActions`
- `mermaidClassTools.enableArrowCompletion`
- `mermaidClassTools.enableArrowHover`
- `mermaidClassTools.enableDiagnostics`
