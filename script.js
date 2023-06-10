function extractVideoId(videoUrl) {
    const url = new URL(videoUrl);
    let videoId;
    if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1); // Remove the leading '/'
    } else {
        videoId = url.searchParams.get('v');
    }
    return videoId;
}

async function getVideoInsights() {
    try {
        const videoUrl = document.getElementById('videoUrl').value;
        const videoId = extractVideoId(videoUrl);

        simulateProgress();

        const response = await fetch(`https://openai.jettel.de/youtube/getFullTranscript?video-id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.transcript) {
            throw new Error('No transcript in the response');
        }

        downloadTranscript(data.transcript, videoId);
    } catch (error) {
        document.getElementById('results').innerText = `Error: ${error.message}`;
    }
}

function downloadTranscript(transcript, videoId) {
    const blob = new Blob([transcript], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${videoId}_transcript.txt`;
    link.click();

    document.getElementById('progress').innerText = 'Download complete!';
}

function simulateProgress() {
    let progress = 0;
    const intervalId = setInterval(() => {
        progress += 10;
        if (progress > 100) {
            clearInterval(intervalId);
            progress = 100;
        }
        document.getElementById('progress').innerText = `Progress: ${progress}%`;
    }, 1000);
}
