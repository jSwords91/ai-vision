document.addEventListener('DOMContentLoaded', () => {
    const modules = document.querySelectorAll('.module');
    
    modules.forEach(module => {
        const toggleBtn = module.querySelector('.toggle-btn');
        const moduleTitle = module.querySelector('.module-title');
        const moduleContent = module.querySelector('.module-content');
        
        // Set initial aria-expanded state
        toggleBtn.setAttribute('aria-expanded', !module.classList.contains('collapsed'));
        
        moduleTitle.addEventListener('click', () => {
            toggleModule(module, toggleBtn);
        });
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleModule(module, toggleBtn);
        });
    });
});

function toggleModule(module, toggleBtn) {
    module.classList.toggle('collapsed');
    const isExpanded = !module.classList.contains('collapsed');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    
    const moduleContent = module.querySelector('.module-content');
    if (isExpanded) {
        moduleContent.style.maxHeight = moduleContent.scrollHeight + 'px';
    } else {
        moduleContent.style.maxHeight = null;
    }
}
const video = document.getElementById('videoElement');
const captionElement = document.getElementById('caption');
const liveCaptioningButton = document.getElementById('liveCaptioning');
const snapshotCaptionButton = document.getElementById('snapshotCaption');
const generateImageButton = document.getElementById('generateImage');
const imageContainer = document.getElementById('generatedImageContainer');

let isLiveCaptioning = false;
let liveCaptioningInterval;
const LIVE_CAPTION_INTERVAL = 5000; // 5 seconds
let captionCount = 0;

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        alert("Unable to access the camera. Please make sure you have given permission.");
    }
}

function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

async function getImageCaption(imageData) {
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

// async function updateCaption() {
//     const newCaption = await getImageCaption(captureImage());
    
//     let i = 0;
//     captionElement.textContent = '';
//     const typeWriter = () => {
//         if (i < newCaption.length) {
//             captionElement.textContent += newCaption.charAt(i);
//             i++;
//             setTimeout(typeWriter, 20);
//         }
//     };
//     typeWriter();

//     captionCount++;
// }

async function updateCaption() {
    const newCaption = await getImageCaption(captureImage());
    
    captionElement.style.transition = 'opacity 0.3s ease-in-out';
    captionElement.style.opacity = '0';
    
    setTimeout(() => {
        captionElement.textContent = newCaption;
        captionElement.style.opacity = '1';
    }, 300);

    captionCount++;
}

function startLiveCaptioning() {
    isLiveCaptioning = true;
    liveCaptioningButton.textContent = 'Stop Live Captioning';
    updateCaption(); // Initial caption
    liveCaptioningInterval = setInterval(updateCaption, LIVE_CAPTION_INTERVAL);
    snapshotCaptionButton.disabled = true;
}

function stopLiveCaptioning() {
    isLiveCaptioning = false;
    liveCaptioningButton.textContent = 'Start Live Captioning';
    clearInterval(liveCaptioningInterval);
    snapshotCaptionButton.disabled = false;
}

function toggleLiveCaptioning() {
    if (isLiveCaptioning) {
        stopLiveCaptioning();
    } else {
        startLiveCaptioning();
    }
}

async function takeSnapshotCaption() {
    if (snapshotCaptionButton.disabled) return; // Prevent multiple calls

    snapshotCaptionButton.disabled = true;
    liveCaptioningButton.disabled = true;
    captionElement.textContent = 'Analyzing image...';
    
    try {
        await updateCaption();
    } catch (error) {
        console.error('Error in takeSnapshotCaption:', error);
        captionElement.textContent = 'Failed to get caption. Please try again.';
    } finally {
        snapshotCaptionButton.disabled = false;
        liveCaptioningButton.disabled = false;
    }
}

async function generateImage(prompt) {
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

async function handleGenerateImage() {
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

window.addEventListener('load', startCamera);
liveCaptioningButton.addEventListener('click', toggleLiveCaptioning);
snapshotCaptionButton.addEventListener('click', takeSnapshotCaption);
generateImageButton.addEventListener('click', handleGenerateImage);

// start camera on load
startCamera();