# Dalimss News

## Search And AI Discovery

Set `INDEXNOW_KEY` in production to enable automatic IndexNow submissions when
articles are published, updated, renamed or deleted. The same key is served at
`/<INDEXNOW_KEY>.txt` for search-engine verification.

The site also publishes:

- `https://dalimss.news/robots.txt`
- `https://dalimss.news/llms.txt`
- `https://dalimss.news/sitemap.xml`
- `https://dalimss.news/news-sitemap.xml`
- `https://dalimss.news/feed.xml`
- `https://dalimss.news/varanasi/feed.xml`
- `https://dalimss.news/gurugram/feed.xml`
- `https://dalimss.news/education/feed.xml`
- `https://dalimss.news/technology/feed.xml`

## OTT

Editors can publish audio or video episodes from `/ott/new`. Episode media
uses direct Vercel Blob uploads for artwork and audio. Video uploads use Mux
for resumable ingestion, transcoding and adaptive HLS playback. Set these in
the production and preview environments:

- `BLOB_READ_WRITE_TOKEN`
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`

Public OTT endpoints:

- `https://dalimss.news/ott`
- `https://dalimss.news/ott/feed.xml`
