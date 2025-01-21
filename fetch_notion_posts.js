// filepath: /c:/Users/USER/my-website/fetch_notion_posts.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;

const headers = {
  'Authorization': `Bearer ${NOTION_API_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28'
};

async function fetchNotionPosts() {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
  try {
    const response = await axios.post(url, {}, { headers });
    const data = response.data;

    // Print the raw data to see the response from Notion
    console.log("Raw data from Notion:");
    console.log(data);

    data.results.forEach(result => {
      const title = result.properties.Title.title[0].text.content;
      const category = result.properties.Category.select.name;
      const content = result.properties.Content.rich_text[0].text.content;
      const slug = result.properties.Slug.rich_text[0].text.content;
      const date = result.properties.Date.date.start;

      // Print each post's details to verify the fetched data
      console.log(`Title: ${title}`);
      console.log(`Category: ${category}`);
      console.log(`Content: ${content}`);
      console.log(`Slug: ${slug}`);
      console.log(`Date: ${date}`);
      console.log("-----");

      const mdContent = `---