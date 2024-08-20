import base64

def decode_base64_image(base64_image: str) -> str:
    return base64_image.split(',')[1] if ',' in base64_image else base64_image
