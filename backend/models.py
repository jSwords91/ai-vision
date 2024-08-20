from pydantic import BaseModel

class ImageRequest(BaseModel):
    image: str  # This will be the base64 encoded image data

class ImagePrompt(BaseModel):
    prompt: str

class Prompts(BaseModel):
    IMAGE_CAPTION_PROMPT: str = "Describe this image concisely in one sentence."
    IMAGE_GENERATION_PROMPT: str = "Generate an image of a new variation of this image."