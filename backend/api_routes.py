from fastapi import APIRouter, HTTPException
from .models import ImageRequest, ImagePrompt
from .image_processing import decode_base64_image
from .image_caption_generation import generate_caption
from .image_generation import generate_image

router = APIRouter()

@router.post("/api/caption")
async def get_caption(request: ImageRequest):
    try:
        base64_image = decode_base64_image(request.image)
        caption = await generate_caption(base64_image)
        return {"caption": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/generate-image")
async def create_image(image_prompt: ImagePrompt):
    try:
        image_url = generate_image(image_prompt.prompt)
        return {"image_url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))