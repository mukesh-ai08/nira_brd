// app.js

// This file controls animations and other UI elements for the birthday experience.

const wishCarousel = document.querySelector('.wish-carousel');
const wishJar = document.querySelector('.wish-jar');
const toggleButton = document.querySelector('.theme-toggle');
const endButton = document.querySelector('.finale-mode');
const secretVaultCode = '2703';

// Function for animating elements
function animateElements() {
    // Add unique animations for the birthday experience
    wishCarousel.classList.add('active');
    wishJar.classList.add('active');
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('neon-theme');
}

// Finale mode functionality
function finaleMode() {
    console.log('Finale mode activated!');
}

toggleButton.addEventListener('click', toggleTheme);
endButton.addEventListener('click', finaleMode);

window.onload = animateElements;