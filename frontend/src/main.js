import { initializeModules } from './modules.js';
import { startCamera } from './camera.js';
import { takeSnapshotCaption, toggleLiveCaptioning } from './caption.js';
import { handleGenerateImage } from './imageGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    initializeModules();

    // Camera and captioning functionality
    const video = document.getElementById('videoElement');
    const captionElement = document.getElementById('caption');
    const liveCaptioningButton = document.getElementById('liveCaptioning');
    const snapshotCaptionButton = document.getElementById('snapshotCaption');
    const generateImageButton = document.getElementById('generateImage');
    const imageContainer = document.getElementById('generatedImageContainer');

    let isLiveCaptioning = false;

    if (video) {
        console.log("Video element found:", video);
        startCamera(video);
    } else {
        console.error("Video element not found");
    }

    liveCaptioningButton.addEventListener('click', () => {
        isLiveCaptioning = !isLiveCaptioning;
        toggleLiveCaptioning(isLiveCaptioning, video, captionElement, liveCaptioningButton, snapshotCaptionButton);
    });

    snapshotCaptionButton.addEventListener('click', () => {
        takeSnapshotCaption(video, captionElement, snapshotCaptionButton, liveCaptioningButton);
    });

    generateImageButton.addEventListener('click', () => {
        handleGenerateImage(captionElement, generateImageButton, imageContainer);
    });
});