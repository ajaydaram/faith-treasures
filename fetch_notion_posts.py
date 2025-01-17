import requests
import os
from datetime import datetime

NOTION_API_TOKEN = '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'
DATABASE_ID = 'f3b3b3b3-7b7b-4b4b-8b8b-9b9b9b9b9b9b'
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def fetch_notion_posts():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    response = requests.post(url, headers=HEADERS)
    data = response.json()
    
    for result in data['results']:
        title = result['properties']['Title']['title'][0]['text']['content']
        category = result['properties']['Category']['select']['name']
        content = result['properties']['Content']['rich_text'][0]['text']['content']
        slug = result['properties']['Slug']['rich_text'][0]['text']['content']
        date = result['properties']['Date']['date']['start']
        
        md_content = f"""---
layout: post
title: "{title}"
date: {date}
category: {category}
slug: {slug}
---

{content}
"""
        filename = f"_posts/{date}-{slug}.md"
        with open(filename, 'w') as file:
            file.write(md_content)

if __name__ == "__main__":
    fetch_notion_posts()