# フォグトリス (Fogtris)

Fogtrisは、テトリスに霧（フォグ）効果を加えた新感覚のパズルゲームです。

## 特徴
- テトリスの基本ルールに加え、盤面の一部が霧で隠れる独自要素
- 直感的な操作と美しいUI
- スコア表示や一時停止、ゲームオーバー画面などの基本機能

## セットアップ
1. このリポジトリをクローンします。
   ```bash
   git clone https://github.com/hide-yama/fogtris.git
   cd fogtris
   ```
2. 依存パッケージをインストールします。
   ```bash
   npm install
   ```

## 実行方法
ローカルサーバーでゲームを起動します。
```bash
npm run dev
```
ブラウザで `http://localhost:5173` にアクセスしてください。

## ビルド
本番用にビルドする場合：
```bash
npm run build
```

## ライセンス
このプロジェクトはMITライセンスのもとで公開されています。 