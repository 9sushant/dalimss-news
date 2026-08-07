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

## OTT And Podcasts

Editors can publish audio or video episodes from `/ott/new`. Episode media
uses direct multipart Vercel Blob uploads, so `BLOB_READ_WRITE_TOKEN` must be
available in the production and preview environments.

Public podcast endpoints:

- `https://dalimss.news/ott`
- `https://dalimss.news/ott/feed.xml`
