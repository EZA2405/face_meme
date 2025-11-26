document.addEventListener('DOMContentLoaded', () => {
    const webcamElement = document.getElementById("webcam");
    const memeImage = document.getElementById("memeImage");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const aud = document.getElementById('kung_tayo');
    let audio = false;
    let predictionHistory = [];
    const HISTORY_SIZE = 5;
    let currentStableClass = "";
    const imageUrls = [
        "images/mouth.jpg",
        "images/finger.jpg", 
        "images/thumb.jpg",
        "images/shocked.jpg",
        "images/middle.jpg",
        "images/alden.png"
    ];



    imageUrls.forEach(url => {
        new Image().src = url;
    });

    async function setupWebcam() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        webcamElement.srcObject = stream;

        return new Promise(resolve => {
            webcamElement.onloadedmetadata = () => {
                resolve();
            };
        });
    };
    async function init() {
        await setupWebcam();
        const face_model = await tmImage.load("tm-model-third/model.json","tm-model-third/metadata.json");

        predictLoop(face_model, canvas, ctx);
    }

    init();

    async function predictLoop(face_model, canvas, ctx) {
        ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);

        const prediction = await face_model.predict(canvas);

        let highestProb = 0;
        let lowProb = 0.85;
        let predicted_class = "";

        prediction.forEach(p => {
            if (p.probability > highestProb) {
                highestProb = p.probability;
                predicted_class = p.className;
            }
        });

        if (highestProb < lowProb) {
            predicted_class = "Blank";
        }

        predictionHistory.push(predicted_class);
        if (predictionHistory.length > HISTORY_SIZE) {
            predictionHistory.shift();
        };

        const counts = {};
        predictionHistory.forEach(p => {
            counts[p] = (counts[p] || 0) + 1;
        });

        const mostCommon = Object.keys(counts).reduce((a, b) => 
            counts[a] > counts[b] ? a : b
        );
        
        if (counts[mostCommon] >= 3) {
            currentStableClass = mostCommon;
        }

        memeImage.classList.add('opacity-0','pointer-events-none');

        if (currentStableClass !== "Blank" && currentStableClass !== "") {
            memeImage.classList.remove('opacity-0','pointer-events-none');
        }

        switch (currentStableClass) {
            case "mouth":
                memeImage.src = "images/mouth.jpg"
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
                break;
            case "finger":
                memeImage.src = "images/finger.jpg"
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
                break;
            case "thumb":
                memeImage.src = "images/thumb.jpg"
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
                break;
            case "shocked":
                memeImage.src = "images/shocked.jpg"
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
                break;
            case "middle":
                memeImage.src = "images/middle.jpg"
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
                break;
            case "alden":
                memeImage.src = "images/alden.png"
                if (!audio) {
                    audio = true;                
                    aud.play();
                }
                break;
            default:
                memeImage.src = "";
                if (audio) {
                    aud.pause();
                    aud.currentTime = 0;
                    audio = false;
                }
        }
        setTimeout(() => {
            requestAnimationFrame(() => predictLoop(face_model, canvas, ctx));
        }, 100);  
    };
});