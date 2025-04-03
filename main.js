// Updated main.js to include player controller and interaction manager
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { Circuit1BioSurvival } from './Circuit1BioSurvival.js';
// import { Circuit2EmotionalTerritorial } from './Circuit2EmotionalTerritorial.js';
// import { Circuit3Symbolic } from './Circuit3Symbolic.js';
// import { Circuit4SocialSexual } from './Circuit4SocialSexual.js';
// import { Circuit5HolisticIntuitive } from './Circuit5HolisticIntuitive.js';
// import { Circuit6Neurogenetic } from './Circuit6Neurogenetic.js';
// import { Circuit7QuantumNonlocal } from './Circuit7QuantumNonlocal.js';
// import { PlayerController } from './PlayerController.js';
// import { InteractionManager } from './InteractionManager.js';

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.querySelector('.progress-bar');
const loadingMessage = document.querySelector('.loading-message');
const gameContainer = document.getElementById('game-container');
const circuitIndicator = document.getElementById('current-circuit');
const menuButton = document.getElementById('menu-button');
const menu = document.getElementById('menu');

// Game state
let currentCircuit = 1;
let isLoading = true;
let isPaused = false;
let isOrbitControlsActive = false; // Start with player controls by default
let loadStartTime;

// Three.js components
let scene, camera, renderer, controls;
let clock;
let player, interactionManager;

// Circuit instances
let circuits = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null
};

// Initialize the game
function init() {
    console.log('Initializing game...');
    
    // Create scene
    scene = new THREE.Scene();
    console.log('Scene created');
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    console.log('Camera created with FOV:', camera.fov);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Set background color to black
    gameContainer.appendChild(renderer.domElement);
    console.log('Renderer initialized');
    
    // Create clock for timing
    clock = new THREE.Clock();
    
    // Create orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false; // Start with orbit controls disabled
    console.log('Orbit controls created');
    
    // Create player controller
    player = new PlayerController(camera, scene);
    console.log('Player controller created');
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);
    
    // Initialize UI
    initUI();
    
    // Load circuits
    loadCircuits();
    
    // Start animation loop
    animate();
    console.log('Animation loop started');
}

// Initialize UI elements
function initUI() {
    // Setup menu button
    menuButton.addEventListener('click', toggleMenu);
    
    // Setup menu options
    document.getElementById('continue-game').addEventListener('click', () => {
        menu.classList.add('hidden');
        isPaused = false;
        clock.start();
    });
    
    document.getElementById('new-game').addEventListener('click', () => {
        menu.classList.add('hidden');
        isPaused = false;
        setCircuit(1);
    });
    
    document.getElementById('settings').addEventListener('click', () => {
        console.log('Settings clicked');
    });
    
    document.getElementById('about').addEventListener('click', () => {
        console.log('About clicked');
    });
    
    // Add control mode toggle button
    const controlModeButton = document.createElement('div');
    controlModeButton.id = 'control-mode-button';
    controlModeButton.textContent = 'Toggle Controls';
    controlModeButton.style.position = 'fixed';
    controlModeButton.style.bottom = '20px';
    controlModeButton.style.left = '20px';
    controlModeButton.style.padding = '8px 12px';
    controlModeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    controlModeButton.style.color = 'rgba(0, 255, 255, 0.7)';
    controlModeButton.style.border = '1px solid rgba(0, 255, 255, 0.3)';
    controlModeButton.style.borderRadius = '3px';
    controlModeButton.style.cursor = 'pointer';
    controlModeButton.style.zIndex = '100';
    controlModeButton.style.fontSize = '12px';
    controlModeButton.style.opacity = '0.3';
    controlModeButton.style.transition = 'opacity 0.3s ease, background-color 0.3s ease';
    controlModeButton.className = 'ui-element auto-hide';
    
    controlModeButton.addEventListener('click', toggleControlMode);
    document.body.appendChild(controlModeButton);
    
    // Add minimal, collapsible instructions
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.style.position = 'fixed';
    instructions.style.bottom = '70px';
    instructions.style.left = '20px';
    instructions.style.padding = '10px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    instructions.style.color = 'rgba(255, 255, 255, 0.7)';
    instructions.style.border = '1px solid rgba(0, 255, 255, 0.3)';
    instructions.style.borderRadius = '3px';
    instructions.style.zIndex = '100';
    instructions.style.maxWidth = '250px';
    instructions.style.fontSize = '12px';
    instructions.style.opacity = '0.3';
    instructions.style.transition = 'opacity 0.3s ease, max-height 0.3s ease';
    instructions.className = 'ui-element auto-hide';
    
    // Create a minimalist design for instructions
    instructions.innerHTML = `
        <div id="controls-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; cursor: pointer;">
            <span style="color: rgba(0, 255, 255, 0.7); font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Controls</span>
            <span id="toggle-controls" style="color: rgba(0, 255, 255, 0.7);">−</span>
        </div>
        <div id="controls-content">
            <div style="display: grid; grid-template-columns: auto 1fr; grid-gap: 5px;">
                <span>WASD</span><span>Move</span>
                <span>Space</span><span>Jump</span>
                <span>Shift</span><span>Sprint</span>
                <span>E</span><span>Interact</span>
                <span>F</span><span>Circuit Action</span>
                <span>1-8</span><span>Switch Circuit</span>
                <span>ESC</span><span>Menu</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(instructions);
    
    // Make instructions toggleable
    const controlsHeader = document.getElementById('controls-header');
    const controlsContent = document.getElementById('controls-content');
    const toggleControls = document.getElementById('toggle-controls');
    
    controlsHeader.addEventListener('click', () => {
        if (controlsContent.style.display === 'none') {
            controlsContent.style.display = 'block';
            toggleControls.textContent = '−'; // Minus sign
            instructions.style.opacity = '0.8';
        } else {
            controlsContent.style.display = 'none';
            toggleControls.textContent = '+'; // Plus sign
            instructions.style.opacity = '0.3';
        }
    });
    
    // Make UI elements appear on mouse movement and hide after inactivity
    let uiTimeout;
    const uiElements = document.querySelectorAll('.auto-hide');
    
    function showUI() {
        uiElements.forEach(element => {
            element.style.opacity = '0.7';
        });
        
        clearTimeout(uiTimeout);
        uiTimeout = setTimeout(() => {
            uiElements.forEach(element => {
                element.style.opacity = '0.3';
            });
        }, 3000); // Hide after 3 seconds of inactivity
    }
    
    // Show UI on mouse movement
    document.addEventListener('mousemove', showUI);
}

// Toggle between orbit controls and player controls
function toggleControlMode() {
    isOrbitControlsActive = !isOrbitControlsActive;
    console.log(`Control mode switched: Orbit controls ${isOrbitControlsActive ? 'enabled' : 'disabled'}`);
    
    if (isOrbitControlsActive) {
        // Enable orbit controls
        controls.enabled = true;
    } else {
        // Enable player controls
        controls.enabled = false;
        
        // Reset player position
        player.setPosition(new THREE.Vector3(0, 2, 0));
        player.setRotation(new THREE.Euler(0, 0, 0));
    }
}

// Toggle menu
function toggleMenu() {
    menu.classList.toggle('hidden');
    
    if (menu.classList.contains('hidden')) {
        isPaused = false;
        clock.start();
    } else {
        isPaused = true;
        clock.stop();
    }
}

// Load circuit instances
function loadCircuits() {
    console.log('Loading circuits...');
    
    // Start loading
    startLoading();
    
    // Set a timeout to force complete loading if it takes too long
    const forceLoadTimeout = setTimeout(() => {
        console.log('WARNING: Force completing loading after timeout');
        completeLoading();
    }, 3000);
    
    try {
        console.log('Creating circuit instances...');
        
        // Create circuit instances with error handling for each
        try {
            circuits[1] = new Circuit1BioSurvival(scene, camera);
            console.log('Circuit 1 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 1:', error);
        }
        
        try {
            circuits[2] = new Circuit2EmotionalTerritorial(scene, camera);
            console.log('Circuit 2 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 2:', error);
        }
        
        try {
            circuits[3] = new Circuit3Symbolic(scene, camera);
            console.log('Circuit 3 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 3:', error);
        }
        
        try {
            circuits[4] = new Circuit4SocialSexual(scene, camera);
            console.log('Circuit 4 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 4:', error);
        }
        
        try {
            circuits[5] = new Circuit5HolisticIntuitive(scene, camera);
            console.log('Circuit 5 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 5:', error);
        }
        
        try {
            circuits[6] = new Circuit6Neurogenetic(scene, camera);
            console.log('Circuit 6 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 6:', error);
        }
        
        try {
            console.log('About to create Circuit 7...');
            if (typeof Circuit7QuantumNonlocal === 'undefined') {
                console.error('Circuit7QuantumNonlocal class is not defined!');
            } else {
                circuits[7] = new Circuit7QuantumNonlocal(scene, camera);
                console.log('Circuit 7 created successfully');
                console.log('Circuit 7 details:', {
                    isInitialized: circuits[7].isInitialized,
                    group: circuits[7].group,
                    name: circuits[7].name,
                    constructor: circuits[7].constructor.name
                });
            }
        } catch (error) {
            console.error('Error creating Circuit 7:', error);
            console.error('Circuit7QuantumNonlocal availability:', typeof Circuit7QuantumNonlocal);
        }
        
        try {
            circuits[8] = new Circuit8MetaVoid(scene, camera);
            console.log('Circuit 8 created successfully');
        } catch (error) {
            console.error('Error creating Circuit 8:', error);
        }
        
        // Log the state of all circuits
        console.log('Circuit initialization status:', {
            'Circuit 1': circuits[1] ? 'Created' : 'Failed',
            'Circuit 2': circuits[2] ? 'Created' : 'Failed',
            'Circuit 3': circuits[3] ? 'Created' : 'Failed',
            'Circuit 4': circuits[4] ? 'Created' : 'Failed',
            'Circuit 5': circuits[5] ? 'Created' : 'Failed',
            'Circuit 6': circuits[6] ? 'Created' : 'Failed',
            'Circuit 7': circuits[7] ? 'Created' : 'Failed',
            'Circuit 8': circuits[8] ? 'Created' : 'Failed'
        });
        
        // Create interaction manager
        interactionManager = new InteractionManager(player, {
            activeCircuit: circuits[currentCircuit]
        });
        console.log('Interaction manager created successfully');
        
        // Initialize first circuit
        setCircuit(1);
        
        // Simulate loading progress
        simulateLoading();
        
        // Clear the force load timeout since we completed successfully
        clearTimeout(forceLoadTimeout);
        
        console.log('All circuits loaded successfully');
    } catch (error) {
        console.error('Error in loadCircuits:', error);
    }
}

// Add this function for circuit transition effects
function createTransitionEffect() {
    // Create a full-screen overlay for the transition
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 255, 255, 0.05)';
    overlay.style.zIndex = '999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.pointerEvents = 'none';
    
    document.body.appendChild(overlay);
    
    return {
        play: function() {
            // Fade in
            overlay.style.opacity = '0.4';
            
            // Fade out after a delay
            setTimeout(() => {
                overlay.style.opacity = '0';
            }, 500);
        }
    };
}

// Set active circuit
function setCircuit(circuitNumber) {
    if (currentCircuit === circuitNumber) {
        console.log(`Already in circuit ${circuitNumber}, skipping switch`);
        return;
    }
    
    console.log(`Switching from circuit ${currentCircuit} to circuit ${circuitNumber}`);
    if (!circuits[circuitNumber]) {
        console.error(`Circuit ${circuitNumber} is not available!`);
        return;
    }
    console.log(`Circuit ${circuitNumber} object:`, circuits[circuitNumber]);
    console.log(`Circuit ${circuitNumber} isInitialized:`, circuits[circuitNumber].isInitialized);
    
    // Create transition effect
    const transition = createTransitionEffect();
    transition.play();
    
    // Hide previous circuit
    if (circuits[currentCircuit]) {
        console.log(`Hiding circuit ${currentCircuit}: ${circuits[currentCircuit].name}`);
        circuits[currentCircuit].group.visible = false;
    }
    
    // Set new circuit
    currentCircuit = circuitNumber;
    const circuitNumberElement = document.querySelector('.circuit-number');
    const circuitLabelElement = document.querySelector('.circuit-label');
    
    if (circuitNumberElement) circuitNumberElement.textContent = currentCircuit;
    
    // Update circuit label
    if (circuitLabelElement) {
        switch(currentCircuit) {
            case 1:
                circuitLabelElement.textContent = "Bio-Survival";
                break;
            case 2:
                circuitLabelElement.textContent = "Emotional";
                break;
            case 3:
                circuitLabelElement.textContent = "Symbolic";
                break;
            case 4:
                circuitLabelElement.textContent = "Social-Sexual";
                break;
            case 5:
                circuitLabelElement.textContent = "Holistic-Intuitive";
                break;
            case 6:
                circuitLabelElement.textContent = "Neurogenetic";
                break;
            case 7:
                circuitLabelElement.textContent = "Quantum-Nonlocal";
                break;
            case 8:
                circuitLabelElement.textContent = "Meta Void";
                break;
            default:
                circuitLabelElement.textContent = "Unknown";
        }
    }
    
    // Add highlight animation to the circuit indicator
    const circuitIndicator = document.querySelector('.circuit-indicator');
    if (circuitIndicator) {
        circuitIndicator.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.7)';
        circuitIndicator.style.borderColor = 'rgba(0, 255, 255, 0.7)';
        
        setTimeout(() => {
            circuitIndicator.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.1)';
            circuitIndicator.style.borderColor = 'rgba(0, 255, 255, 0.2)';
        }, 1000);
    }
    
    // Initialize and show new circuit
    if (circuits[currentCircuit]) {
        console.log(`Current circuit group before init:`, circuits[currentCircuit].group);
        console.log(`Current circuit group visibility before init:`, circuits[currentCircuit].group.visible);
        console.log(`Current circuit isInitialized:`, circuits[currentCircuit].isInitialized);
        
        try {
            if (!circuits[currentCircuit].isInitialized) {
                console.log(`Initializing circuit ${currentCircuit}`);
                circuits[currentCircuit].init();
                console.log(`Circuit ${currentCircuit} initialization complete`);
                console.log(`Circuit ${currentCircuit} isInitialized after init:`, circuits[currentCircuit].isInitialized);
            } else {
                console.log(`Circuit ${currentCircuit} was already initialized`);
            }
            
            console.log(`Showing circuit ${currentCircuit}: ${circuits[currentCircuit].name}`);
            circuits[currentCircuit].group.visible = true;
            
            console.log(`Current circuit group after show:`, circuits[currentCircuit].group);
            console.log(`Current circuit group visibility after show:`, circuits[currentCircuit].group.visible);
            console.log(`Current circuit group children:`, circuits[currentCircuit].group.children);
            
            // Update interaction manager
            if (interactionManager) {
                interactionManager.circuitManager = {
                    activeCircuit: circuits[currentCircuit]
                };
            }
        } catch (error) {
            console.error(`Error initializing circuit ${currentCircuit}:`, error);
        }
    } else {
        console.error(`Circuit ${currentCircuit} not found!`);
    }
    
    console.log(`Switched to Circuit ${currentCircuit}`);
}

// Add a visible skip button
function addSkipButton() {
    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip Loading';
    skipButton.style.position = 'absolute';
    skipButton.style.bottom = '20px';
    skipButton.style.left = '50%';
    skipButton.style.transform = 'translateX(-50%)';
    skipButton.style.padding = '10px 20px';
    skipButton.style.background = 'rgba(0, 255, 255, 0.2)';
    skipButton.style.color = '#00FFFF';
    skipButton.style.border = '1px solid #00FFFF';
    skipButton.style.borderRadius = '5px';
    skipButton.style.cursor = 'pointer';
    skipButton.style.zIndex = '2000';
    
    skipButton.addEventListener('click', () => {
        console.log('Skip button clicked');
        completeLoading();
    });
    
    loadingScreen.appendChild(skipButton);
}

// Start loading screen
function startLoading() {
    isLoading = true;
    loadStartTime = Date.now();
    loadingScreen.classList.remove('hidden');
    progressBar.style.width = '0%';
    loadingMessage.textContent = 'Initializing consciousness exploration...';
    
    // Add skip button after 2 seconds
    setTimeout(addSkipButton, 2000);
}

// Simulate loading progress
function simulateLoading() {
    console.log('Starting simulated loading progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20; // Increase by 20% each time (faster)
        console.log(`Loading progress: ${progress}%`);
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            console.log('Loading progress reached 100%, completing loading');
            clearInterval(interval);
            completeLoading();
        }
    }, 200); // Faster interval
    
    // Backup timer to ensure loading completes even if the interval fails
    setTimeout(() => {
        if (isLoading) {
            console.log('Backup timer triggered to complete loading');
            clearInterval(interval);
            completeLoading();
        }
    }, 2000);
}

// Complete loading
function completeLoading() {
    if (!isLoading) return; // Prevent multiple calls
    
    console.log('Loading complete, hiding loading screen');
    isLoading = false;
    
    // Force hide loading screen immediately if it's been too long
    const loadingTimeMs = Date.now() - loadStartTime;
    if (loadingTimeMs > 5000) {
        console.log('Loading took too long, hiding immediately');
        loadingScreen.classList.add('hidden');
        animate();
        return;
    }
    
    // Delay hiding loading screen for visual effect
    setTimeout(() => {
        console.log('Starting animation loop...');
        loadingScreen.classList.add('hidden');
        
        // Start animation loop
        animate();
    }, 1000);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Update controls
    if (controls.enabled) {
        controls.update();
    }
    
    // Update player
    if (player) {
        player.update(delta);
    }
    
    // Update current circuit
    if (circuits[currentCircuit] && circuits[currentCircuit].update) {
        circuits[currentCircuit].update(delta);
    }
    
    // Render scene
    if (scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
function onWindowResize() {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create visual feedback for key presses
function createKeyPressEffect(key) {
    // Create key indicator element
    const keyEffect = document.createElement('div');
    keyEffect.style.position = 'fixed';
    keyEffect.style.left = '50%';
    keyEffect.style.bottom = '100px';
    keyEffect.style.transform = 'translateX(-50%)';
    keyEffect.style.padding = '15px 25px';
    keyEffect.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    keyEffect.style.color = 'rgba(0, 255, 255, 0.8)';
    keyEffect.style.border = '1px solid rgba(0, 255, 255, 0.4)';
    keyEffect.style.borderRadius = '5px';
    keyEffect.style.fontSize = '24px';
    keyEffect.style.fontWeight = 'bold';
    keyEffect.style.opacity = '0';
    keyEffect.style.transition = 'all 0.3s ease';
    keyEffect.style.zIndex = '1000';
    keyEffect.textContent = key;
    
    document.body.appendChild(keyEffect);
    
    // Animate the effect
    setTimeout(() => {
        keyEffect.style.opacity = '1';
        keyEffect.style.bottom = '150px';
    }, 10);
    
    // Remove after animation completes
    setTimeout(() => {
        keyEffect.style.opacity = '0';
        keyEffect.style.bottom = '200px';
        setTimeout(() => {
            document.body.removeChild(keyEffect);
        }, 300);
    }, 800);
}

// Handle key press
function onKeyDown(event) {
    console.log('Key pressed:', event.key);
    
    switch (event.key) {
        case '1':
            createKeyPressEffect('1');
            setCircuit(1);
            break;
        case '2':
            createKeyPressEffect('2');
            setCircuit(2);
            break;
        case '3':
            createKeyPressEffect('3');
            setCircuit(3);
            break;
        case '4':
            createKeyPressEffect('4');
            setCircuit(4);
            break;
        case '5':
            createKeyPressEffect('5');
            setCircuit(5);
            break;
        case '6':
            createKeyPressEffect('6');
            setCircuit(6);
            break;
        case '7':
            createKeyPressEffect('7');
            setCircuit(7);
            break;
        case '8':
            createKeyPressEffect('8');
            setCircuit(8);
            break;
        case 'Escape':
            toggleMenu();
            break;
        case 't':
            createKeyPressEffect('T');
            toggleControlMode();
            break;
    }
}

// Document-level key handler for loading screen bypass
document.addEventListener('keydown', function(event) {
    // Allow skipping the loading screen with L key
    if (event.key === 'l' || event.key === 'L') {
        if (isLoading) {
            console.log('User manually skipped loading screen');
            completeLoading();
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    init();
});
