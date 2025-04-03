// Circuit 7: Quantum-Nonlocal - Universal Consciousness
window.Circuit7QuantumNonlocal = class Circuit7QuantumNonlocal {
    constructor(scene, camera) {
        console.log("Constructing Circuit7QuantumNonlocal");
        // Scene and camera references
        this.scene = scene;
        this.camera = camera;
  
        // Circuit elements
        this.objects = [];
        this.lights = [];
        this.particles = [];
        this.entangledObjects = []; // Store pairs/groups of entangled objects
        this.trails = []; // To store trail meshes
  
        this.group = new THREE.Group();
        this.group.name = 'circuit7-group';
        this.scene.add(this.group);
  
        this.isInitialized = false;
  
        this.name = 'Circuit 7: Quantum-Nonlocal';
        this.description = 'Universal Consciousness and Non-Locality';
        this.circuitNumber = 7;
  
        this.primaryColor = new THREE.Color(0x00008B);   // Dark Blue
        this.secondaryColor = new THREE.Color(0x8A2BE2); // Blue Violet
        this.accentColor = new THREE.Color(0xFFD700);   // Gold
  
        // Non-Local Effect Parameters
        this.nonLocalDistortionStrength = 0.1;
        this.nonLocalTeleportChance = 0.001;
        this.nonLocalFlickerChance = 0.005;
        this.nonLocalDisplacementStrength = 5;
  
        // Entangled Object Parameters
        this.numEntangledPairs = 5;
        this.entangledObjectRadius = 2;
        this.trailLength = 20;
  
        // Pyramid parameters
        this.pyramidBaseRadius = 15;
        this.pyramidHeight = 25;
        this.pyramidRadialSegments = 4;
        this.pyramidHeightSegments = 8;
        
        console.log("Circuit7QuantumNonlocal construction complete");
    }
  
    init() {
        console.log("Circuit7QuantumNonlocal init called");
        if (this.isInitialized) {
            console.log("Circuit7QuantumNonlocal already initialized, returning");
            return;
        }
  
        console.log("Initializing Circuit 7: Quantum-Nonlocal");
        try {
            // Ensure group is visible
            this.group.visible = true;
            console.log("Circuit 7 group visibility:", this.group.visible);
            
            this.createEnvironment();
            console.log("Environment created");
            
            this.createNonLocalEffects();
            console.log("Non-local effects created");
            
            this.createEntangledObjects();
            console.log("Entangled objects created");
            
            this.createIntegrationElements();
            console.log("Integration elements created");
            
            this.createLighting();
            console.log("Lighting created");
  
            if (this.camera) {
                this.camera.position.set(0, 50, 100);
                this.camera.lookAt(0, 20, 0);
                console.log("Camera positioned at:", this.camera.position);
            }
  
            this.isInitialized = true;
            console.log("Circuit 7 initialization complete");
            console.log("Number of objects created:", this.objects.length);
            console.log("Number of entangled pairs:", this.entangledObjects.length);
            console.log("Group children count:", this.group.children.length);
            console.log("Final group visibility:", this.group.visible);
        } catch (error) {
            console.error("Could not initialize Circuit 7:", error);
            throw error; // Re-throw to ensure the error is caught in setCircuit
        }
    }
  
    createEnvironment() {
        console.log("Creating environment for Circuit 7");
        
        // Vast, cosmic environment with slightly brighter background
        const skyGeometry = new THREE.SphereGeometry(500, 64, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000022, // Slightly brighter dark blue
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8, // More transparent to see objects better
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.group.add(sky);
        this.objects.push(sky);
        
        console.log("Environment created");
        
        // Reduce fog density for better visibility
        this.scene.fog = new THREE.FogExp2(0x000022, 0.0005); // Reduced density
        console.log("Fog density set to 0.0005");
    }
  
  createNonLocalEffects() {
    // Implemented in update()
  }
  
    createEntangledObjects() {
        console.log("Starting to create entangled objects");
        
        const objectGeometry = new THREE.SphereGeometry(this.entangledObjectRadius, 16, 16);
        const objectMaterial = new THREE.MeshStandardMaterial({
            color: this.secondaryColor,
            emissive: this.secondaryColor,
            emissiveIntensity: 2.0, // Doubled for even better visibility
            metalness: 0.3, // Reduced for better light reflection
            roughness: 0.4, // Reduced for better light reflection
        });
  
        for (let i = 0; i < this.numEntangledPairs; i++) {
            console.log(`Creating entangled pair ${i}`);
            
            const object1 = new THREE.Mesh(objectGeometry, objectMaterial.clone());
            const object2 = new THREE.Mesh(objectGeometry, objectMaterial.clone());
  
            // Position objects in a more visible range
            object1.position.set(
                (Math.random() - 0.5) * 20,
                30 + Math.random() * 20,
                (Math.random() - 0.5) * 20
            );
            object2.position.set(
                (Math.random() - 0.5) * 20,
                30 + Math.random() * 20,
                (Math.random() - 0.5) * 20
            );
  
            // Make objects larger for better visibility
            const scale = 2.0;
            object1.scale.set(scale, scale, scale);
            object2.scale.set(scale, scale, scale);
  
            console.log(`Created entangled pair ${i} at positions:`, 
                object1.position, object2.position);
  
            object1.userData = {
                type: 'entangledObject',
                partner: object2,
                id: i * 2,
                originalPosition: object1.position.clone(),
                trail: [],
            };
            object2.userData = {
                type: 'entangledObject',
                partner: object1,
                id: i * 2 + 1,
                originalPosition: object2.position.clone(),
                trail: [],
            };
  
            // Ensure objects are visible
            object1.visible = true;
            object2.visible = true;
            
            // Add objects to the scene
            this.group.add(object1);
            this.group.add(object2);
            
            // Keep track of objects
            this.objects.push(object1);
            this.objects.push(object2);
            this.entangledObjects.push([object1, object2]);
  
            console.log(`Added entangled pair ${i} to scene`);
            console.log(`Object 1 visibility:`, object1.visible);
            console.log(`Object 2 visibility:`, object2.visible);
            
            this.createTrail(object1);
            this.createTrail(object2);
        }
        
        console.log(`Created ${this.entangledObjects.length} entangled pairs`);
        console.log(`Total objects in group:`, this.group.children.length);
    }
  
    createTrail(object) {
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.trailLength * 3); // x, y, z for each point
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
        const trailMaterial = new THREE.LineBasicMaterial({
            color: this.secondaryColor,
            transparent: true,
            opacity: 0.5,
        });
  
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        trail.userData = {
            type: 'objectTrail',
            object: object, // Reference to the object
        };
  
        this.group.add(trail);
        this.trails.push(trail); // Keep track of trails for updates
        this.objects.push(trail); // Add to objects for scene management
    }
  
    createIntegrationElements() {
        // Circuit 1 (Breathing): A slow, cosmic pulse
        const pulse = {
            scale: 1.0,
            speed: 0.0005, // Very slow
            min: 0.98,
            max: 1.02,
        };
        this.pulse = pulse; // Store for use in update()
  
        // Use ConeGeometry for a pyramid shape with more detail control
        const symbolGeometry = new THREE.ConeGeometry(
            this.pyramidBaseRadius, // radius
            this.pyramidHeight,     // height
            this.pyramidRadialSegments, // radialSegments (4 for a pyramid)
            this.pyramidHeightSegments  // heightSegments (add detail)
        );
  
        // Use MeshStandardMaterial for better lighting and visual quality
        const symbolMaterial = new THREE.MeshStandardMaterial({
            color: this.accentColor,
            emissive: this.accentColor,
            emissiveIntensity: 0.5, // Increased glow
            transparent: true,
            opacity: 0.8, // Increased opacity
            wireframe: true,
            metalness: 0.2,
            roughness: 0.6,
            side: THREE.DoubleSide,
        });
  
        const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
        symbol.position.set(0, this.pyramidHeight / 2, 0); // Position base at y=0
        symbol.userData = { type: "symbol" }; //For updating later.
        this.group.add(symbol);
        this.objects.push(symbol);
    }
  
    createLighting() {
        console.log("Creating lighting for Circuit 7");
        
        // Brighter ambient light
        const ambientLight = new THREE.AmbientLight(0x444466, 3.0); // Increased intensity
        this.group.add(ambientLight);
        this.lights.push(ambientLight);
        console.log("Added ambient light");
  
        // Brighter directional light
        const directionalLight = new THREE.DirectionalLight(0x6688aa, 2.0); // Increased intensity
        directionalLight.position.set(1, 1, -1);
        this.group.add(directionalLight);
        this.lights.push(directionalLight);
        console.log("Added directional light");
  
        // Brighter point lights
        const pointLight1 = new THREE.PointLight(this.primaryColor, 2.0, 150); // Increased intensity and range
        pointLight1.position.set(20, 30, 20);
        this.group.add(pointLight1);
        this.lights.push(pointLight1);
        console.log("Added point light 1");
  
        const pointLight2 = new THREE.PointLight(this.secondaryColor, 2.0, 150); // Increased intensity and range
        pointLight2.position.set(-20, 30, -20);
        this.group.add(pointLight2);
        this.lights.push(pointLight2);
        console.log("Added point light 2");
        
        console.log("Lighting setup complete");
    }
  
    update(delta) {
        // Apply non-local effects
        this.applyNonLocalEffects(delta);
  
        // Update entangled objects
        this.entangledObjects.forEach(pair => {
            const object1 = pair[0];
            const object2 = pair[1];
  
            //  Make them pulse in sync
            const scale = 1 + 0.1 * Math.sin(Date.now() * 0.003 + object1.userData.id); // Use id for offset
            object1.scale.set(scale, scale, scale);
            object2.scale.set(scale, scale, scale);
            if (object1.material && object2.material) {
              object1.material.emissiveIntensity = 0.6 + 0.2 * Math.sin(Date.now() * 0.003 + object1.userData.id);
              object2.material.emissiveIntensity = object1.material.emissiveIntensity;
            }
  
            // Update trails
            this.updateTrail(object1);
            this.updateTrail(object2);
        });
  
        // Update integrated elements
        if (this.pulse) {
            this.pulse.scale += this.pulse.speed;
            if (this.pulse.scale > this.pulse.max || this.pulse.scale < this.pulse.min) {
                this.pulse.speed *= -1;
            }
            this.group.scale.set(this.pulse.scale, this.pulse.scale, this.pulse.scale);
        }
  
        const symbol = this.objects.find(obj => obj.userData.type === "symbol");
        if (symbol) {
            symbol.rotation.x += 0.01 * delta; // Scale rotation by delta
            symbol.rotation.y += 0.01 * delta;
  
            // Subtle pulsing opacity for the symbol
            symbol.material.opacity = 0.4 + 0.2 * Math.sin(Date.now() * 0.001);
            symbol.material.emissiveIntensity = 0.2 + 0.2 * Math.sin(Date.now() * 0.002);
        }
    }
  
    updateTrail(object) {
        // Find the trail associated with this object
        const trail = this.trails.find(t => t.userData.object === object);
        if (!trail) return;
  
        // Add current position to the object's trail data
        object.userData.trail.push(object.position.clone());
  
        // Keep only the last 'trailLength' points
        if (object.userData.trail.length > this.trailLength) {
            object.userData.trail.shift(); // Remove the oldest point
        }
  
        // Update the trail geometry
        const positions = trail.geometry.attributes.position.array;
        let vertexIndex = 0;
        for (let i = 0; i < object.userData.trail.length; i++) {
            const point = object.userData.trail[i];
            positions[vertexIndex++] = point.x;
            positions[vertexIndex++] = point.y;
            positions[vertexIndex++] = point.z;
        }
  
        // Pad the rest with the last known position to avoid visual glitches
        const lastPoint = object.userData.trail.length > 0 ? object.userData.trail[object.userData.trail.length-1] : object.position;
        while (vertexIndex < positions.length) {
          positions[vertexIndex++] = lastPoint.x;
          positions[vertexIndex++] = lastPoint.y;
          positions[vertexIndex++] = lastPoint.z;
        }
  
        trail.geometry.attributes.position.needsUpdate = true;
        trail.geometry.setDrawRange(0, object.userData.trail.length); //  draw only the needed points
  
        // Fade the trail
        trail.material.opacity = 0.5 * (object.userData.trail.length / this.trailLength);
    }
  
    applyNonLocalEffects(delta) {
      this.objects.forEach(object => {
        if (!object.userData) return;
  
        // Random Teleportation
        if (object.userData.type === 'entangledObject' && Math.random() < this.nonLocalTeleportChance) {
          object.position.set(
            (Math.random() - 0.5) * 80,
            10 + Math.random() * 20,
            (Math.random() - 0.5) * 80
          );
          object.userData.originalPosition = object.position.clone(); // Update original position
          object.userData.trail = []; // Clear trail on teleport to avoid long lines
        }
  
        // Flickering
        if (object.userData.type === 'entangledObject' && Math.random() < this.nonLocalFlickerChance) {
          object.visible = !object.visible; // Toggle visibility
        }
  
        // Displacement (Subtle, continuous movement)
        if (object.userData.type === 'entangledObject') {
          object.position.x += Math.sin(Date.now() * 0.001 + object.userData.id) * this.nonLocalDisplacementStrength * delta;
          object.position.z += Math.cos(Date.now() * 0.001 + object.userData.id) * this.nonLocalDisplacementStrength * delta;
        }
      });
    }
  
    handleInteraction(type, data) {
        if (type === 'interact') {
            const nearestObject = this.findNearestObject(data.position);
            if (nearestObject && this.isWithinInteractionRange(nearestObject, data.position, 5)) {
                if (nearestObject.userData.type === 'entangledObject') {
                    // Trigger the entanglement effect
                    this.triggerEntanglement(nearestObject);
                } else if (nearestObject.userData.type === 'symbol') {
                    // Add interaction for the pyramid (optional)
                    console.log("Interacting with the central symbol.");
                    // Example: Trigger a pulse effect
                    this.triggerSymbolPulse(nearestObject);
                }
            }
        }
    }
  
    triggerEntanglement(object) {
        const partner = object.userData.partner;
  
        // Example effect: Change colors
        const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        object.material.color.set(randomColor);
        object.material.emissive.set(randomColor);
        partner.material.color.set(randomColor);
        partner.material.emissive.set(randomColor);
  
        // Example effect:  Quickly scale up and down
        const originalScale = object.scale.clone();
        const targetScale = new THREE.Vector3(2, 2, 2); //  scale
  
        const scaleUp = () => {
          object.scale.lerp(targetScale, 0.1); // Smoothly interpolate
          partner.scale.copy(object.scale); // Mirror the scale
          if (object.scale.distanceTo(targetScale) > 0.01) {
            requestAnimationFrame(scaleUp);
          } else {
            // Scale back down
            const scaleDown = () => {
              object.scale.lerp(originalScale, 0.1);
              partner.scale.copy(object.scale);
              if (object.scale.distanceTo(originalScale) > 0.01) {
                requestAnimationFrame(scaleDown);
              }
            };
            requestAnimationFrame(scaleDown);
          }
        };
        requestAnimationFrame(scaleUp);
    }
  
    triggerSymbolPulse(symbol) {
      const originalIntensity = symbol.material.emissiveIntensity;
      const originalOpacity = symbol.material.opacity;
      const pulseIntensity = originalIntensity * 5; // Make it pulse brighter
      const pulseOpacity = 0.8;
  
      // Animate the pulse
      const duration = 500; // Pulse duration in ms
      const startTime = Date.now();
  
      const animatePulse = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const pulseFactor = Math.sin(progress * Math.PI); // Sine wave for smooth pulse
  
          symbol.material.emissiveIntensity = originalIntensity + (pulseIntensity - originalIntensity) * pulseFactor;
          symbol.material.opacity = originalOpacity + (pulseOpacity - originalOpacity) * pulseFactor;
  
          if (progress < 1) {
              requestAnimationFrame(animatePulse);
          } else {
              // Ensure it returns to the original state
              symbol.material.emissiveIntensity = originalIntensity;
              symbol.material.opacity = originalOpacity;
          }
      };
      requestAnimationFrame(animatePulse);
  }
  
    findNearestObject(position) {
        let nearest = null;
        let minDist = Infinity;
        this.objects.forEach(object => {
            if (object.position && typeof object.position.distanceTo === 'function') {
                const dist = object.position.distanceTo(position);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = object;
                }
            }
        });
        return nearest;
    }
  
    isWithinInteractionRange(object, position, radius) {
        return object.position.distanceTo(position) < radius;
    }
  }