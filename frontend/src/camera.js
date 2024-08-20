export async function startCamera(videoElement) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        alert("Unable to access the camera. Please make sure you have given permission.");
    }
}

export function captureImage(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg');
}
