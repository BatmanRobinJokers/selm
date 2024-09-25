// static/js/app.js
import { initUI } from './uiManager.js';
import { initDataProcessing } from './dataProcessor.js';

// Initialize the application
const initApp = () => {
    initUI();
    initDataProcessing();
};

// Run the initialization
document.addEventListener('DOMContentLoaded', initApp);
