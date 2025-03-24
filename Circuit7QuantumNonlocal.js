// Circuit 7: Quantum-Nonlocal - Universal Consciousness

class Circuit7QuantumNonlocal {
  constructor(scene, camera) {
      this.scene = scene;
      this.camera = camera;

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
      this.nonLocalDistortionStrength = 0.1;  // Not used yet, but good to have
      this.nonLocalTeleportChance = 0.001; // Chance per frame of teleportation
      this.nonLocalFlickerChance = 0.005; // Chance per frame of flickering
      this.nonLocalDisplacementStrength = 5; // How far to displace objects

      // Entangled Object Parameters
      this.numEntangledPairs = 5;
      this.entangledObjectRadius = 2;
      this.trailLength = 20; // How many points to store for the trail

  }

  init() {
      if (this.isInitialized) return;

      console.log("Initializing Circuit 7: Quantum-Nonlocal");
      try {
          this.createEnvironment();
          this.createNonLocalEffects();
          this.createEntangledObjects();
          this.createIntegrationElements();
          this.createLighting();

          if (this.camera) {
              this.camera.position.set(0, 25, 60);
              this.camera.lookAt(0, 0, 0);
          }

          this.isInitialized = true;
      } catch (error) {
          console.error("Could not initialize Circuit 7: ", error);
      }

  }

  createEnvironment() {
      // Vast, cosmic environment
      const skyGeometry = new THREE.SphereGeometry(500, 64, 32); // Much larger
      const skyMaterial = new THREE.MeshBasicMaterial({
          color: 0x000011, // Very dark blue
          side: THREE.BackSide,
          transparent: true,
          opacity: 0.95,
      });
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      this.group.add(sky);

      // Very subtle fog
      this.scene.fog = new THREE.FogExp2(0x000011, 0.001);
  }

createNonLocalEffects() {
  // We'll implement the effects directly in the update() method
}

  createEntangledObjects() {
      const objectGeometry = new THREE.SphereGeometry(this.entangledObjectRadius, 16, 16);
      const objectMaterial = new THREE.MeshStandardMaterial({
          color: this.secondaryColor,
          emissive: this.secondaryColor,
          emissiveIntensity: 0.6,
          metalness: 0.5,
          roughness: 0.5,
      });

      for (let i = 0; i < this.numEntangledPairs; i++) {
          const object1 = new THREE.Mesh(objectGeometry, objectMaterial.clone()); // Clone for independent materials
          const object2 = new THREE.Mesh(objectGeometry, objectMaterial.clone());

          // Position objects randomly
          object1.position.set((Math.random() - 0.5) * 80, 10 + Math.random() * 20, (Math.random() - 0.5) * 80);
          object2.position.set((Math.random() - 0.5) * 80, 10 + Math.random() * 20, (Math.random() - 0.5) * 80);

          object1.userData = {
              type: 'entangledObject',
              partner: object2,
              id: i * 2,
              originalPosition: object1.position.clone(), // Store original position
              trail: [], // Array to store trail points
          };
          object2.userData = {
              type: 'entangledObject',
              partner: object1,
              id: i * 2 + 1,
              originalPosition: object2.position.clone(),
              trail: [],
          };

          this.group.add(object1);
          this.group.add(object2);
          this.objects.push(object1);
          this.objects.push(object2);
          this.entangledObjects.push([object1, object2]); // Store the pair

          // Create trails
          this.createTrail(object1);
          this.createTrail(object2);
      }
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

      // Circuit 3 (Symbolic):
      const symbolGeometry = new THREE.TetrahedronGeometry(5);
      const symbolMaterial = new THREE.MeshBasicMaterial({
          color: this.accentColor,
          transparent: true,
          opacity: 0.2,
          wireframe: true
      });
      const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
      symbol.position.set(0, 20, 0);
      symbol.userData = { type: "symbol" }; //For updating later.
      this.group.add(symbol);
      this.objects.push(symbol);
  }

  createLighting() {
      // Very soft ambient light
      const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
      this.group.add(ambientLight);

      // Distant, dim directional light
      const directionalLight = new THREE.DirectionalLight(0x446688, 0.3);
      directionalLight.position.set(1, 1, -1); // From behind
      this.group.add(directionalLight);
      this.lights.push(directionalLight);

      // A few subtle point lights
      const pointLight1 = new THREE.PointLight(this.primaryColor, 0.4, 100);
      pointLight1.position.set(20, 30, 20);
      this.group.add(pointLight1);
      this.lights.push(pointLight1);

      const pointLight2 = new THREE.PointLight(this.secondaryColor, 0.4, 100);
      pointLight2.position.set(-20, 30, -20);
      this.group.add(pointLight2);
      this.lights.push(pointLight2);
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
          symbol.rotation.x += 0.01;
          symbol.rotation.y += 0.01;
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