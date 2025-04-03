// Circuit 8: Meta-Void - Beyond Definition

class Circuit8MetaVoid {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.objects = [];
        this.lights = []; // Probably minimal lighting

        this.group = new THREE.Group();
        this.group.name = 'circuit8-group';
        this.scene.add(this.group);

        this.isInitialized = false;

        this.name = 'Circuit 8';
        this.description = 'Beyond Definition - The Unmanifest';
        this.circuitNumber = 8;

        this.instability = 0; // Represents the breakdown of the circuit
        this.instabilityRate = 0.01; // How quickly instability increases
        this.isStopped = false; // Track if effects are stopped

    }

    init() {
        if (this.isInitialized) return;

        console.log("Initializing Circuit 8");

        this.createEnvironment();
        this.createGlitches();
        this.createDeconstruction();
        this.createLighting();
        this.createStopButton();
        
        // Position the camera.
        if(this.camera) {
          this.camera.position.set(0, 10, 30);
          this.camera.lookAt(0, 0, 0);
        }

        this.isInitialized = true;
    }

    createEnvironment() {
        // Start with a simple, almost empty space.
        const geometry = new THREE.SphereGeometry(100, 32, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff, // Start with white
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.5,
        });
        const sphere = new THREE.Mesh(geometry, material);
        this.group.add(sphere);
        this.objects.push(sphere); // Add to objects for potential manipulation later

        // Very subtle fog
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.01);
    }

    createGlitches() {
        // Set up timers and random events to trigger glitches in update()
        // We'll implement the actual glitch effects in update()
    }

    createDeconstruction() {
        // Load and distort elements from previous circuits (Placeholder)
        // We'll implement this later
    }

    createLighting() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Pure white light
      this.group.add(ambientLight);
    }

    createStopButton() {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'circuit8-stop-button';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '50%';
        buttonContainer.style.left = '50%';
        buttonContainer.style.transform = 'translate(-50%, -50%)';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.opacity = '0.7';
        buttonContainer.style.transition = 'opacity 0.3s ease';
        buttonContainer.className = 'auto-hide';

        // Create button
        const button = document.createElement('button');
        button.textContent = 'WOW!!!';
        button.style.padding = '20px 40px';
        button.style.fontSize = '24px';
        button.style.fontWeight = 'bold';
        button.style.color = '#ffffff';
        button.style.backgroundColor = '#ff0000';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        button.style.transition = 'all 0.3s ease';

        // Add hover effect
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.7)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        });

        // Add click handler
        button.addEventListener('click', () => {
            this.isStopped = !this.isStopped;
            button.textContent = this.isStopped ? 'Paused' : 'WOW!!!';
            button.style.backgroundColor = this.isStopped ? '#00ff00' : '#ff0000';
            button.style.boxShadow = this.isStopped ? 
                '0 0 20px rgba(0, 255, 0, 0.5)' : 
                '0 0 20px rgba(255, 0, 0, 0.5)';
        });

        buttonContainer.appendChild(button);
        document.body.appendChild(buttonContainer);
    }

    update(delta) {
        if (!this.isStopped) {
            this.instability += this.instabilityRate * delta;
        }

        // Apply glitches based on instability
        this.applyGlitches();

        // Deconstruct elements based on instability (Placeholder)
    }

    applyGlitches() {
        if (this.isStopped) return;

        // Example glitches (implement these and more):
        if (Math.random() < this.instability * 0.1) {
            // Randomly change the color of an object
            if (this.objects.length > 0) {
                const randomObject = this.objects[Math.floor(Math.random() * this.objects.length)];
                this.randomizeColor(randomObject);
            }
        }

        if (Math.random() < this.instability * 0.05) {
            // Randomly distort the geometry of an object
            if (this.objects.length > 0) {
                const randomObject = this.objects[Math.floor(Math.random() * this.objects.length)];
                this.distortGeometry(randomObject);
            }
        }

        if (Math.random() < this.instability * 0.02) {
            // Change fog color
            this.scene.fog.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
        }
        if (Math.random() < this.instability * 0.02) {
            // Change sky color
            this.objects.find(obj => obj.geometry instanceof THREE.SphereGeometry).material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        }
    }
  
    randomizeColor(object) {
        if (object.material && object.material.color) {
          object.material.color.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
          if(object.material.emissive){
            object.material.emissive.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
          }
        }
    }

    distortGeometry(object) {
        if (object.geometry && object.geometry.attributes && object.geometry.attributes.position) {
            const positions = object.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 2; // Adjust distortion strength
                positions[i + 1] += (Math.random() - 0.5) * 2;
                positions[i + 2] += (Math.random() - 0.5) * 2;
            }
            object.geometry.attributes.position.needsUpdate = true;
        }
    }

    handleInteraction(type, data) {
        // Interaction might have unexpected or no consequences
        console.log("Interaction in 8.");
    }
}