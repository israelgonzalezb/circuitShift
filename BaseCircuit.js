// Base Circuit class - All circuit realms will extend this
// import * as THREE from 'three';

class BaseCircuit {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Circuit elements
        this.objects = [];
        this.lights = [];
        this.particles = [];
        
        // Circuit state
        this.isInitialized = false;
        this.isActive = false;
        
        // Circuit properties
        this.name = 'Base Circuit';
        this.description = 'Base circuit class for all realms';
        this.circuitNumber = 0;
        
        // Circuit colors
        this.primaryColor = new THREE.Color(0x00FFFF); // Cyan default
        this.secondaryColor = new THREE.Color(0xFF00FF); // Magenta default
        this.accentColor = new THREE.Color(0xFFFF00); // Yellow default
        
        // Circuit-specific group to hold all elements
        this.group = new THREE.Group();
        this.group.name = 'circuit-group';
        this.scene.add(this.group);
        
        // Transition state
        this.transitionState = 0; // 0 = not transitioning, 0-1 = transition progress
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Create circuit-specific environment
        this.createEnvironment();
        
        // Create circuit-specific lighting
        this.createLighting();
        
        // Create circuit-specific objects
        this.createObjects();
        
        // Create circuit-specific particles
        this.createParticles();
        
        this.isInitialized = true;
        console.log(`Initialized ${this.name}`);
    }
    
    createEnvironment() {
        // Override in subclasses to create environment (skybox, terrain, etc.)
        console.log(`Creating environment for ${this.name}`);
    }
    
    createLighting() {
        // Override in subclasses to create lighting
        console.log(`Creating lighting for ${this.name}`);
        
        // Default ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.group.add(ambientLight);
        this.lights.push(ambientLight);
    }
    
    createObjects() {
        // Override in subclasses to create objects
        console.log(`Creating objects for ${this.name}`);
    }
    
    createParticles() {
        // Override in subclasses to create particle systems
        console.log(`Creating particles for ${this.name}`);
    }
    
    update(delta, transitionFactor = 1.0) {
        // Update transition state
        this.transitionState = transitionFactor;
        
        // Update objects
        this.updateObjects(delta);
        
        // Update particles
        this.updateParticles(delta);
        
        // Update lighting
        this.updateLighting(delta);
    }
    
    updateObjects(delta) {
        // Override in subclasses to update objects
    }
    
    updateParticles(delta) {
        // Override in subclasses to update particle systems
    }
    
    updateLighting(delta) {
        // Override in subclasses to update lighting
    }
    
    prepareForTransitionIn() {
        // Prepare circuit for transition in
        this.group.visible = true;
        this.group.scale.set(0.001, 0.001, 0.001);
        this.group.rotation.y = Math.PI * 2 * Math.random();
        
        // Make objects transparent
        this.group.traverse((object) => {
            if (object.material && object.material.opacity !== undefined) {
                object.material.transparent = true;
                object.material.opacity = 0;
            }
        });
    }
    
    prepareForTransitionOut() {
        // Prepare circuit for transition out
    }
    
    finalizeTransitionIn() {
        // Finalize transition in
        this.isActive = true;
    }
    
    handleInteraction(type, data) {
        // Handle user interaction with the circuit
        console.log(`Interaction in ${this.name}: ${type}`, data);
    }
    
    dispose() {
        // Remove group from scene
        this.scene.remove(this.group);
        
        // Dispose geometries and materials
        this.group.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Clear arrays
        this.objects = [];
        this.lights = [];
        this.particles = [];
        
        this.isInitialized = false;
        this.isActive = false;
        
        console.log(`Disposed ${this.name}`);
    }
}
