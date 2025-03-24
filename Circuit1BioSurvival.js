// Circuit 1: Bio-Survival - Primal jungle with shifting terrain
// import { BaseCircuit } from './BaseCircuit.js';

class Circuit1BioSurvival {
    constructor(scene, camera) {
        // Scene and camera references
        this.scene = scene;
        this.camera = camera;
        
        // Circuit elements
        this.objects = [];
        this.lights = [];
        this.particles = [];
        
        // Circuit-specific group to hold all elements
        this.group = new THREE.Group();
        this.group.name = 'circuit-group';
        this.scene.add(this.group);
        
        // Circuit state
        this.isInitialized = false;
        
        // Circuit properties
        this.name = 'Circuit 1: Bio-Survival';
        this.description = 'Primal jungle with shifting terrain';
        this.circuitNumber = 1;
        
        // Circuit-specific colors
        this.primaryColor = new THREE.Color(0x00AA00); // Earthy green
        this.secondaryColor = new THREE.Color(0x8B4513); // Brown
        this.accentColor = new THREE.Color(0xFFFF00); // Yellow
        
        // Circuit-specific properties
        this.terrainSize = 100;
        this.terrainSegments = 128;
        this.terrainHeight = 10;
        this.treeDensity = 0.01;
        this.hazardCount = 5;
        this.foodCount = 5;
        this.waterCount = 3;
        this.shelterCount = 2;
        
        // Breathing mechanic
        this.breathingPhase = 0;
        this.breathingTarget = 0;
        this.breathingAligned = false;
        this.breathingPulse = null;
        this.pulseSphere = null;
        this.targetSphere = null;
        
        // Player status for this circuit
        this.playerStatus = {
            health: 100,
            food: 50,
            water: 50,
            shelter: 0,
            breathingAlignment: 0,
            statusDecayRate: 0.05,
            hasStatusUI: false,
            nightWarningShown: false
        };
        
        // Day/Night cycle
        this.dayNightCycle = {
            time: Math.random() * 24, // Start at random time
            dayDuration: 300, // seconds for full day/night cycle
            sunColor: new THREE.Color(0xFFFFAA),
            moonColor: new THREE.Color(0x8888FF),
            lastTime: 0,
            skyObjects: [],
            weather: {
                currentEffect: null,
                rainIntensity: 0,
                fogIntensity: 0,
                windIntensity: 0,
                thunderProbability: 0,
                particles: null,
                timeSinceLastChange: 0,
                changeInterval: 120 // seconds between possible weather changes
            }
        };
    }
    
    createEnvironment() {
        console.log('Creating Bio-Survival environment');
        
        // Create terrain
        this.createTerrain();
        
        // Create skybox
        this.createSkybox();
        
        // Create water
        this.createWater();
        
        // Create resources
        this.addResources();
    }
    
    createTerrain() {
        try {
            // Create terrain geometry with more optimized settings
            const geometry = new THREE.PlaneGeometry(
                this.terrainSize, 
                this.terrainSize, 
                Math.min(this.terrainSegments, 100), // Limit segments for better performance
                Math.min(this.terrainSegments, 100)
            );
            
            // Rotate to be horizontal
            geometry.rotateX(-Math.PI / 2);
            
            // Apply height map
            const vertices = geometry.attributes.position.array;
            
            // Use a more optimized approach for heightmap generation
            for (let i = 0; i < vertices.length; i += 3) {
                // Skip x and z coordinates
                const y = i + 1;
                
                // Get position to calculate height
                const x = vertices[i];
                const z = vertices[i + 2];
                
                // Simple height calculation for prototype using a more optimized approach
                // Using simplified noise function with fewer calculations
                vertices[y] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * this.terrainHeight;
            }
            
            // Update geometry
            geometry.computeVertexNormals();
            
            // Create material with added texture for better appearance
            const material = new THREE.MeshStandardMaterial({
                color: this.secondaryColor,
                roughness: 0.8,
                metalness: 0.2,
                wireframe: false,
                flatShading: true // Better performance with flat shading
            });
            
            // Create mesh
            const terrain = new THREE.Mesh(geometry, material);
            terrain.receiveShadow = true;
            terrain.name = 'terrain';
            
            // Add to group
            this.group.add(terrain);
            this.objects.push(terrain);
            
            // Add vegetation with level of detail adjustments
            this.addVegetation();
            
            // Add hazards
            this.addHazards();
            
        } catch (error) {
            console.error("Error creating terrain:", error);
            // Create a fallback terrain if the main one fails
            this.createFallbackTerrain();
        }
    }
    
    createFallbackTerrain() {
        // Create a simple flat plane as fallback
        const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize);
        geometry.rotateX(-Math.PI / 2);
        
        const material = new THREE.MeshBasicMaterial({
            color: this.secondaryColor,
            wireframe: false
        });
        
        const terrain = new THREE.Mesh(geometry, material);
        terrain.receiveShadow = true;
        terrain.name = 'terrain-fallback';
        
        this.group.add(terrain);
        this.objects.push(terrain);
        
        console.log("Using fallback terrain due to error");
    }
    
    addVegetation() {
        // Create tree instances
        const treeCount = Math.floor(this.terrainSize * this.terrainSize * this.treeDensity);
        
        // Create tree geometry (simplified for prototype)
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 4, 8);
        const leavesGeometry = new THREE.ConeGeometry(2, 4, 8);
        
        // Position leaves on top of trunk
        leavesGeometry.translate(0, 4, 0);
        
        // Create materials
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: this.secondaryColor,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const leavesMaterial = new THREE.MeshStandardMaterial({
            color: this.primaryColor,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Create tree group
        const treeGroup = new THREE.Group();
        treeGroup.name = 'vegetation';
        
        // Create trunk and leaves
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        
        // Add to tree group
        treeGroup.add(trunk);
        treeGroup.add(leaves);
        
        // Create instanced mesh for trees
        const treeMatrix = new THREE.Matrix4();
        const treeInstancedMesh = new THREE.InstancedMesh(
            treeGroup.children[0].geometry,
            treeGroup.children[0].material,
            treeCount
        );
        
        const leavesInstancedMesh = new THREE.InstancedMesh(
            treeGroup.children[1].geometry,
            treeGroup.children[1].material,
            treeCount
        );
        
        // Position trees randomly
        for (let i = 0; i < treeCount; i++) {
            const x = (Math.random() - 0.5) * this.terrainSize;
            const z = (Math.random() - 0.5) * this.terrainSize;
            
            // Get height at position (simplified)
            const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * this.terrainHeight;
            
            // Create matrix for this instance
            treeMatrix.makeTranslation(x, y, z);
            
            // Add random rotation and scale
            const scale = 0.5 + Math.random() * 1.5;
            treeMatrix.scale(new THREE.Vector3(scale, scale, scale));
            
            // Set matrix for both trunk and leaves
            treeInstancedMesh.setMatrixAt(i, treeMatrix);
            leavesInstancedMesh.setMatrixAt(i, treeMatrix);
        }
        
        // Add to group
        this.group.add(treeInstancedMesh);
        this.group.add(leavesInstancedMesh);
        this.objects.push(treeInstancedMesh);
        this.objects.push(leavesInstancedMesh);
    }
    
    addHazards() {
        // Create hazards (traps, predators)
        for (let i = 0; i < this.hazardCount; i++) {
            // Create hazard geometry
            const geometry = new THREE.SphereGeometry(1, 16, 16);
            
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: 0xFF0000,
                emissive: 0xFF0000,
                emissiveIntensity: 0.5,
                roughness: 0.3,
                metalness: 0.7
            });
            
            // Create mesh
            const hazard = new THREE.Mesh(geometry, material);
            
            // Position randomly
            const x = (Math.random() - 0.5) * this.terrainSize * 0.8;
            const z = (Math.random() - 0.5) * this.terrainSize * 0.8;
            
            // Get height at position (simplified)
            const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * this.terrainHeight + 2;
            
            hazard.position.set(x, y, z);
            hazard.name = `hazard-${i}`;
            
            // Add to group
            this.group.add(hazard);
            this.objects.push(hazard);
        }
    }
    
    createSkybox() {
        // Create skybox geometry
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        
        // Create skybox material
        const material = new THREE.MeshBasicMaterial({
            color: 0x88CCFF,
            side: THREE.BackSide
        });
        
        // Create mesh
        const skybox = new THREE.Mesh(geometry, material);
        skybox.name = 'skybox';
        
        // Add to group
        this.group.add(skybox);
    }
    
    createWater() {
        // Create water geometry
        const geometry = new THREE.PlaneGeometry(
            this.terrainSize * 1.5, 
            this.terrainSize * 1.5, 
            32, 
            32
        );
        
        // Rotate to be horizontal
        geometry.rotateX(-Math.PI / 2);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: 0x0077FF,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.8
        });
        
        // Create mesh
        const water = new THREE.Mesh(geometry, material);
        water.position.y = -5;
        water.name = 'water';
        
        // Add to group
        this.group.add(water);
        this.objects.push(water);
    }
    
    addResources() {
        try {
            const resources = [
                { type: 'food', count: 15, geometry: new THREE.SphereGeometry(0.5, 8, 8), color: 0x00FF00, name: 'Apple' },
                { type: 'water', count: 12, geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5), color: 0x0088FF, name: 'Water' }
            ];
            
            resources.forEach(resource => {
                for (let i = 0; i < resource.count; i++) {
                    const material = new THREE.MeshStandardMaterial({ 
                        color: resource.color,
                        emissive: resource.color,
                        emissiveIntensity: 0.2
                    });
                    
                    const mesh = new THREE.Mesh(resource.geometry, material);
                    
                    // Random position
                    const x = (Math.random() - 0.5) * this.terrainSize * 0.8;
                    const z = (Math.random() - 0.5) * this.terrainSize * 0.8;
                    const y = 1; // Fixed height above ground
                    
                    mesh.position.set(x, y, z);
                    mesh.name = `${resource.type}-${i}`;
                    mesh.userData = { 
                        type: resource.type, 
                        consumed: false,
                        resourceName: resource.name,
                        value: Math.floor(Math.random() * 20) + 20, // Random value between 20-40
                        hoverEffect: {
                            originalY: y,
                            originalScale: 1,
                            phase: Math.random() * Math.PI * 2 // Random starting phase
                        }
                    };
                    
                    // Make resources interactive
                    mesh.userData.interactive = true;
                    
                    // Add to group
                    this.group.add(mesh);
                    this.objects.push(mesh);
                    
                    // Add a small indication glow
                    this.addResourceGlow(mesh);
                }
            });
        } catch (error) {
            console.error("Error adding resources:", error);
        }
    }
    
    addResourceGlow(resourceMesh) {
        try {
            // Create a point light to highlight resources
            const glow = new THREE.PointLight(
                resourceMesh.material.color.getHex(),
                0.8,
                3
            );
            glow.position.copy(resourceMesh.position);
            glow.name = `glow-${resourceMesh.name}`;
            this.group.add(glow);
            
            // Store reference to the glow in the mesh's userData
            resourceMesh.userData.glow = glow;
        } catch (error) {
            console.error("Error adding resource glow:", error);
        }
    }
    
    createLighting() {
        console.log('Creating Bio-Survival lighting');
        
        // Create ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
        ambient.name = 'ambient';
        this.group.add(ambient);
        this.lights.push(ambient);
        
        // Create directional light for sun
        const sunLight = new THREE.DirectionalLight(this.dayNightCycle.sunColor, 1);
        sunLight.position.set(0, 100, 0);
        sunLight.castShadow = true;
        
        // Configure shadow
        sunLight.shadow.mapSize.width = 1024;
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        
        sunLight.name = 'sun';
        this.group.add(sunLight);
        this.lights.push(sunLight);
        this.dayNightCycle.sunLight = sunLight;
        
        // Create moon light (dimmer, bluer)
        const moonLight = new THREE.DirectionalLight(this.dayNightCycle.moonColor, 0.3);
        moonLight.position.set(0, -100, 0);
        moonLight.castShadow = true;
        
        // Configure shadow - same as sun
        moonLight.shadow.mapSize.width = 1024;
        moonLight.shadow.mapSize.height = 1024;
        moonLight.shadow.camera.near = 0.5;
        moonLight.shadow.camera.far = 500;
        moonLight.shadow.camera.left = -100;
        moonLight.shadow.camera.right = 100;
        moonLight.shadow.camera.top = 100;
        moonLight.shadow.camera.bottom = -100;
        
        moonLight.name = 'moon';
        this.group.add(moonLight);
        this.lights.push(moonLight);
        this.dayNightCycle.moonLight = moonLight;
        
        // Create sun and moon visual objects
        this.createSkyObjects();
        
        // Initial update of day/night cycle
        this.updateDayNightCycle(0);
    }
    
    createSkyObjects() {
        try {
            // Create sun visual
            const sunGeometry = new THREE.SphereGeometry(5, 16, 16);
            const sunMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFF00,
                emissive: 0xFFFF00,
                emissiveIntensity: 1
            });
            const sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.name = 'sun-visual';
            this.group.add(sun);
            this.dayNightCycle.skyObjects.push(sun);
            this.dayNightCycle.sunObject = sun;
            
            // Create sun glow
            const sunGlowGeometry = new THREE.SphereGeometry(8, 16, 16);
            const sunGlowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFF00,
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
            });
            const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
            sun.add(sunGlow);
            
            // Create moon visual
            const moonGeometry = new THREE.SphereGeometry(3, 16, 16);
            const moonMaterial = new THREE.MeshBasicMaterial({
                color: 0xDDDDDD,
                emissive: 0x8888FF,
                emissiveIntensity: 0.5
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.name = 'moon-visual';
            this.group.add(moon);
            this.dayNightCycle.skyObjects.push(moon);
            this.dayNightCycle.moonObject = moon;
            
            // Create stars (visible at night)
            const starsGroup = new THREE.Group();
            starsGroup.name = 'stars';
            
            // Create 200 stars
            for (let i = 0; i < 200; i++) {
                const starGeometry = new THREE.SphereGeometry(0.25, 4, 4);
                const starMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0
                });
                const star = new THREE.Mesh(starGeometry, starMaterial);
                
                // Position on a large sphere around the scene
                const radius = 150;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                star.position.x = radius * Math.sin(phi) * Math.cos(theta);
                star.position.y = Math.abs(radius * Math.cos(phi)); // Only in upper hemisphere
                star.position.z = radius * Math.sin(phi) * Math.sin(theta);
                
                starsGroup.add(star);
            }
            
            this.group.add(starsGroup);
            this.dayNightCycle.starsGroup = starsGroup;
            
            // Create a simple sky dome
            const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
            const skyMaterial = new THREE.MeshBasicMaterial({
                color: 0x87CEEB, // Sky blue
                side: THREE.BackSide,
                transparent: true,
                opacity: 0.8
            });
            const sky = new THREE.Mesh(skyGeometry, skyMaterial);
            sky.name = 'sky-dome';
            this.group.add(sky);
            this.dayNightCycle.skyDome = sky;
        } catch (error) {
            console.error("Error creating sky objects:", error);
        }
    }
    
    updateDayNightCycle(delta) {
        try {
            // Update time (24-hour cycle)
            this.dayNightCycle.time += (delta / this.dayNightCycle.dayDuration) * 24;
            if (this.dayNightCycle.time >= 24) {
                this.dayNightCycle.time -= 24;
            }
            
            // Convert to radians (0-2π for full day)
            const timeRadians = (this.dayNightCycle.time / 24) * Math.PI * 2;
            
            // Calculate sun position
            const sunRadius = 150; // Distance from center
            const sunX = Math.cos(timeRadians) * sunRadius;
            const sunY = Math.sin(timeRadians) * sunRadius;
            
            // Sun is below horizon when y is negative
            const sunVisible = sunY > 0;
            
            // Position the sun
            if (this.dayNightCycle.sunObject) {
                this.dayNightCycle.sunObject.position.set(sunX, Math.max(0.1, sunY), 0);
                // Make sun less visible when below horizon
                this.dayNightCycle.sunObject.visible = sunY > -20;
                if (this.dayNightCycle.sunObject.material) {
                    this.dayNightCycle.sunObject.material.opacity = Math.max(0, Math.min(1, (sunY + 20) / 40));
                }
            }
            
            // Sun light intensity based on sun height
            if (this.dayNightCycle.sunLight) {
                const sunIntensity = Math.max(0, Math.min(1, sunY / 100));
                this.dayNightCycle.sunLight.intensity = sunIntensity;
                this.dayNightCycle.sunLight.position.set(sunX, Math.max(50, sunY), 0);
            }
            
            // Moon is opposite to sun
            const moonX = -sunX;
            const moonY = -sunY;
            
            // Position the moon
            if (this.dayNightCycle.moonObject) {
                this.dayNightCycle.moonObject.position.set(moonX, Math.max(0.1, moonY), 0);
                // Make moon less visible when below horizon
                this.dayNightCycle.moonObject.visible = moonY > -20;
                if (this.dayNightCycle.moonObject.material) {
                    this.dayNightCycle.moonObject.material.opacity = Math.max(0, Math.min(1, (moonY + 20) / 40));
                }
            }
            
            // Moon light intensity based on moon height
            if (this.dayNightCycle.moonLight) {
                const moonIntensity = Math.max(0, Math.min(0.3, moonY / 100));
                this.dayNightCycle.moonLight.intensity = moonIntensity;
                this.dayNightCycle.moonLight.position.set(moonX, Math.max(50, moonY), 0);
            }
            
            // Update ambient light based on time of day
            const ambientLight = this.lights.find(light => light.name === 'ambient');
            if (ambientLight) {
                // Calculate the combined light from sun and moon
                const dayFactor = Math.max(0, Math.min(1, sunY / 100));
                const nightFactor = Math.max(0, Math.min(0.3, moonY / 100));
                
                // Blend day and night colors
                const dayColor = new THREE.Color(0xFFFFFF);
                const nightColor = new THREE.Color(0x334455);
                const blendedColor = new THREE.Color();
                
                if (dayFactor > 0) {
                    blendedColor.lerpColors(nightColor, dayColor, dayFactor);
                } else {
                    blendedColor.copy(nightColor);
                }
                
                // Set ambient light color and intensity
                ambientLight.color.copy(blendedColor);
                ambientLight.intensity = Math.max(0.1, dayFactor * 0.3 + nightFactor * 0.1);
            }
            
            // Update sky dome color
            if (this.dayNightCycle.skyDome && this.dayNightCycle.skyDome.material) {
                const dayColor = new THREE.Color(0x87CEEB); // Sky blue
                const sunsetColor = new THREE.Color(0xFF7F50); // Coral/orange for sunset/sunrise
                const nightColor = new THREE.Color(0x000022); // Dark blue for night
                
                let skyColor = new THREE.Color();
                
                // Time-based color transitions
                if (this.dayNightCycle.time > 6 && this.dayNightCycle.time < 18) {
                    // Daytime
                    const dayProgress = (this.dayNightCycle.time - 6) / 12; // 0-1 throughout the day
                    
                    // Midday is most blue, mornings and evenings shift toward sunset
                    const dayFactor = 1 - Math.abs(dayProgress - 0.5) * 2; // 0 at edges, 1 at noon
                    skyColor.lerpColors(sunsetColor, dayColor, dayFactor);
                } else {
                    // Nighttime
                    let nightProgress;
                    if (this.dayNightCycle.time >= 18) {
                        nightProgress = (this.dayNightCycle.time - 18) / 6; // 0-1 from 6pm-midnight
                    } else {
                        nightProgress = 1 - (this.dayNightCycle.time / 6); // 1-0 from midnight-6am
                    }
                    
                    // Evening transitions from sunset to night, morning from night to sunset
                    if (nightProgress < 0.5 || nightProgress > 0.8) {
                        // Near sunset/sunrise
                        const edgeFactor = (nightProgress < 0.5) ? 
                            1 - (nightProgress / 0.5) : 
                            (nightProgress - 0.8) / 0.2;
                        skyColor.lerpColors(nightColor, sunsetColor, edgeFactor);
                    } else {
                        // Middle of night
                        skyColor.copy(nightColor);
                    }
                }
                
                this.dayNightCycle.skyDome.material.color.copy(skyColor);
            }
            
            // Update stars visibility
            if (this.dayNightCycle.starsGroup) {
                // Stars are visible at night
                const isNight = sunY < 0;
                const starOpacity = isNight ? Math.min(0.8, -sunY / 50) : 0;
                
                this.dayNightCycle.starsGroup.traverse(child => {
                    if (child.material) {
                        child.material.opacity = starOpacity;
                    }
                });
            }
            
            // Update weather effects
            this.updateWeather(delta, sunY > 0);
            
            // Update shelter impact based on time (more important at night)
            const isNight = sunY < 0;
            if (isNight && !this.playerStatus.nightWarningShown && this.dayNightCycle.time > 18.5) {
                this.showInteractionFeedback("Night has fallen. Find shelter!", 0x8888FF);
                this.playerStatus.nightWarningShown = true;
            } else if (!isNight) {
                this.playerStatus.nightWarningShown = false;
            }
            
            // Display time of day occasionally
            if (this.dayNightCycle.lastTime === 0 || 
                Math.floor(this.dayNightCycle.time) !== Math.floor(this.dayNightCycle.lastTime)) {
                
                // Format time as HH:MM
                const hours = Math.floor(this.dayNightCycle.time);
                const minutes = Math.floor((this.dayNightCycle.time % 1) * 60);
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                
                // Update time display if it exists
                const timeDisplay = document.getElementById('time-display');
                if (timeDisplay) {
                    timeDisplay.textContent = timeString;
                } else {
                    // Create time display if it doesn't exist
                    this.createTimeDisplay();
                }
            }
            
            // Update last time
            this.dayNightCycle.lastTime = this.dayNightCycle.time;
        } catch (error) {
            console.error("Error updating day/night cycle:", error);
        }
    }
    
    createTimeDisplay() {
        try {
            // Create time display
            const timeDisplay = document.createElement('div');
            timeDisplay.id = 'time-display';
            timeDisplay.style.position = 'fixed';
            timeDisplay.style.top = '20px';
            timeDisplay.style.right = '20px';
            timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            timeDisplay.style.color = '#FFFFFF';
            timeDisplay.style.padding = '5px 10px';
            timeDisplay.style.borderRadius = '5px';
            timeDisplay.style.fontFamily = 'monospace';
            timeDisplay.style.fontSize = '20px';
            timeDisplay.style.fontWeight = 'bold';
            timeDisplay.style.zIndex = '1000';
            
            // Format time as HH:MM
            const hours = Math.floor(this.dayNightCycle.time);
            const minutes = Math.floor((this.dayNightCycle.time % 1) * 60);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            timeDisplay.textContent = timeString;
            
            document.body.appendChild(timeDisplay);
        } catch (error) {
            console.error("Error creating time display:", error);
        }
    }
    
    createParticles() {
        console.log('Creating Bio-Survival particles');
        
        // Create particles for atmosphere (fog, dust, etc.)
        this.createAtmosphericParticles();
        
        // Create particles for breathing visualization
        this.createBreathingParticles();
    }
    
    createAtmosphericParticles() {
        // Create particle geometry
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        // Generate random positions
        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * this.terrainSize;
            particlePositions[i + 1] = Math.random() * 20;
            particlePositions[i + 2] = (Math.random() - 0.5) * this.terrainSize;
        }
        
        // Set positions
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        // Create material
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        // Create points
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'atmospheric-particles';
        
        // Add to group
        this.group.add(particles);
        this.particles.push(particles);
    }
    
    createBreathingParticles() {
        // Create particle geometry
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        
        // Generate positions in sphere
        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) + 5;
            particlePositions[i + 2] = radius * Math.cos(phi);
            
            particleSizes[i/3] = 0.2 + Math.random() * 0.3;
        }
        
        // Set positions and sizes
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        // Create material
        const particleMaterial = new THREE.PointsMaterial({
            color: this.accentColor,
            size: 0.2,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create points
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'breathing-particles';
        
        // Add to group
        this.group.add(particles);
        this.particles.push(particles);
    }
    
    updateObjects(delta) {
        try {
            // Update all objects in the scene
            for (let i = 0; i < this.objects.length; i++) {
                const obj = this.objects[i];
                
                // Skip if not a valid mesh
                if (!obj || !obj.userData) continue;
                
                // Handle resource objects (food, water)
                if (obj.userData.type === 'food' || obj.userData.type === 'water') {
                    // Skip if consumed
                    if (obj.userData.consumed) continue;
                    
                    // Animate hover effect
                    if (obj.userData.hoverEffect) {
                        const hoverData = obj.userData.hoverEffect;
                        hoverData.phase += delta * 2;
                        
                        // Hover up and down
                        obj.position.y = hoverData.originalY + Math.sin(hoverData.phase) * 0.2;
                        
                        // Pulse slightly
                        const scale = 1 + Math.sin(hoverData.phase * 0.5) * 0.1;
                        obj.scale.set(scale, scale, scale);
                        
                        // Update glow intensity based on distance to player
                        if (obj.userData.glow && this.camera) {
                            const distance = this.camera.position.distanceTo(obj.position);
                            const maxDistance = 20;
                            
                            if (distance < maxDistance) {
                                // Increase glow intensity as player gets closer
                                const intensity = 0.8 + (1 - distance / maxDistance) * 1.5;
                                obj.userData.glow.intensity = intensity;
                                
                                // Make resource "look" at player
                                obj.lookAt(this.camera.position);
                                
                                // Show hint if very close and player needs this resource
                                if (distance < 5) {
                                    this.showResourceHint(obj);
                                }
                            } else {
                                obj.userData.glow.intensity = 0.8;
                            }
                        }
                    }
                }
            }
            
            // Update any existing objects
            
            // Update rain particles if they exist
            const weather = this.dayNightCycle.weather;
            if (weather.currentEffect === 'rain' && weather.particles) {
                const positions = weather.particles.geometry.attributes.position.array;
                const count = positions.length;
                
                // Fall speed based on intensity
                const fallSpeed = 30 * weather.rainIntensity;
                
                // Update each rain particle
                for (let i = 0; i < count; i += 3) {
                    // Move downward
                    positions[i+1] -= fallSpeed * delta;
                    
                    // If below ground, reset to top
                    if (positions[i+1] < 0) {
                        positions[i] = (Math.random() - 0.5) * 200;
                        positions[i+1] = Math.random() * 50 + 50;
                        positions[i+2] = (Math.random() - 0.5) * 200;
                    }
                }
                
                // Update the particle system
                weather.particles.geometry.attributes.position.needsUpdate = true;
                
                // Update opacity based on intensity
                weather.particles.material.opacity = Math.min(0.6, weather.rainIntensity);
            }
        } catch (error) {
            console.error("Error updating objects:", error);
        }
    }
    
    showResourceHint(resourceObj) {
        try {
            // Check if hint is needed based on player status
            let shouldShowHint = false;
            let needAmount = 0;
            
            if (resourceObj.userData.type === 'food') {
                needAmount = 100 - this.playerStatus.food;
                shouldShowHint = this.playerStatus.food < 50;
            } else if (resourceObj.userData.type === 'water') {
                needAmount = 100 - this.playerStatus.water;
                shouldShowHint = this.playerStatus.water < 50;
            }
            
            // Don't show hint if resource is not needed urgently
            if (!shouldShowHint) return;
            
            // Only show hint occasionally to prevent spam
            if (Math.random() > 0.01) return;
            
            // Create and show hint
            const message = `${resourceObj.userData.resourceName}: Press E to consume (+${resourceObj.userData.value} ${resourceObj.userData.type})`;
            this.showInteractionFeedback(message, resourceObj.material.color.getHex());
        } catch (error) {
            console.error("Error showing resource hint:", error);
        }
    }
    
    interactWithObject(obj) {
        try {
            // Handle different object types
            if (obj.userData.type === 'food') {
                if (!obj.userData.consumed) {
                    // Consume food and update status
                    this.playerStatus.food = Math.min(100, this.playerStatus.food + obj.userData.value);
                    obj.userData.consumed = true;
                    
                    // Visual feedback
                    this.showInteractionFeedback(`Consumed ${obj.userData.resourceName} (+${obj.userData.value} food)`, 0x00FF00);
                    
                    // Hide the object
                    this.animateResourcePickup(obj);
                }
            } else if (obj.userData.type === 'water') {
                if (!obj.userData.consumed) {
                    // Drink water and update status
                    this.playerStatus.water = Math.min(100, this.playerStatus.water + obj.userData.value);
                    obj.userData.consumed = true;
                    
                    // Visual feedback
                    this.showInteractionFeedback(`Drank ${obj.userData.resourceName} (+${obj.userData.value} water)`, 0x0088FF);
                    
                    // Hide the object
                    this.animateResourcePickup(obj);
                }
            }
        } catch (error) {
            console.error("Error interacting with object:", error);
        }
    }
    
    animateResourcePickup(obj) {
        try {
            // Make object float up and disappear
            const startPosition = obj.position.clone();
            const targetPosition = startPosition.clone().add(new THREE.Vector3(0, 5, 0));
            const startScale = obj.scale.clone();
            const duration = 1.0; // seconds
            const startTime = performance.now() / 1000;
            
            // Remove glow
            if (obj.userData.glow) {
                this.group.remove(obj.userData.glow);
                obj.userData.glow = null;
            }
            
            // Create particles at pickup location
            this.createPickupParticles(startPosition, obj.material.color);
            
            // Create animation
            const animate = () => {
                const currentTime = performance.now() / 1000;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1.0);
                
                // Ease out cubic
                const t = 1 - Math.pow(1 - progress, 3);
                
                // Update position - move up
                obj.position.lerpVectors(startPosition, targetPosition, t);
                
                // Update scale - shrink
                const scale = startScale.clone().multiplyScalar(1 - t);
                obj.scale.copy(scale);
                
                // Update opacity if material supports it
                if (obj.material.transparent) {
                    obj.material.opacity = 1 - t;
                }
                
                // Continue animation if not complete
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Hide object completely when animation is done
                    obj.visible = false;
                }
            };
            
            // Start animation
            animate();
        } catch (error) {
            console.error("Error animating resource pickup:", error);
            
            // Fallback to simple hide
            obj.visible = false;
        }
    }
    
    createPickupParticles(position, color) {
        try {
            // Create particle system for pickup effect
            const particleCount = 20;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            
            // Initialize particles at center position
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                particlePositions[i3] = position.x;
                particlePositions[i3 + 1] = position.y;
                particlePositions[i3 + 2] = position.z;
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            
            // Create material with glow effect
            const particleMaterial = new THREE.PointsMaterial({
                color: color,
                size: 0.2,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            particles.name = 'pickup-particles';
            this.group.add(particles);
            
            // Store velocities for animation
            const velocities = [];
            for (let i = 0; i < particleCount; i++) {
                velocities.push({
                    x: (Math.random() - 0.5) * 3,
                    y: Math.random() * 3 + 1,
                    z: (Math.random() - 0.5) * 3
                });
            }
            
            // Create animation
            const startTime = performance.now() / 1000;
            const duration = 1.5; // seconds
            
            const animateParticles = () => {
                const currentTime = performance.now() / 1000;
                const elapsed = currentTime - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    // Remove particles when animation is complete
                    this.group.remove(particles);
                    return;
                }
                
                // Update particle positions
                const positions = particleGeometry.attributes.position.array;
                
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    
                    // Apply velocity
                    positions[i3] += velocities[i].x * 0.1;
                    positions[i3 + 1] += velocities[i].y * 0.1;
                    positions[i3 + 2] += velocities[i].z * 0.1;
                    
                    // Apply gravity
                    velocities[i].y -= 0.05;
                }
                
                particleGeometry.attributes.position.needsUpdate = true;
                
                // Update opacity based on progress
                particleMaterial.opacity = 0.8 * (1 - progress);
                
                // Continue animation
                requestAnimationFrame(animateParticles);
            };
            
            // Start animation
            animateParticles();
        } catch (error) {
            console.error("Error creating pickup particles:", error);
        }
    }
    
    updateParticles(delta) {
        // Update atmospheric particles
        const atmosphericParticles = this.particles.find(p => p.name === 'atmospheric-particles');
        if (atmosphericParticles) {
            // Rotate particles
            atmosphericParticles.rotation.y += delta * 0.05;
            
            // Move particles up slowly
            const positions = atmosphericParticles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += delta * 0.1;
                
                // Reset if too high
                if (positions[i] > 20) {
                    positions[i] = 0;
                }
            }
            
            atmosphericParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update breathing particles
        const breathingParticles = this.particles.find(p => p.name === 'breathing-particles');
        if (breathingParticles) {
            // Get breathing phase
            const phase = Math.sin(this.breathingPhase);
            
            // Scale with breathing
            const scale = 0.8 + phase * 0.5;
            
            // Update particle positions
            const positions = breathingParticles.geometry.attributes.position.array;
            const sizes = breathingParticles.geometry.attributes.size?.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                const radius = 1 + phase;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                // Move particles outward during exhale, inward during inhale
                positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) + 5;
                positions[i + 2] = radius * Math.cos(phi);
                
                // Update sizes if available
                if (sizes && idx < sizes.length) {
                    sizes[idx] = 0.1 + 0.3 * Math.abs(phase);
                }
            }
            
            breathingParticles.geometry.attributes.position.needsUpdate = true;
            if (sizes) breathingParticles.geometry.attributes.size.needsUpdate = true;
        }
    }
    
    updateLighting(delta) {
        // Update breathing pulse
        if (this.breathingPulse) {
            // Update intensity based on breathing phase
            const intensity = Math.max(0, Math.sin(this.breathingPhase) * 2);
            this.breathingPulse.intensity = intensity;
        }
        
        // Update breathing phase
        this.updateBreathing(delta);
    }
    
    updateBreathing(delta) {
        try {
            // Update breathing phase
            this.breathingPhase += delta * 0.5; // Slow breathing rate
            
            // Update breathing target (changes periodically)
            if (Math.random() < 0.005) {
                this.breathingTarget = Math.random() * Math.PI * 2;
            }
            
            // Check if breathing is aligned with target
            const currentPhase = Math.sin(this.breathingPhase);
            const targetPhase = Math.sin(this.breathingTarget);
            const diff = Math.abs(currentPhase - targetPhase);
            this.breathingAligned = diff < 0.2;
            
            // Move breathing visualization to be in front of player
            if (this.camera) {
                const cameraDir = new THREE.Vector3(0, 0, -1);
                cameraDir.applyQuaternion(this.camera.quaternion);
                
                // Calculate position 5 units in front of the camera, maintaining y height
                const targetPos = this.camera.position.clone().add(
                    cameraDir.multiplyScalar(5)
                );
                targetPos.y = 5; // Keep at fixed height
                
                // Smooth transition for breathing visualization
                if (this.pulseSphere) {
                    this.pulseSphere.position.lerp(targetPos, 0.1);
                }
                if (this.targetSphere) {
                    this.targetSphere.position.copy(this.pulseSphere.position);
                }
                if (this.breathingPulse) {
                    this.breathingPulse.position.copy(this.pulseSphere.position);
                }
                if (this.breathingInstructions) {
                    this.breathingInstructions.position.copy(this.pulseSphere.position);
                    this.breathingInstructions.position.y += 4;
                    this.breathingInstructions.lookAt(this.camera.position);
                }
                
                // Update breathing rings position
                if (this.breathingRings) {
                    this.breathingRings.forEach(ring => {
                        ring.position.copy(this.pulseSphere.position);
                    });
                }
            }
            
            // Scale pulse sphere with breathing
            if (this.pulseSphere) {
                const scale = 0.8 + currentPhase * 0.5;
                this.pulseSphere.scale.set(scale, scale, scale);
            }
            
            // Scale target sphere with target breathing
            if (this.targetSphere) {
                const targetScale = 0.8 + targetPhase * 0.5;
                this.targetSphere.scale.set(targetScale, targetScale, targetScale);
                
                // Make target more visible when aligned
                if (this.breathingAligned) {
                    this.targetSphere.material.opacity = 0.5;
                    this.targetSphere.material.color.set(0x00FF00);
                } else {
                    this.targetSphere.material.opacity = 0.2;
                    this.targetSphere.material.color.set(0xFFFF00);
                }
            }
            
            // Update breathing rings
            if (this.breathingRings) {
                this.breathingRings.forEach((ring, index) => {
                    const ringScale = 0.8 + currentPhase * 0.5 + index * 0.2;
                    ring.scale.set(ringScale, ringScale, ringScale);
                    
                    if (this.breathingAligned) {
                        ring.material.color.set(0x00FF00);
                    } else {
                        ring.material.color.set(0xFFFF00);
                    }
                });
            }
            
            // Visual feedback for alignment
            if (this.breathingPulse) {
                // Adjust intensity based on alignment
                const intensity = this.breathingAligned ? 5 : 2;
                this.breathingPulse.intensity = intensity;
                
                // Change color based on alignment
                if (this.breathingAligned) {
                    this.breathingPulse.color.set(0x00FF00);
                    if (this.pulseSphere) {
                        this.pulseSphere.material.color.set(0x00FF00);
                    }
                } else {
                    this.breathingPulse.color.set(0xFFFF00);
                    if (this.pulseSphere) {
                        this.pulseSphere.material.color.set(0xFFFF00);
                    }
                }
            }
        } catch (error) {
            console.error("Error updating breathing:", error);
        }
    }
    
    handleInteraction(type, data) {
        console.log(`Bio-Survival Circuit: ${type} interaction at position ${data.position.x}, ${data.position.y}, ${data.position.z}`);
        
        // Handle different types of interactions
        if (type === 'interact') {
            console.log('Player interacting with Bio-Survival environment');
            
            // Check if player is near any interactive objects
            const playerPos = data.position;
            const nearbyObjects = this.findNearbyObjects(playerPos, 3); // Search within 3 units
            
            if (nearbyObjects.length > 0) {
                console.log(`Found ${nearbyObjects.length} interactive objects nearby`);
                // Interact with the first object
                this.interactWithObject(nearbyObjects[0]);
            }
        }
        
        // Handle breathing synchronization
        if (type === 'action' && data.player.keys.action) {
            console.log('Player attempting to synchronize breathing');
            
            // Try to align with the current breathing target
            this.breathingPhase = this.breathingTarget;
            
            // Visual feedback
            if (this.camera) {
                // Create a flash effect
                const flash = document.createElement('div');
                flash.style.position = 'fixed';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.width = '100%';
                flash.style.height = '100%';
                flash.style.backgroundColor = this.breathingAligned ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 255, 0, 0.2)';
                flash.style.zIndex = '1000';
                flash.style.pointerEvents = 'none';
                flash.style.transition = 'opacity 0.5s ease';
                
                document.body.appendChild(flash);
                
                // Fade out
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(flash);
                    }, 500);
                }, 100);
            }
        }
    }
    
    // Helper method to find nearby objects
    findNearbyObjects(position, radius) {
        const nearbyObjects = [];
        
        // Check if this.objects exists and is an array
        if (Array.isArray(this.objects)) {
            for (const obj of this.objects) {
                if (obj.userData && obj.userData.isInteractive) {
                    const distance = position.distanceTo(obj.position);
                    if (distance < radius) {
                        nearbyObjects.push(obj);
                    }
                }
            }
        }
        
        return nearbyObjects;
    }
    
    showInteractionFeedback(message, color) {
        try {
            // Create feedback element
            const feedback = document.createElement('div');
            feedback.style.position = 'fixed';
            feedback.style.top = '50%';
            feedback.style.left = '50%';
            feedback.style.transform = 'translate(-50%, -50%)';
            feedback.style.color = new THREE.Color(color).getStyle();
            feedback.style.fontSize = '24px';
            feedback.style.fontWeight = 'bold';
            feedback.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.8)';
            feedback.style.zIndex = '1500';
            feedback.style.transition = 'all 0.5s ease';
            feedback.style.padding = '15px 25px';
            feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            feedback.style.borderRadius = '5px';
            feedback.style.border = `1px solid ${new THREE.Color(color).getStyle()}`;
            feedback.textContent = message;
            
            document.body.appendChild(feedback);
            
            // Animate feedback
            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translate(-50%, -100px)';
                
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 500);
            }, 1000);
        } catch (error) {
            console.error("Error showing interaction feedback:", error);
        }
    }
    
    // Add update method with comprehensive error handling
    update(delta) {
        try {
            // Ensure status UI is created when circuit is active
            if (!this.playerStatus.hasStatusUI) {
                this.createStatusUI();
            }
            
            // Update player status
            this.updatePlayerStatus(delta);
            
            // Update day/night cycle
            this.updateDayNightCycle(delta);
            
            // Update objects
            if (typeof this.updateObjects === 'function') {
                this.updateObjects(delta);
            }
            
            // Update particles
            if (typeof this.updateParticles === 'function') {
                this.updateParticles(delta);
            }
            
            // Update lighting
            if (typeof this.updateLighting === 'function') {
                this.updateLighting(delta);
            }
            
            // Update breathing
            if (typeof this.updateBreathing === 'function') {
                this.updateBreathing(delta);
            }
        } catch (error) {
            console.error("Critical error in Bio-Survival circuit update:", error);
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Create circuit-specific environment
        this.createEnvironment();
        
        // Create circuit-specific lighting
        this.createLighting();
        
        // Create circuit-specific particles
        this.createParticles();
        
        this.isInitialized = true;
        console.log(`Initialized ${this.name}`);
    }
    
    createStatusUI() {
        if (this.playerStatus.hasStatusUI) return;
        
        try {
            // Create UI container with improved styling
            const statusContainer = document.createElement('div');
            statusContainer.id = 'bio-survival-status';
            statusContainer.style.position = 'fixed';
            statusContainer.style.top = '20px';
            statusContainer.style.left = '20px';
            statusContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            statusContainer.style.padding = '10px';
            statusContainer.style.borderRadius = '5px';
            statusContainer.style.color = '#FFFFFF';
            statusContainer.style.fontFamily = 'Arial, sans-serif';
            statusContainer.style.fontSize = '14px';
            statusContainer.style.zIndex = '1000';
            statusContainer.style.display = 'flex';
            statusContainer.style.flexDirection = 'column';
            statusContainer.style.gap = '5px';
            statusContainer.style.minWidth = '180px';
            statusContainer.style.border = '1px solid rgba(0, 255, 255, 0.3)';
            statusContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            
            // Add header
            const header = document.createElement('div');
            header.textContent = 'BIO-SURVIVAL STATUS';
            header.style.textAlign = 'center';
            header.style.fontWeight = 'bold';
            header.style.fontSize = '16px';
            header.style.marginBottom = '5px';
            header.style.color = '#00FFFF';
            header.style.borderBottom = '1px solid rgba(0, 255, 255, 0.3)';
            header.style.paddingBottom = '5px';
            
            statusContainer.appendChild(header);
            
            // Create status bars
            const statuses = [
                { name: 'Health', id: 'health', color: '#FF0000', icon: '❤️' },
                { name: 'Food', id: 'food', color: '#00FF00', icon: '🍎' },
                { name: 'Water', id: 'water', color: '#0088FF', icon: '💧' },
                { name: 'Shelter', id: 'shelter', color: '#888888', icon: '🏠' },
                { name: 'Breathing', id: 'breathing', color: '#FFFF00', icon: '🌬️' }
            ];
            
            statuses.forEach(status => {
                const statusBar = document.createElement('div');
                statusBar.style.display = 'flex';
                statusBar.style.flexDirection = 'column';
                statusBar.style.gap = '2px';
                
                const label = document.createElement('div');
                label.style.display = 'flex';
                label.style.justifyContent = 'space-between';
                label.style.alignItems = 'center';
                
                // Add icon
                const icon = document.createElement('span');
                icon.textContent = status.icon;
                icon.style.marginRight = '5px';
                
                // Add label text
                const labelText = document.createElement('span');
                labelText.textContent = status.name;
                labelText.style.flex = '1';
                
                const valueSpan = document.createElement('span');
                valueSpan.id = `${status.id}-value`;
                valueSpan.textContent = this.playerStatus[status.id === 'breathing' ? 'breathingAlignment' : status.id];
                
                label.appendChild(icon);
                label.appendChild(labelText);
                label.appendChild(valueSpan);
                
                const bar = document.createElement('div');
                bar.style.width = '100%';
                bar.style.height = '5px';
                bar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                bar.style.borderRadius = '3px';
                bar.style.overflow = 'hidden';
                
                const fill = document.createElement('div');
                fill.id = `${status.id}-bar`;
                fill.style.width = `${this.playerStatus[status.id === 'breathing' ? 'breathingAlignment' : status.id]}%`;
                fill.style.height = '100%';
                fill.style.backgroundColor = status.color;
                fill.style.transition = 'width 0.3s ease';
                
                bar.appendChild(fill);
                statusBar.appendChild(label);
                statusBar.appendChild(bar);
                statusContainer.appendChild(statusBar);
            });
            
            document.body.appendChild(statusContainer);
            this.playerStatus.hasStatusUI = true;
        } catch (error) {
            console.error("Error creating status UI:", error);
        }
    }
    
    updateStatusUI() {
        if (!this.playerStatus.hasStatusUI) return;
        
        // Update status bars
        document.getElementById('health-value').textContent = Math.round(this.playerStatus.health);
        document.getElementById('food-value').textContent = Math.round(this.playerStatus.food);
        document.getElementById('water-value').textContent = Math.round(this.playerStatus.water);
        document.getElementById('shelter-value').textContent = Math.round(this.playerStatus.shelter);
        document.getElementById('breathing-value').textContent = Math.round(this.playerStatus.breathingAlignment);
        
        document.getElementById('health-bar').style.width = `${this.playerStatus.health}%`;
        document.getElementById('food-bar').style.width = `${this.playerStatus.food}%`;
        document.getElementById('water-bar').style.width = `${this.playerStatus.water}%`;
        document.getElementById('shelter-bar').style.width = `${this.playerStatus.shelter}%`;
        document.getElementById('breathing-bar').style.width = `${this.playerStatus.breathingAlignment}%`;
    }
    
    updatePlayerStatus(delta) {
        try {
            // Update breathing alignment display
            this.playerStatus.breathingAlignment = this.breathingAligned ? 100 : Math.floor(Math.random() * 50);
            
            // Food and water decay over time
            const foodDecayRate = 0.5; // % per second
            const waterDecayRate = 0.8; // % per second
            
            this.playerStatus.food = Math.max(0, this.playerStatus.food - foodDecayRate * delta);
            this.playerStatus.water = Math.max(0, this.playerStatus.water - waterDecayRate * delta);
            
            // Shelter decreases when outside, increases near shelter
            let shelterDecayRate = 0.3; // % per second
            // Check if near shelter (not implemented yet)
            if (this.isNearShelter()) {
                this.playerStatus.shelter = Math.min(100, this.playerStatus.shelter + 1 * delta);
            } else {
                this.playerStatus.shelter = Math.max(0, this.playerStatus.shelter - shelterDecayRate * delta);
            }
            
            // Health decreases when food, water or shelter are low
            let healthChange = 0;
            
            // Critical levels for resources
            const criticalLevel = 20;
            const dangerLevel = 40;
            
            // Apply health penalties for critical resources
            if (this.playerStatus.food < criticalLevel) {
                healthChange -= 2 * delta;
                // Show warning if first time reaching critical
                if (this.playerStatus.food < criticalLevel && this.playerStatus.food + foodDecayRate * delta >= criticalLevel) {
                    this.showInteractionFeedback("CRITICAL: Find food!", 0xFF0000);
                }
            } else if (this.playerStatus.food < dangerLevel) {
                healthChange -= 0.5 * delta;
                // Show warning when first reaching danger level
                if (this.playerStatus.food < dangerLevel && this.playerStatus.food + foodDecayRate * delta >= dangerLevel) {
                    this.showInteractionFeedback("WARNING: Food level low", 0xFFAA00);
                }
            }
            
            if (this.playerStatus.water < criticalLevel) {
                healthChange -= 3 * delta; // Water is more critical than food
                if (this.playerStatus.water < criticalLevel && this.playerStatus.water + waterDecayRate * delta >= criticalLevel) {
                    this.showInteractionFeedback("CRITICAL: Find water!", 0xFF0000);
                }
            } else if (this.playerStatus.water < dangerLevel) {
                healthChange -= 1 * delta;
                if (this.playerStatus.water < dangerLevel && this.playerStatus.water + waterDecayRate * delta >= dangerLevel) {
                    this.showInteractionFeedback("WARNING: Water level low", 0xFFAA00);
                }
            }
            
            if (this.playerStatus.shelter < criticalLevel) {
                healthChange -= 1 * delta;
                if (this.playerStatus.shelter < criticalLevel && this.playerStatus.shelter + shelterDecayRate * delta >= criticalLevel) {
                    this.showInteractionFeedback("CRITICAL: Find shelter!", 0xFF0000);
                }
            }
            
            // Health regenerates when resources are high and breathing is aligned
            const resourcesHealthy = this.playerStatus.food > 70 && this.playerStatus.water > 70 && this.playerStatus.shelter > 60;
            
            if (resourcesHealthy && this.breathingAligned) {
                healthChange += 3 * delta; // Fast regeneration when all conditions met
                
                // Occasional feedback on good status
                if (Math.random() < 0.01) {
                    this.showInteractionFeedback("THRIVING: Resources balanced", 0x00FF00);
                }
            } else if (resourcesHealthy) {
                healthChange += 1 * delta; // Slow regeneration with good resources
            } else if (this.breathingAligned) {
                healthChange += 0.5 * delta; // Minimal regeneration with breathing
            }
            
            // Apply health change
            this.playerStatus.health = Math.min(100, Math.max(0, this.playerStatus.health + healthChange));
            
            // Update UI
            this.updateStatusUI();
            
            // Check for game over condition
            if (this.playerStatus.health <= 0) {
                this.gameOver();
            }
        } catch (error) {
            console.error("Error updating player status:", error);
        }
    }
    
    isNearShelter() {
        // Check if player is near a shelter
        // For now, just simulate with some shelter points
        
        try {
            if (!this.camera) return false;
            
            // If we haven't created shelter points yet, create them
            if (!this.shelterPoints) {
                this.shelterPoints = [];
                // Create several random shelter points
                for (let i = 0; i < 5; i++) {
                    this.shelterPoints.push(new THREE.Vector3(
                        (Math.random() - 0.5) * this.terrainSize * 0.8,
                        2,
                        (Math.random() - 0.5) * this.terrainSize * 0.8
                    ));
                }
                
                // Visualize shelter points with simple markers
                this.shelterPoints.forEach((point, index) => {
                    const markerGeometry = new THREE.ConeGeometry(2, 4, 4);
                    const markerMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0x888888,
                        transparent: true,
                        opacity: 0.7
                    });
                    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                    marker.position.copy(point);
                    marker.name = `shelter-marker-${index}`;
                    this.group.add(marker);
                    
                    // Add a label
                    this.createTextSprite(`Shelter ${index+1}`, point.clone().add(new THREE.Vector3(0, 4, 0)), 0x888888);
                });
            }
            
            // Check distance to each shelter point
            const playerPos = this.camera.position.clone();
            const shelterDistance = 25; // Distance within which shelter is effective
            
            for (let i = 0; i < this.shelterPoints.length; i++) {
                const distance = playerPos.distanceTo(this.shelterPoints[i]);
                if (distance < shelterDistance) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error("Error checking shelter proximity:", error);
            return false;
        }
    }
    
    gameOver() {
        try {
            // Create game over screen
            const gameOverDiv = document.createElement('div');
            gameOverDiv.style.position = 'fixed';
            gameOverDiv.style.top = '0';
            gameOverDiv.style.left = '0';
            gameOverDiv.style.width = '100%';
            gameOverDiv.style.height = '100%';
            gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            gameOverDiv.style.color = '#FF0000';
            gameOverDiv.style.display = 'flex';
            gameOverDiv.style.flexDirection = 'column';
            gameOverDiv.style.justifyContent = 'center';
            gameOverDiv.style.alignItems = 'center';
            gameOverDiv.style.zIndex = '2000';
            gameOverDiv.style.fontFamily = 'Arial, sans-serif';
            
            const title = document.createElement('h1');
            title.textContent = 'SURVIVAL FAILED';
            title.style.fontSize = '48px';
            title.style.margin = '0 0 20px 0';
            
            const message = document.createElement('p');
            message.textContent = 'Your bio-survival circuit has shut down';
            message.style.fontSize = '24px';
            message.style.margin = '0 0 40px 0';
            
            const causeOfDeath = document.createElement('p');
            causeOfDeath.style.fontSize = '18px';
            causeOfDeath.style.margin = '0 0 40px 0';
            
            // Determine cause of death
            if (this.playerStatus.food <= 0) {
                causeOfDeath.textContent = 'Cause: Starvation';
            } else if (this.playerStatus.water <= 0) {
                causeOfDeath.textContent = 'Cause: Dehydration';
            } else if (this.playerStatus.shelter <= 0) {
                causeOfDeath.textContent = 'Cause: Exposure';
            } else {
                causeOfDeath.textContent = 'Cause: System failure';
            }
            
            const restartButton = document.createElement('button');
            restartButton.textContent = 'RESTART CIRCUIT';
            restartButton.style.padding = '12px 24px';
            restartButton.style.fontSize = '18px';
            restartButton.style.backgroundColor = '#FF0000';
            restartButton.style.color = '#FFFFFF';
            restartButton.style.border = 'none';
            restartButton.style.borderRadius = '4px';
            restartButton.style.cursor = 'pointer';
            
            restartButton.addEventListener('click', () => {
                document.body.removeChild(gameOverDiv);
                this.resetCircuit();
            });
            
            gameOverDiv.appendChild(title);
            gameOverDiv.appendChild(message);
            gameOverDiv.appendChild(causeOfDeath);
            gameOverDiv.appendChild(restartButton);
            
            document.body.appendChild(gameOverDiv);
        } catch (error) {
            console.error("Error showing game over screen:", error);
            alert("GAME OVER: Bio-survival circuit failed");
        }
    }
    
    resetCircuit() {
        try {
            // Reset player status
            this.playerStatus = {
                health: 100,
                food: 100,
                water: 100,
                shelter: 100,
                breathingAlignment: 0,
                hasStatusUI: false,
                nightWarningShown: false
            };
            
            // Remove status UI if exists
            const statusUI = document.getElementById('bio-survival-status');
            if (statusUI) {
                document.body.removeChild(statusUI);
            }
            
            // Re-initialize circuit
            this.init(this.scene, this.camera);
            
            // Show feedback
            this.showInteractionFeedback("Bio-Survival Circuit Reset", 0x00FF00);
        } catch (error) {
            console.error("Error resetting circuit:", error);
        }
    }
    
    // Helper method to create text sprites
    createTextSprite(text, position, color = 0xFFFFFF) {
        try {
            // Create canvas for text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            
            // Draw text
            context.font = '24px Arial';
            context.fillStyle = '#FFFFFF';
            context.textAlign = 'center';
            context.fillText(text, 128, 32);
            
            // Create texture
            const texture = new THREE.CanvasTexture(canvas);
            
            // Create sprite material
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true
            });
            
            // Create sprite
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(8, 2, 1);
            
            this.group.add(sprite);
            return sprite;
        } catch (error) {
            console.error("Error creating text sprite:", error);
            return null;
        }
    }
    
    // Add weather system
    updateWeather(delta, isDay) {
        try {
            const weather = this.dayNightCycle.weather;
            
            // Update timer for weather changes
            weather.timeSinceLastChange += delta;
            
            // Consider weather change if enough time has passed
            if (weather.timeSinceLastChange >= weather.changeInterval || weather.currentEffect === null) {
                // Reset timer
                weather.timeSinceLastChange = 0;
                
                // Different weather probabilities based on time of day
                let rainProbability = isDay ? 0.2 : 0.4;  // More rain at night
                let fogProbability = isDay ? 0.1 : 0.3;   // More fog at night
                let clearProbability = isDay ? 0.7 : 0.3; // More clear skies during day
                
                // Get random number to determine weather
                const rand = Math.random();
                
                // Determine new weather
                if (rand < clearProbability) {
                    this.setWeather('clear');
                } else if (rand < clearProbability + rainProbability) {
                    this.setWeather('rain');
                } else {
                    this.setWeather('fog');
                }
            }
            
            // Update current weather effect
            if (weather.currentEffect === 'rain') {
                // Update rain particles or intensity
                if (weather.rainIntensity < 1.0) {
                    weather.rainIntensity += delta * 0.5; // Gradually increase intensity
                }
                
                // 10% chance per second of thunder during rain at night
                if (!isDay && Math.random() < delta * 0.1) {
                    this.createThunderEffect();
                }
            } else if (weather.currentEffect === 'fog') {
                // Update fog density
                if (weather.fogIntensity < 1.0) {
                    weather.fogIntensity += delta * 0.2; // Gradually increase intensity
                }
                
                // Apply fog effect to scene
                const scene = this.game.scene;
                if (scene && scene.fog) {
                    // Adjust fog based on intensity and time of day
                    const fogFactor = weather.fogIntensity * (isDay ? 0.5 : 1.0);
                    scene.fog.density = 0.01 * fogFactor;
                }
            } else {
                // Clear weather - decrease any active effects
                if (weather.rainIntensity > 0) {
                    weather.rainIntensity -= delta * 0.5;
                }
                if (weather.fogIntensity > 0) {
                    weather.fogIntensity -= delta * 0.5;
                    
                    // Update scene fog
                    const scene = this.game.scene;
                    if (scene && scene.fog) {
                        scene.fog.density = 0.01 * weather.fogIntensity;
                    }
                }
            }
        } catch (error) {
            console.error("Error updating weather:", error);
        }
    }
    
    setWeather(type) {
        try {
            const weather = this.dayNightCycle.weather;
            const scene = this.game.scene;
            
            // Set new weather type
            weather.currentEffect = type;
            
            if (type === 'clear') {
                // Clear weather - we'll handle the gradual decrease in updateWeather
                this.showInteractionFeedback("The skies are clearing", 0x87CEEB);
            } 
            else if (type === 'rain') {
                // Start rain effect
                weather.rainIntensity = 0.2; // Start with light rain
                this.showInteractionFeedback("It's starting to rain", 0x4444FF);
                
                // Create rain particles if they don't exist
                if (!weather.particles) {
                    this.createRainParticles();
                }
            } 
            else if (type === 'fog') {
                // Start fog effect
                weather.fogIntensity = 0.2; // Start with light fog
                this.showInteractionFeedback("Fog is rolling in", 0xCCCCCC);
                
                // Create scene fog if it doesn't exist
                if (scene && !scene.fog) {
                    scene.fog = new THREE.FogExp2(0xCCCCCC, 0.002);
                }
            }
        } catch (error) {
            console.error("Error setting weather:", error);
        }
    }
    
    createRainParticles() {
        try {
            const weather = this.dayNightCycle.weather;
            
            // Create a particle system for rain
            const rainCount = 5000;
            const rainGeometry = new THREE.BufferGeometry();
            const rainPositions = new Float32Array(rainCount * 3);
            
            // Set initial positions randomly in a large box above the player
            for (let i = 0; i < rainCount * 3; i += 3) {
                rainPositions[i] = (Math.random() - 0.5) * 200; // x
                rainPositions[i+1] = Math.random() * 100 + 50;  // y (above player)
                rainPositions[i+2] = (Math.random() - 0.5) * 200; // z
            }
            
            rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
            
            // Create rain material
            const rainMaterial = new THREE.PointsMaterial({
                color: 0x9999FF,
                size: 0.5,
                transparent: true,
                opacity: 0.6
            });
            
            // Create particle system
            const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
            rainParticles.name = 'rain';
            
            // Add to scene
            this.group.add(rainParticles);
            
            // Store reference
            weather.particles = rainParticles;
        } catch (error) {
            console.error("Error creating rain particles:", error);
        }
    }
    
    createThunderEffect() {
        try {
            // Create a flash of light
            const thunder = new THREE.AmbientLight(0xFFFFFF, 1.0);
            this.group.add(thunder);
            
            // Random thunder sound
            this.showInteractionFeedback("Thunder rumbles in the distance", 0xFFFF00);
            
            // Flash duration (150-300ms)
            const duration = 150 + Math.random() * 150;
            
            // Remove after flash
            setTimeout(() => {
                if (this.group.children.includes(thunder)) {
                    this.group.remove(thunder);
                }
            }, duration);
        } catch (error) {
            console.error("Error creating thunder effect:", error);
        }
    }
}
