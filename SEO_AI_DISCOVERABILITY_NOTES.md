# MeetJapan SEO / AI Discoverability Notes

## 主な流入経路

1. SNSショート動画からのブランド指名流入
- YouTube Shorts / Instagram / TikTok で MeetJapan を知る
- 指名検索やプロフィールリンクからサイトへ来る

2. Google 検索流入
- `mobile suica japan`
- `tattoo friendly onsen japan`
- `atm foreign card japan`
- `tax free shopping japan`
- `how to avoid wrong train in tokyo`

3. AI・プログラム経由の発見
- クローラーがHTML本文を直接取得
- RSS / sitemap / robots からURLを収集
- シンプルな静的構成なのでスクレイピングしやすい

## 公式ベースで重要なポイント

- 画像SEO: 画像は意味のある配置、説明的なファイル名、わかりやすい alt が重要
  - https://developers.google.com/search/docs/appearance/google-images
- sitemap: URL発見を助ける
  - https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Article structured data: 記事理解を助ける
  - https://developers.google.com/search/docs/appearance/structured-data/article
- JavaScriptに依存しすぎない: HTML本文が直接見える方がクロールに強い
  - https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

## MeetJapan に今回入れたもの

- 実記事7本
- 読了時間表示
- 関連記事導線
- 実画像 + alt + caption
- `robots.txt`
- `sitemap.xml`
- `feed.xml`
- `llms.txt`

## 公開前に差し替えるもの

- `https://meetjapan.example/` を本番ドメインへ置換
- YouTube / Instagram / TikTok の実URLを入れる
- 可能なら各記事へ Article JSON-LD を追加

## 実務的なコツ

- タイトルは「何の悩みを解決するページか」を先頭で言う
- 冒頭100〜160文字で答えの方向を明示する
- 1記事1テーマに絞る
- SNS動画と記事タイトルを近づけすぎず、記事の方を少し検索寄りにする
- 画像は雰囲気だけでなく「何の場面か」が伝わるものを使う

## AI discoverability について

- `llms.txt` はまだ統一標準ではないが、AI向けの入口として置いておく価値はある
- いちばん大事なのは、本文が静的HTMLで読めること、URLが安定していること、サイト構造が単純であること
