const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const toggleDrawingButton = document.getElementById("toggleDrawing");
let painting = false;
let drawingEnabled = false;
const lines = []; // Массив для хранения линий

function startPosition(e) {
    if (painting && drawingEnabled) {
        const line = {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop,
            color: "black",
            width: 5,
            cap: "round",
            points: [],
        };
        lines.push(line);
    }
}

function draw(e) {
    if (painting && drawingEnabled) {
        const currentLine = lines[lines.length - 1];
        currentLine.points.push({
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop,
        });

        ctx.lineWidth = currentLine.width;
        ctx.lineCap = currentLine.cap;
        ctx.strokeStyle = currentLine.color;

        ctx.beginPath();
        ctx.moveTo(currentLine.x, currentLine.y);
        for (const point of currentLine.points) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.length = 0; // Очищаем массив линий
}

function toggleDrawingMode() {
    drawingEnabled = !drawingEnabled;
    if (!drawingEnabled) {
        painting = false;
    }
}

canvas.addEventListener("mousedown", () => {
    painting = true;
    startPosition(event);
});
canvas.addEventListener("mouseup", () => {
    painting = false;
});
canvas.addEventListener("mousemove", draw);
clearButton.addEventListener("click", clearCanvas);
toggleDrawingButton.addEventListener("click", toggleDrawingMode);
// //
const movableBlock = document.getElementById("movableBlock");
const toggleMoveButton = document.getElementById("toggleMoveButton");

movableBlock.contentEditable = true;

let isDragging = false;
let offsetX, offsetY;

movableBlock.addEventListener("mousedown", (e) => {
    if (!isDragging) {
        isDragging = true;
        offsetX = e.clientX - movableBlock.getBoundingClientRect().left;
        offsetY = e.clientY - movableBlock.getBoundingClientRect().top;
        movableBlock.style.cursor = "grabbing";
    }
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        movableBlock.style.left = e.clientX - offsetX + "px";
        movableBlock.style.top = e.clientY - offsetY + "px";
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    movableBlock.style.cursor = "grab";
});

toggleMoveButton.addEventListener("click", () => {
    if (isDragging) {
        isDragging = false;
        movableBlock.style.cursor = "grab";
    } else {
        isDragging = true;
        movableBlock.style.cursor = "grabbing";
    }
});





