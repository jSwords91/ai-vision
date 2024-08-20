from openai import OpenAI
from .configs import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

STYLE = ". The image should be suitable for a LinkedIn profile picture."

def generate_image(prompt: str):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt= prompt + STYLE,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        raise