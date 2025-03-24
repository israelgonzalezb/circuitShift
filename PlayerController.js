// Create a simple player controller for the demo
// import * as THREE from 'three';

class PlayerController {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        
        // Player state
        this.position = new THREE.Vector3(0, 2, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.velocity = new THREE.Vector3();
        this.moveSpeed = 5;
        this.jumpForce = 10;
        this.gravity = 20;
        this.onGround = true;
        
        // Input state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false,
            interact: false,
            action: false
        };
        
        // Create player mesh for third-person view
        this.createPlayerMesh();
        
        // Set up input handlers
        this.setupInputHandlers();
    }
    
    createPlayerMesh() {
        // Create player geometry
        const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 8);
        
        // Create player material
        const material = new THREE.MeshStandardMaterial({
            color: 0xFF00FF, // Magenta for high visibility
            emissive: 0xFF00FF,
            emissiveIntensity: 0.8,
            metalness: 0.8,
            roughness: 0.2
        });
        
        // Create player mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Add to scene
        this.scene.add(this.mesh);
    }
    
    setupInputHandlers() {
        // Keyboard events
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        
        // Mouse events for first-person camera
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }
    
    onKeyDown(event) {
        switch (event.key) {
            case 'w': 
            case 'W': 
                this.keys.forward = true; 
                break;
            case 's': 
            case 'S': 
                this.keys.backward = true; 
                break;
            case 'a': 
            case 'A': 
                this.keys.left = true; 
                break;
            case 'd': 
            case 'D': 
                this.keys.right = true; 
                break;
            case ' ': 
                this.keys.jump = true; 
                break;
            case 'Shift': 
                this.keys.sprint = true; 
                break;
            case 'e': 
            case 'E': 
                this.keys.interact = true; 
                break;
            case 'f': 
            case 'F': 
                this.keys.action = true; 
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.key) {
            case 'w': 
            case 'W': 
                this.keys.forward = false; 
                break;
            case 's': 
            case 'S': 
                this.keys.backward = false; 
                break;
            case 'a': 
            case 'A': 
                this.keys.left = false; 
                break;
            case 'd': 
            case 'D': 
                this.keys.right = false; 
                break;
            case ' ': 
                this.keys.jump = false; 
                break;
            case 'Shift': 
                this.keys.sprint = false; 
                break;
            case 'e': 
            case 'E': 
                this.keys.interact = false; 
                break;
            case 'f': 
            case 'F': 
                this.keys.action = false; 
                break;
        }
    }
    
    onMouseMove(event) {
        // Only rotate camera if right mouse button is pressed (for demo)
        if (event.buttons === 2) {
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;
            
            this.rotation.y -= movementX * 0.002;
            this.rotation.x -= movementY * 0.002;
            
            // Clamp vertical rotation
            this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
        }
    }
    
    update(delta) {
        // Get move direction from inputs
        const moveDirection = new THREE.Vector3();
        
        if (this.keys.forward) moveDirection.z -= 1;
        if (this.keys.backward) moveDirection.z += 1;
        if (this.keys.left) moveDirection.x -= 1;
        if (this.keys.right) moveDirection.x += 1;
        
        // Debug log when movement keys are pressed, but only log once per second
        if ((this.keys.forward || this.keys.backward || this.keys.left || this.keys.right) && 
            (!this.lastLogTime || Date.now() - this.lastLogTime > 1000)) {
            console.log('Movement keys:', this.keys);
            console.log('Move direction:', moveDirection);
            this.lastLogTime = Date.now();
        }
        
        // Normalize to prevent faster diagonal movement
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
        }
        
        // Apply speed modifiers
        let speed = this.moveSpeed;
        if (this.keys.sprint) speed *= 2;
        
        // Apply movement
        this.position.x += moveDirection.x * speed * delta;
        this.position.z += moveDirection.z * speed * delta;
        
        // Apply gravity and jumping
        if (this.keys.jump && this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }
        
        // Apply gravity
        this.velocity.y -= this.gravity * delta;
        this.position.y += this.velocity.y * delta;
        
        // Simple ground collision
        if (this.position.y < 2) {
            this.position.y = 2;
            this.velocity.y = 0;
            this.onGround = true;
        }
        
        // Update mesh position
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.y = this.rotation.y;
        }
        
        // Update camera position (third-person view)
        const cameraOffset = new THREE.Vector3(0, 2, 8);
        cameraOffset.applyEuler(new THREE.Euler(0, this.rotation.y, 0));
        
        this.camera.position.copy(this.position).add(cameraOffset);
        this.camera.lookAt(this.position);
    }
    
    // Get player position
    getPosition() {
        return this.position.clone();
    }
    
    // Get player forward direction
    getForwardDirection() {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(new THREE.Euler(0, this.rotation.y, 0));
        return direction;
    }
    
    // Set player position
    setPosition(position) {
        this.position.copy(position);
        if (this.mesh) {
            this.mesh.position.copy(position);
        }
    }
    
    // Set player rotation
    setRotation(rotation) {
        this.rotation.copy(rotation);
        if (this.mesh) {
            this.mesh.rotation.y = rotation.y;
        }
    }
}
