import { captureImage } from './camera.js';

const LIVE_CAPTION_INTERVAL = 5000; // 5 seconds
let liveCaptioningInterval;

export async function getImageCaption(imageData) {
    try {
        const response = await fetch('/api/caption', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.caption;
    } catch (error) {
        console.error('Error getting image caption:', error);
        return 'Failed to get caption';
    }
}

export async function updateCaption(videoElement, captionElement) {
    const newCaption = await getImageCaption(captureImage(videoElement));
    
    captionElement.style.transition = 'opacity 0.3s ease-in-out';
    captionElement.style.opacity = '0';
    
    setTimeout(() => {
        captionElement.textContent = newCaption;
        captionElement.style.opacity = '1';
    }, 300);
}


export async function takeSnapshotCaption(videoElement, captionElement, snapshotCaptionButton, liveCaptioningButton) {
    if (snapshotCaptionButton.disabled) return; // Prevent multiple calls

    snapshotCaptionButton.disabled = true;  // Disable the button
    liveCaptioningButton.disabled = true;
    snapshotCaptionButton.textContent = 'Generating...'; // Indicate action
    captionElement.textContent = 'Analyzing image...';

    try {
        await updateCaption(videoElement, captionElement);  // Generate the caption
    } catch (error) {
        console.error('Error in takeSnapshotCaption:', error);
        captionElement.textContent = 'Failed to get caption. Please try again.';
    } finally {
        snapshotCaptionButton.disabled = false;  // Re-enable the button
        liveCaptioningButton.disabled = false;
        snapshotCaptionButton.textContent = 'Snapshot Caption'; // Reset text
    }
}

export function startLiveCaptioning(videoElement, captionElement, liveCaptioningButton, snapshotCaptionButton) {
    liveCaptioningButton.textContent = 'Stop Live Captioning';
    updateCaption(videoElement, captionElement); // Initial caption
    liveCaptioningInterval = setInterval(() => updateCaption(videoElement, captionElement), LIVE_CAPTION_INTERVAL);
    snapshotCaptionButton.disabled = true;
}

export function stopLiveCaptioning(liveCaptioningButton, snapshotCaptionButton) {
    clearInterval(liveCaptioningInterval);
    liveCaptioningButton.textContent = 'Start Live Captioning';
    snapshotCaptionButton.disabled = false;
}

export function toggleLiveCaptioning(isLiveCaptioning, videoElement, captionElement, liveCaptioningButton, snapshotCaptionButton) {
    if (isLiveCaptioning) {
        stopLiveCaptioning(liveCaptioningButton, snapshotCaptionButton);
    } else {
        startLiveCaptioning(videoElement, captionElement, liveCaptioningButton, snapshotCaptionButton);
    }
}
