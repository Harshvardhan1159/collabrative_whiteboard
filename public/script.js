let canvas = document.getElementById("canvas");

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

var io = io.connect("http://localhost:8080/");

let ctx = canvas.getContext("2d");
let x = 0;
let y = 0;
let mouseDown = false;

// Handle mouse down event
window.onmousedown = (e) => {
    x = e.clientX; // Capture the current mouse position
    y = e.clientY;
    ctx.beginPath(); // Start a new path for drawing
    ctx.moveTo(x, y);
    io.emit('down', { x, y });
    mouseDown = true;
};

// Handle mouse up event
window.onmouseup = () => {
    mouseDown = false;
};

// Handle mouse move event
window.onmousemove = (e) => {
    x = e.clientX; // Update the mouse position
    y = e.clientY;

    if (mouseDown) {
        io.emit('draw', { x, y }); // Emit draw event to server
        ctx.lineTo(x, y);
        ctx.stroke(); // Draw the line
    }
};

// Listen for drawing events from other clients
io.on('ondraw', ({ x, y }) => {
    ctx.lineTo(x, y);
    ctx.stroke(); // Draw the received line segment
});

// Listen for the start of drawing from other clients
io.on('ondown', ({ x, y }) => {
    ctx.beginPath(); // Start a new path for the received coordinates
    ctx.moveTo(x, y);
});
