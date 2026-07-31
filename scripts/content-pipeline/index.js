
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// Load environment variables from the parent .env or local .env
dotenv.config();
dotenv.config({ path: '../../.env' }); 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, 'processed_ids.json');

// Configuration
const CONFIG = {
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID, // List of channel IDs comma separated
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
  INSTAGRAM_ACCOUNT_ID: process.env.INSTAGRAM_ACCOUNT_ID,
  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY, // or ANTHROPIC_API_KEY
  
  TARGET_API_URL: process.env.TARGET_API_URL || 'http://localhost:3000/api/posts',
  PIPELINE_SECRET: process.env.PIPELINE_SECRET,
  ENABLE_PUBLISHING: process.env.ENABLE_PUBLISHING === 'true',
  
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 * * * *', // Every hour
};

// Initialize OpenAI
const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });

// State Management
function getProcessedIds() {
  if (!fs.existsSync(STATE_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) { return []; }
}

function saveProcessedId(id) {
  const ids = getProcessedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    fs.writeFileSync(STATE_FILE, JSON.stringify(ids, null, 2));
  }
}

// --- INGESTION ---

async function fetchYouTubeVideos() {
  if (!CONFIG.YOUTUBE_API_KEY || !CONFIG.YOUTUBE_CHANNEL_ID) {
    console.log("Skipping YouTube: Missing API Key or Channel ID");
    return [];
  }
  
  const channels = CONFIG.YOUTUBE_CHANNEL_ID.split(',');
  let newItems = [];

  for (const channelId of channels) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5&type=video`;
      const res = await axios.get(url);
      
      for (const item of res.data.items) {
        if (!getProcessedIds().includes(item.id.videoId)) {
          newItems.push({
            id: item.id.videoId,
            source: 'YouTube',
            raw_text: item.snippet.title + "\n" + item.snippet.description,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            image_url: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching YouTube channel ${channelId}:`, error.message);
    }
  }
  return newItems;
}

async function fetchInstagramMedia() {
  if (!CONFIG.INSTAGRAM_ACCESS_TOKEN || !CONFIG.INSTAGRAM_ACCOUNT_ID) {
    console.log("Skipping Instagram: Missing Token or Account ID");
    return [];
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${CONFIG.INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${CONFIG.INSTAGRAM_ACCESS_TOKEN}&limit=5`;
    const res = await axios.get(url);
    
    let newItems = [];
    for (const item of res.data.data) {
      if (!getProcessedIds().includes(item.id)) {
        newItems.push({
          id: item.id,
          source: 'Instagram',
          raw_text: item.caption || "No Caption",
          url: item.permalink,
          image_url: item.media_url, // Note: video files might differ
          publishedAt: item.timestamp
        });
      }
    }
    return newItems;
  } catch (error) {
    console.error("Error fetching Instagram:", error.message);
    return [];
  }
}


// --- PROCESSING ---

async function transformContent(item) {
  console.log(`Processing item from ${item.source}...`);
  
  const prompt = `
    You are a professional journalist for Dalimss News. 
    Transform the following social media content into a formal news article.
    
    SOURCE: ${item.source}
    RAW CONTENT: "${item.raw_text}"
    
    REQUIREMENTS:
    1. **Title**: Catchy, SEO-optimized headline (max 10 words).
    2. **Content**: 300-500 words, journalistic tone, third-person perspective. Remove hashtags and emojis.
    3. **Category**: Choose ONE from [Politics, Entertainment, Technology, Sports, Education, General News].
    4. **Editorial summary**: A plain-text, factual summary between 100 and 160 characters.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "title": "string",
      "content": "html string (use <p>, <h2> tags)",
      "category": "string",
      "editorial_summary": "plain text string"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are an expert news editor." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return {
      ...result,
      source_url: item.url,
      source_label: `Original ${item.source} post`,
      image_url: item.image_url,
      author: "",
      image_alt_text: "",
      image_caption: "",
      reporting_basis: `Drafted from a ${item.source} post at ${item.url}. A human editor must independently verify the claims, add reporting and record contact attempts before publication.`,
      human_reviewed: false
    };
  } catch (error) {
    console.error("LLM Processing Error:", error);
    return null;
  }
}


// --- PUBLISHING ---

async function publishArticle(article) {
  if (!CONFIG.ENABLE_PUBLISHING) {
    console.log(`Review required; not published: ${article.title}`);
    return false;
  }

  if (!article.human_reviewed || !article.author || !article.reporting_basis) {
    console.error(
      `Publish blocked for "${article.title}": add a human byline, specific reporting basis and human_reviewed=true after editorial review.`
    );
    return false;
  }

  try {
    const res = await axios.post(CONFIG.TARGET_API_URL, article, {
      headers: {
        'x-api-key': CONFIG.PIPELINE_SECRET,
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ Published: ${article.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Publish Failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}


// --- MAIN LOOP ---

async function runPipeline() {
  console.log("--- Starting Pipeline Run ---");
  
  // 1. Ingest
  const ytItems = await fetchYouTubeVideos();
  const igItems = await fetchInstagramMedia();
  const allItems = [...ytItems, ...igItems];
  
  console.log(`Found ${allItems.length} new items.`);

  // 2. Process & Publish
  for (const item of allItems) {
    const article = await transformContent(item);
    
    if (article) {
      const success = await publishArticle(article);
      if (success) {
        saveProcessedId(item.id);
      }
    }
    
    // Rate limit safety
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("--- Pipeline Run Complete ---");
}

// Schedule
console.log(`Initializing Scheduler: ${CONFIG.CRON_SCHEDULE}`);
cron.schedule(CONFIG.CRON_SCHEDULE, runPipeline);

// Run immediately on start for testing
runPipeline();
