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
    console.log(JSON.stringify(data, null, 2));

    data.results.forEach(result => {
      const title = result.properties.Title?.title?.[0]?.text?.content || 'Untitled';
      const category = result.properties.Category?.rich_text?.[0]?.text?.content || 'Uncategorized';
      const contentArray = result.properties.Content?.rich_text || [];
      const content = contentArray.map(item => item.text.content).join('\n') || '';
      const slug = result.properties.Slug?.rich_text?.[0]?.text?.content || title.toLowerCase().replace(/ /g, '-');
      const date = result.properties.Date?.date?.start || new Date().toISOString().split('T')[0];

      // Print each post's details to verify the fetched data
      console.log(`Title: ${title}`);
      console.log(`Category: ${category}`);
      console.log(`Content: ${content}`);
      console.log(`Slug: ${slug}`);
      console.log(`Date: ${date}`);
      console.log("-----");

      const mdContent = `---
layout: post
title: "${title}"
date: ${date}
category: ${category}
slug: ${slug}
---

${content}
`;
      const categoryFolder = path.join(__dirname, `_posts`, category.toLowerCase().replace(/ /g, '-'));
      if (!fs.existsSync(categoryFolder)) {
        fs.mkdirSync(categoryFolder, { recursive: true });
      }
      const filename = path.join(categoryFolder, `${date}-${slug}.md`);
      fs.writeFileSync(filename, mdContent);
    });
  } catch (error) {
    console.error('Error fetching data from Notion:', error);
  }
}

fetchNotionPosts();