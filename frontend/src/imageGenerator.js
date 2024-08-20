export async function generateImage(prompt) {
    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.image_url;
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

export async function handleGenerateImage(captionElement, generateImageButton, imageContainer) {
    const currentCaption = captionElement.textContent;
    if (currentCaption && currentCaption !== 'Press \'Start Captioning\' to begin' && currentCaption !== 'Failed to get caption') {
        generateImageButton.disabled = true;
        generateImageButton.textContent = 'Generating...';
        
        try {
            const imageUrl = await generateImage(currentCaption);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Generated image based on caption';
            img.style.maxWidth = '100%';
            
            imageContainer.innerHTML = ''; // Clear previous image
            imageContainer.appendChild(img);
        } catch (error) {
            console.error('Error in handleGenerateImage:', error);
            alert(`Failed to generate image: ${error.message}. Please try again.`);
        } finally {
            generateImageButton.disabled = false;
            generateImageButton.textContent = 'Generate New Image';
        }
    } else {
        alert('Please capture an image and generate a caption first.');
    }
}
