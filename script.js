

// Stopwatch state variables
let startTime = 0;           // When the stopwatch started
let elapsedTime = 0;         // Total elapsed time
let timerInterval = null;    // Reference to setInterval
let isRunning = false;       // Is the stopwatch currently running
let lapCounter = 0;          // Number of laps recorded

// Get DOM elements
const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapTimes = document.getElementById('lapTimes');
const themeToggle = document.getElementById('themeToggle');

/**
 * Format time from milliseconds to HH:MM:SS.mmm
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    // Pad numbers with leading zeros
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const mmm = String(milliseconds).padStart(3, '0');

    return `${hh}:${mm}:${ss}<span class="milliseconds">.${mmm}</span>`;
}

/**
 * Update the time display
 */
function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timeDisplay.innerHTML = formatTime(elapsedTime);
}

/**
 * Start the stopwatch
 */
function start() {
    // Prevent multiple timers
    if (isRunning) return;

    isRunning = true;
    startTime = Date.now() - elapsedTime;
    
    // Update display every 10ms for smooth milliseconds
    timerInterval = setInterval(updateDisplay, 10);

    // Update button states
    startBtn.disabled = true;
    lapBtn.disabled = false;
}

/**
 * Stop/Pause the stopwatch
 */
function stop() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);

    // Update button states
    startBtn.disabled = false;
    lapBtn.disabled = true;
}

/**
 * Reset the stopwatch
 */
function reset() {
    stop();
    
    // Reset all variables
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 0;
    
    // Clear display and lap times
    timeDisplay.innerHTML = '00:00:00<span class="milliseconds">.000</span>';
    lapTimes.innerHTML = '';
    
    // Reset button states
    startBtn.disabled = false;
    lapBtn.disabled = true;
}

/**
 * Record a lap time
 */
function recordLap() {
    if (!isRunning) return;

    lapCounter++;
    
    // Create lap time element
    const lapElement = document.createElement('div');
    lapElement.className = 'lap-time';
    lapElement.innerHTML = `
        <span class="lap-number">Lap ${lapCounter}</span>
        <span>${formatTime(elapsedTime)}</span>
    `;
    
    // Add to the top of lap times
    lapTimes.insertBefore(lapElement, lapTimes.firstChild);
}

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Update button icon
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// Event listeners
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);

// Keyboard shortcuts (optional enhancement)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isRunning ? stop() : start();
    } else if (e.code === 'KeyR') {
        reset();
    } else if (e.code === 'KeyL' && isRunning) {
        recordLap();
    }
});

