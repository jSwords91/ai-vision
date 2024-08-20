import httpx
from fastapi import HTTPException
from .prompts import SNAPSHOT_IMAGE_CAPTION_PROMPT, LIVE_IMAGE_CAPTION_PROMPT
from .configs import OPENAI_API_KEY, OPEN_AI_COMPLETIONS_URL

async def generate_caption(base64_image: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"{LIVE_IMAGE_CAPTION_PROMPT}"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            OPEN_AI_COMPLETIONS_URL,
            json=payload,
            headers=headers
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error from OpenAI API")
    
    return response.json()["choices"][0]["message"]["content"].strip()
