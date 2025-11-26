const webcamElement = document.getElementById("webcam");
const memeImage = document.getElementById("memeImage");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
    const face_model = await tmImage.load("tm-model-revised/model.json","tm-model-revised/metadata.json");

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

    memeImage.classList.add('hidden')

    if (highestProb >= lowProb && predicted_class !== "Blank") {
        memeImage.classList.remove('hidden');
    }

    switch (predicted_class) {
        case "mouth":
            memeImage.src = "images/mouth.jpg"
            break;
        case "finger":
            memeImage.src = "images/finger.jpg"
            break;
        case "thumb":
            memeImage.src = "images/thumb.jpg"
            break;
        case "shocked":
            memeImage.src = "images/shocked.jpg"
            break;
        case "middle":
            memeImage.src = "images/middle.jpg"
            break;
        default:
            memeImage.src = "";
    }
        requestAnimationFrame(() =>
            predictLoop(face_model, canvas, ctx)
    );
} 