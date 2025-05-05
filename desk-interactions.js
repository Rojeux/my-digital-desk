/* ================================
   Name: Roz Ogania
   Student ID: po4296
   CS351-01 SP25
   May 4, 2025

  File: desk-interactions.js
   ================================ */

/* ============================================
                   INITIALIZATION
   ============================================ */
// Calculator Elements
const calculator = document.getElementById('draggable-calculator');

// Notepad Elements
const notepad = document.getElementById('notepad');
const notepadTopbar = notepad.querySelector('.notepad-topbar');
const drawingArea = notepad.querySelector('.drawing-area');
const clearBtn = notepad.querySelector('.clear-btn');

// Tool Elements
const pencilTool = document.getElementById('pencil-tool');
const eraserTool = document.getElementById('eraser-tool');
const ruler = document.getElementById('ruler');
const spinner = document.getElementById('fidget-spinner');
const d20 = document.getElementById('d20');

// State Variables
let isDraggingCalculator = false;
let calculatorOffsetX, calculatorOffsetY;
let isDraggingNotepad = false;
let notepadOffsetX, notepadOffsetY;
let isDrawing = false;
let currentTool = 'pencil';
let isSpinning = false;
let spinTimeout;

/* ============================================
                   CALCULATOR
   ============================================ */
// Drag Functionality
calculator.addEventListener('mousedown', (e) => {
    isDraggingCalculator = true;
    calculatorOffsetX = e.clientX - calculator.getBoundingClientRect().left;
    calculatorOffsetY = e.clientY - calculator.getBoundingClientRect().top;
    calculator.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingCalculator) return;
    calculator.style.left = `${e.clientX - calculatorOffsetX}px`;
    calculator.style.top = `${e.clientY - calculatorOffsetY}px`;
});

document.addEventListener('mouseup', () => {
    isDraggingCalculator = false;
    calculator.style.cursor = 'grab';
    playPlaceSound();
});

// Calculator Logic
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    try {
        document.getElementById('display').value = eval(document.getElementById('display').value);
    } catch (error) {
        document.getElementById('display').value = 'ERROR';
    }
}

/* ============================================
                   NOTEPAD
   ============================================ */
// Drag Functionality
notepadTopbar.addEventListener('mousedown', (e) => {
    if (e.target === clearBtn) return;
    isDraggingNotepad = true;
    notepadOffsetX = e.clientX - notepad.getBoundingClientRect().left;
    notepadOffsetY = e.clientY - notepad.getBoundingClientRect().top;
    notepadTopbar.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDraggingNotepad) return;
    notepad.style.left = `${e.clientX - notepadOffsetX}px`;
    notepad.style.top = `${e.clientY - notepadOffsetY}px`;
});

document.addEventListener('mouseup', () => {
    isDraggingNotepad = false;
    notepadTopbar.style.cursor = 'grab';
    playPlaceSound();
});

// Drawing Functionality
drawingArea.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

drawingArea.addEventListener('mouseup', () => isDrawing = false);
drawingArea.addEventListener('mouseleave', () => isDrawing = false);
drawingArea.addEventListener('mousemove', draw);

clearBtn.addEventListener('click', () => {
    drawingArea.innerHTML = '';
});

function draw(e) {
    if (!isDrawing) return;

    const rect = drawingArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.backgroundColor = 'black';
    dot.style.borderRadius = '50%';
    dot.style.pointerEvents = 'none';
    dot.style.transform = 'translate(-50%, -50%)';

    if (x >= 0 && y >= 0 && x <= drawingArea.offsetWidth && y <= drawingArea.offsetHeight) {
        drawingArea.appendChild(dot);
    }
}

/* ============================================
                   DESK TOOLS
   ============================================ */
// Tool Selection
pencilTool.addEventListener('click', () => {
    currentTool = 'pencil';
    drawingArea.style.cursor = "crosshair";
});

eraserTool.addEventListener('click', () => {
    currentTool = 'eraser';
    drawingArea.style.cursor = "move";
});

// Drag Functionality (Generic)
function setupDrag(element) {
    let isDragging = false;
    let offsetX, offsetY;
    let originalRotation = window.getComputedStyle(element).transform;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        originalRotation = element.style.transform;
        element.style.transform = 'rotate(0deg)';
        element.style.cursor = 'grabbing';
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.transform = originalRotation;
            element.style.cursor = 'grab';
            playPlaceSound();
        }
    });
}

// Initialize Draggable Items
[
    pencilTool, eraserTool, ruler,
    document.getElementById('ballpoint-pen'),
    document.getElementById('stapler'),
    d20
].forEach(item => setupDrag(item));

/* ============================================
                   FIDGET SPINNER
   ============================================ */
spinner.addEventListener('click', () => {
    isSpinning ? stopSpinning() : startSpinning();
});

function startSpinning() {
    const direction = Math.random() > 0.5 ? 1 : -1;
    spinner.style.animation = `spin-${direction > 0 ? 'cw' : 'ccw'} 2000ms linear infinite`;
    spinner.classList.add('spinning');
    isSpinning = true;
    spinTimeout = setTimeout(stopSpinning, 100000);
}

function stopSpinning() {
    clearTimeout(spinTimeout);
    spinner.style.animation = 'none';
    spinner.classList.remove('spinning');
    isSpinning = false;
    void spinner.offsetWidth;
}
