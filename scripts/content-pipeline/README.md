
# Content Automation Pipeline

This script fetches social-media items and prepares AI-assisted drafts for
editorial review. Publishing is disabled by default. A social post alone is not
treated as original reporting.

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
   ENABLE_PUBLISHING=false
   
   # Scheduling
   CRON_SCHEDULE="0 * * * *" # Hourly
   ```

   **Important**: You must also add `PIPELINE_SECRET` to your main project's `.env` (and Vercel Environment Variables) so the API accepts the requests.

   Keep `ENABLE_PUBLISHING=false` while preparing drafts. Before any API
   submission, a human editor must verify the claims, add an accountable human
   byline, replace the draft reporting basis with specific documents,
   interviews, observations and contact attempts, write a plain editorial
   summary, add descriptive image alt text and a factual caption, and set
   `human_reviewed=true`. The publishing API rejects automated bylines and
   incomplete reporting metadata.

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
