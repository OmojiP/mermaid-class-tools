# Mermaid Class Tools

chatGPTに作ってもらった
Markdown内のMermaid記述を支援するVS Code拡張機能です。

![](https://raw.githubusercontent.com/OmojiP/mermaid-class-tools/main/img/use.gif)

## 使い方

### リネーム

- リネームしたい単語ブロックの上でF2を押し、名前を変更します

### 矢印の反転

1. MermaidコードブロックのあるMarkdownファイルを開く
2. 矢印のある行にカーソルを移動
3. `Ctrl + .`（Macは`Cmd + .`）を押すと、その行の矢印が反転

### 矢印の役割確認

- 矢印にカーソルを重ねると矢印の役割説明が表示されます
- 表示言語はVS Codeの表示言語に合わせて日本語/英語で切り替わります

## 設定（機能ごとのON/OFF）

VS Codeの設定で以下を切り替えできます。

- `mermaidClassTools.enableRename` : リネーム機能
- `mermaidClassTools.enableArrowActions` : 矢印反転のクイックフィックス
- `mermaidClassTools.enableArrowHover` : 矢印説明のホバー

設定変更後は自動で反映されます。

## 多言語テキストの編集

- 文言は `src/i18n/messages.ts` のマップで一元管理しています
- 日本語は `ja`、英語は `en` を編集すると反映できます
- 設定画面の文言は `package.nls.json`（英語）/ `package.nls.ja.json`（日本語）で管理しています

## ソース構成

- `src/extension.ts` : エントリーポイント
- `src/config.ts` : 設定読み取り
- `src/constants/arrows.ts` : 矢印定義
- `src/providers/*` : 各機能プロバイダ
- `src/i18n/messages.ts` : ローカライズ文言マップ
- `src/utils/*` : 共通ユーティリティ

## 脆弱性対策

- 旧 `vsce` 依存を削除して依存関係を最小化しました
- パッケージ作成は `npm run package`（`npx @vscode/vsce package`）で実行できます
- `npm run audit` で脆弱性チェックできます

## 適用例

```mermaid
classDiagram
    class a
    class b
    a --> b
```
が以下のように変換されます：

```mermaid
classDiagram
    class a
    class b
    b <-- a
```

## インストール方法

`npm install` 後に `npm run compile` を実行し、VS CodeでF5を押すとテストできます

vscodeの拡張機能タブ→…→VSIXからのインストールから、vsixファイルを選択するとインストールできます


## GitHub

https://github.com/OmojiP/mermaid-class-tools