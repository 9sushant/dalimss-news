
# Content Automation Pipeline

This script automates the process of fetching content from Social Media (YouTube, Instagram), rewriting it into news articles using OpenAI GPT-4o, and publishing it to Dalimss News.

## Setup

1. **Install Dependencies**:
   ```bash
   cd scripts/content-pipeline
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory or ensure the root `.env` has the following keys:

   ```env
   # API Keys for Data Ingestion
   YOUTUBE_API_KEY=your_google_api_key
   YOUTUBE_CHANNEL_ID=comma_separated_channel_ids
   
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
   INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
   
   # LLM
   OPENAI_API_KEY=sk-...
   
   # Publication Target
   TARGET_API_URL=https://dalimss-news.vercel.app/api/posts
   PIPELINE_SECRET=your_secure_secret_string
   
   # Scheduling
   CRON_SCHEDULE="0 * * * *" # Hourly
   ```

   **Important**: You must also add `PIPELINE_SECRET` to your main project's `.env` (and Vercel Environment Variables) so the API accepts the requests.

## Running

- **Development**:
  ```bash
  node index.js
  ```
  (This runs the pipeline immediately and then waits for the schedule).

- **Production**:
  You can run this on a separate VPS, or use a GitHub Action / Vercel Cron (though Vercel Cron works differently). For a persistent listener, use `pm2` on a server:
  ```bash
  pm2 start index.js --name "content-pipeline"
  ```
