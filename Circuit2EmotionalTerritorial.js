// Circuit 2: Emotional-Territorial - Tribal village with rival factions
// import { BaseCircuit } from './BaseCircuit.js';

class Circuit2EmotionalTerritorial {
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
        this.name = 'Circuit 2: Emotional-Territorial';
        this.description = 'Tribal village with rival factions';
        this.circuitNumber = 2;
        
        // Circuit-specific colors
        this.primaryColor = new THREE.Color(0xFF6600); // Orange
        this.secondaryColor = new THREE.Color(0x8B4513); // Brown
        this.accentColor = new THREE.Color(0xFFFF00); // Yellow
        
        // Circuit-specific properties
        this.territorySize = 100;
        this.villageRadius = 30;
        this.factionCount = 3;
        this.structuresPerFaction = 5;
        
        // Emotional state
        this.emotionalState = {
            anger: 0.5,
            fear: 0.5,
            joy: 0.5,
            sadness: 0.5
        };
        
        // Faction territories
        this.factions = [];
        
        // Avatar aura
        this.aura = null;
    }
    
    createEnvironment() {
        console.log('Creating Emotional-Territorial environment');
        
        // Create ground
        this.createGround();
        
        // Create skybox
        this.createSkybox();
        
        // Create territories
        this.createTerritories();
    }
    
    createGround() {
        // Create ground geometry
        const geometry = new THREE.PlaneGeometry(
            this.territorySize, 
            this.territorySize, 
            32, 
            32
        );
        
        // Rotate to be horizontal
        geometry.rotateX(-Math.PI / 2);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: 0xA0522D, // Sienna
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Create mesh
        const ground = new THREE.Mesh(geometry, material);
        ground.receiveShadow = true;
        ground.name = 'ground';
        
        // Add to group
        this.group.add(ground);
        this.objects.push(ground);
    }
    
    createSkybox() {
        // Create skybox geometry
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        
        // Create skybox material
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFA07A, // Light salmon
            side: THREE.BackSide
        });
        
        // Create mesh
        const skybox = new THREE.Mesh(geometry, material);
        skybox.name = 'skybox';
        
        // Add to group
        this.group.add(skybox);
    }
    
    createTerritories() {
        // Create faction territories
        const factionColors = [
            0xFF0000, // Red faction
            0x0000FF, // Blue faction
            0x00FF00  // Green faction
        ];
        
        for (let i = 0; i < this.factionCount; i++) {
            // Create faction object
            const faction = {
                id: i,
                color: new THREE.Color(factionColors[i]),
                territory: null,
                structures: [],
                npcs: [],
                influence: 0.33, // Equal influence initially
                relationship: 0 // Neutral relationship with player
            };
            
            // Create territory marker
            const angle = (i / this.factionCount) * Math.PI * 2;
            const distance = this.villageRadius;
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            // Create territory geometry
            const geometry = new THREE.CircleGeometry(15, 32);
            geometry.rotateX(-Math.PI / 2);
            
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: faction.color,
                transparent: true,
                opacity: 0.3,
                roughness: 0.8,
                metalness: 0.2
            });
            
            // Create mesh
            const territory = new THREE.Mesh(geometry, material);
            territory.position.set(x, 0.1, z);
            territory.name = `territory-${i}`;
            
            // Add to group
            this.group.add(territory);
            this.objects.push(territory);
            
            // Store territory in faction
            faction.territory = territory;
            
            // Create structures for this faction
            this.createFactionStructures(faction, x, z);
            
            // Create NPCs for this faction
            this.createFactionNPCs(faction, x, z);
            
            // Add faction to list
            this.factions.push(faction);
        }
    }
    
    createFactionStructures(faction, centerX, centerZ) {
        // Create structures for this faction
        for (let i = 0; i < this.structuresPerFaction; i++) {
            // Calculate position
            const angle = (i / this.structuresPerFaction) * Math.PI * 2;
            const distance = 8 + Math.random() * 5;
            
            const x = centerX + Math.cos(angle) * distance;
            const z = centerZ + Math.sin(angle) * distance;
            
            // Create structure geometry
            let geometry;
            
            // Different structure types
            if (i === 0) {
                // Main structure (larger)
                geometry = new THREE.CylinderGeometry(3, 4, 8, 8);
            } else {
                // Regular structures
                geometry = new THREE.CylinderGeometry(1.5, 2, 4 + Math.random() * 2, 8);
            }
            
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: faction.color,
                roughness: 0.7,
                metalness: 0.3
            });
            
            // Create mesh
            const structure = new THREE.Mesh(geometry, material);
            structure.position.set(x, geometry.parameters.height / 2, z);
            structure.castShadow = true;
            structure.receiveShadow = true;
            structure.name = `structure-${faction.id}-${i}`;
            
            // Add to group
            this.group.add(structure);
            this.objects.push(structure);
            
            // Add to faction structures
            faction.structures.push(structure);
        }
    }
    
    createFactionNPCs(faction, centerX, centerZ) {
        // Create NPCs for this faction
        const npcCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < npcCount; i++) {
            // Calculate position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 12;
            
            const x = centerX + Math.cos(angle) * distance;
            const z = centerZ + Math.sin(angle) * distance;
            
            // Create NPC geometry
            const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
            
            // Create material
            const material = new THREE.MeshStandardMaterial({
                color: faction.color,
                roughness: 0.5,
                metalness: 0.5
            });
            
            // Create mesh
            const npc = new THREE.Mesh(geometry, material);
            npc.position.set(x, 1.25, z);
            npc.castShadow = true;
            npc.receiveShadow = true;
            npc.name = `npc-${faction.id}-${i}`;
            
            // Add movement properties
            npc.userData = {
                moveSpeed: 0.5 + Math.random() * 0.5,
                rotationSpeed: 0.5 + Math.random() * 0.5,
                targetPosition: new THREE.Vector3(x, 1.25, z),
                homePosition: new THREE.Vector3(x, 1.25, z),
                state: 'idle',
                idleTime: 0,
                maxIdleTime: 5 + Math.random() * 5
            };
            
            // Add to group
            this.group.add(npc);
            this.objects.push(npc);
            
            // Add to faction NPCs
            faction.npcs.push(npc);
        }
    }
    
    createLighting() {
        console.log('Creating Emotional-Territorial lighting');
        
        // Create directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xFFCC99, 1);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        
        // Configure shadow
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        
        // Add to group
        this.group.add(sunLight);
        this.lights.push(sunLight);
        
        // Create ambient light
        const ambientLight = new THREE.AmbientLight(0xFFCC99, 0.5);
        this.group.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Create faction lights
        this.createFactionLights();
        
        // Create emotional aura
        this.createEmotionalAura();
    }
    
    createFactionLights() {
        // Create lights for each faction
        for (let i = 0; i < this.factions.length; i++) {
            const faction = this.factions[i];
            
            // Get main structure position
            const mainStructure = faction.structures[0];
            const position = mainStructure.position.clone();
            position.y += 10;
            
            // Create point light
            const light = new THREE.PointLight(faction.color, 1, 30);
            light.position.copy(position);
            light.castShadow = true;
            light.name = `faction-light-${i}`;
            
            // Add to group
            this.group.add(light);
            this.lights.push(light);
        }
    }
    
    createEmotionalAura() {
        // Create emotional aura geometry
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: this.getEmotionalColor(),
            transparent: true,
            opacity: 0.5,
            roughness: 0.1,
            metalness: 0.9,
            emissive: this.getEmotionalColor(),
            emissiveIntensity: 0.5
        });
        
        // Create mesh
        this.aura = new THREE.Mesh(geometry, material);
        this.aura.position.set(0, 2, 0);
        this.aura.name = 'emotional-aura';
        
        // Add to group
        this.group.add(this.aura);
        this.objects.push(this.aura);
    }
    
    createParticles() {
        console.log('Creating Emotional-Territorial particles');
        
        // Create particles for each faction
        for (let i = 0; i < this.factions.length; i++) {
            this.createFactionParticles(this.factions[i]);
        }
        
        // Create emotional aura particles
        this.createEmotionalParticles();
    }
    
    createFactionParticles(faction) {
        // Create particle geometry
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        // Get territory position
        const position = faction.territory.position.clone();
        
        // Generate positions in circle
        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 15 * Math.random();
            const angle = Math.random() * Math.PI * 2;
            
            particlePositions[i] = position.x + radius * Math.cos(angle);
            particlePositions[i + 1] = Math.random() * 5;
            particlePositions[i + 2] = position.z + radius * Math.sin(angle);
        }
        
        // Set positions
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        // Create material
        const particleMaterial = new THREE.PointsMaterial({
            color: faction.color,
            size: 0.2,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        
        // Create points
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = `faction-particles-${faction.id}`;
        
        // Add to group
        this.group.add(particles);
        this.particles.push(particles);
    }
    
    createEmotionalParticles() {
        // Create particle geometry
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        // Generate positions in sphere
        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) + 2;
            particlePositions[i + 2] = radius * Math.cos(phi);
        }
        
        // Set positions
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        // Create material
        const particleMaterial = new THREE.PointsMaterial({
            color: this.getEmotionalColor(),
            size: 0.1,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        // Create points
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'emotional-particles';
        
        // Add to group
        this.group.add(particles);
        this.particles.push(particles);
    }
    
    updateObjects(delta) {
        // Update NPCs
        this.updateNPCs(delta);
        
        // Update emotional aura
        this.updateEmotionalAura(delta);
        
        // Update faction territories
        this.updateTerritories(delta);
    }
    
    updateNPCs(delta) {
        // Update all NPCs
        for (let i = 0; i < this.factions.length; i++) {
            const faction = this.factions[i];
            
            for (let j = 0; j < faction.npcs.length; j++) {
                const npc = faction.npcs[j];
                const userData = npc.userData;
                
                // Update based on state
                switch (userData.state) {
                    case 'idle':
                        // Increment idle time
                        userData.idleTime += delta;
                        
                        // Check if idle time exceeded
                        if (userData.idleTime >= userData.maxIdleTime) {
                            // Reset idle time
                            userData.idleTime = 0;
                            
                            // Set new target position
                            const angle = Math.random() * Math.PI * 2;
                            const distance = Math.random() * 10;
                            
                            const x = userData.homePosition.x + Math.cos(angle) * distance;
                            const z = userData.homePosition.z + Math.sin(angle) * distance;
                            
                            userData.targetPosition.set(x, userData.homePosition.y, z);
                            userData.state = 'moving';
                        }
                        break;
                        
                    case 'moving':
                        // Move towards target
                        const direction = new THREE.Vector3()
                            .subVectors(userData.targetPosition, npc.position)
                            .normalize();
                        
                        // Calculate movement
                        const movement = direction.multiplyScalar(userData.moveSpeed * delta);
                        npc.position.add(movement);
                        
                        // Rotate towards movement direction
                        if (movement.length() > 0.01) {
                            const targetRotation = Math.atan2(movement.x, movement.z);
                            
                            // Interpolate rotation
                            let currentRotation = npc.rotation.y;
                            const rotationDiff = targetRotation - currentRotation;
                            
                            // Handle rotation wrap-around
                            if (rotationDiff > Math.PI) {
                                currentRotation += Math.PI * 2;
                            } else if (rotationDiff < -Math.PI) {
                                currentRotation -= Math.PI * 2;
                            }
                            
                            // Apply rotation
                            npc.rotation.y = THREE.MathUtils.lerp(
                                currentRotation,
                                targetRotation,
                                userData.rotationSpeed * delta
                            );
                        }
                        
                        // Check if reached target
                        if (npc.position.distanceTo(userData.targetPosition) < 0.5) {
                            userData.state = 'idle';
                        }
                        break;
                }
            }
        }
    }
    
    updateEmotionalAura(delta) {
        if (this.aura) {
            // Update aura color based on emotional state
            const color = this.getEmotionalColor();
            this.aura.material.color.set(color);
            this.aura.material.emissive.set(color);
            
            // Pulse aura
            const time = Date.now() * 0.001;
            const scale = 1 + Math.sin(time) * 0.2;
            this.aura.scale.set(scale, scale, scale);
            
            // Update emotional particles
            const emotionalParticles = this.particles.find(p => p.name === 'emotional-particles');
            if (emotionalParticles) {
                emotionalParticles.material.color.set(color);
            }
        }
    }
    
    updateTerritories(delta) {
        // Update faction territories based on influence
        let totalInfluence = 0;
        
        for (let i = 0; i < this.factions.length; i++) {
            totalInfluence += this.factions[i].influence;
        }
        
        // Normalize influence
        for (let i = 0; i < this.factions.length; i++) {
            const faction = this.factions[i];
            const normalizedInfluence = faction.influence / totalInfluence;
            
            // Update territory size
            const territory = faction.territory;
            const scale = 0.8 + normalizedInfluence * 0.5;
            territory.scale.set(scale, 1, scale);
            
            // Update faction lights
            const light = this.lights.find(l => l.name === `faction-light-${i}`);
            if (light) {
                light.intensity = 0.5 + normalizedInfluence;
            }
        }
    }
    
    updateParticles(delta) {
        // Update faction particles
        for (let i = 0; i < this.factions.length; i++) {
            const particles = this.particles.find(p => p.name === `faction-particles-${i}`);
            if (particles) {
                // Rotate particles
                particles.rotation.y += delta * 0.1;
                
                // Update opacity based on faction influence
                const normalizedInfluence = this.factions[i].influence / 0.33;
                particles.material.opacity = 0.3 + normalizedInfluence * 0.3;
            }
        }
        
        // Update emotional particles
        const emotionalParticles = this.particles.find(p => p.name === 'emotional-particles');
        if (emotionalParticles && this.aura) {
            // Match aura position
            emotionalParticles.position.copy(this.aura.position);
            
            // Match aura scale
            emotionalParticles.scale.copy(this.aura.scale);
        }
    }
    
    updateLighting(delta) {
        // Update faction lights
        for (let i = 0; i < this.factions.length; i++) {
            const light = this.lights.find(l => l.name === `faction-light-${i}`);
            if (light) {
                // Pulse light
                const time = Date.now() * 0.001;
                const intensity = 0.8 + Math.sin(time + i) * 0.2;
                light.intensity = intensity * (0.5 + this.factions[i].influence);
                
                // Adjust light color based on relationship
                const relationship = this.factions[i].relationship;
                if (relationship > 0.3) {
                    // Friendly - warmer light
                    light.color.setHSL(0.1, 0.7, 0.5); // Orange-yellow
                } else if (relationship < -0.3) {
                    // Hostile - colder light
                    light.color.setHSL(0.6, 0.7, 0.5); // Blue-purple
                } else {
                    // Neutral - faction color but dimmer
                    light.color.copy(this.factions[i].color);
                    light.color.multiplyScalar(0.8);
                }
            }
        }
        
        // Day-night cycle
        const skybox = this.group.getObjectByName('skybox');
        if (skybox && skybox.material) {
            // Get time of day (0-1)
            const timeOfDay = (Math.sin(Date.now() * 0.0001) + 1) * 0.5;
            
            // Adjust skybox color based on time of day
            if (timeOfDay < 0.3) {
                // Night
                skybox.material.color.setHSL(0.6, 0.8, timeOfDay * 0.3); // Dark blue
            } else if (timeOfDay < 0.4) {
                // Dawn
                const t = (timeOfDay - 0.3) * 10; // 0-1 during dawn
                skybox.material.color.setHSL(0.05, 0.8, 0.3 + t * 0.3); // Orange-yellow
            } else if (timeOfDay < 0.7) {
                // Day
                skybox.material.color.setHSL(0.6, 0.6, 0.8); // Light blue
            } else if (timeOfDay < 0.8) {
                // Dusk
                const t = (timeOfDay - 0.7) * 10; // 0-1 during dusk
                skybox.material.color.setHSL(0.05 - t * 0.05, 0.8, 0.6 - t * 0.3); // Orange to dark red
            } else {
                // Night
                skybox.material.color.setHSL(0.6, 0.8, 0.3 - (timeOfDay - 0.8) * 0.3); // Dark blue getting darker
            }
            
            // Influence sky color with emotional state
            if (this.emotionalState.anger > 0.7) {
                // Angry sky has red tint
                skybox.material.color.lerp(new THREE.Color(0x660000), this.emotionalState.anger * 0.3);
            } else if (this.emotionalState.sadness > 0.7) {
                // Sad sky has blue tint
                skybox.material.color.lerp(new THREE.Color(0x000066), this.emotionalState.sadness * 0.3);
            } else if (this.emotionalState.joy > 0.7) {
                // Happy sky has yellow tint
                skybox.material.color.lerp(new THREE.Color(0x666600), this.emotionalState.joy * 0.3);
            }
        }
        
        // Adjust ambient lighting based on time and emotion
        const ambientLight = this.lights.find(l => l.name === 'ambient-light');
        if (ambientLight) {
            // Get time of day (0-1)
            const timeOfDay = (Math.sin(Date.now() * 0.0001) + 1) * 0.5;
            
            // Base intensity varies with time of day
            let intensity = 0.2 + timeOfDay * 0.3;
            
            // Emotional influence
            if (this.emotionalState.fear > 0.5) {
                // Fear makes ambient light dimmer
                intensity *= (1 - (this.emotionalState.fear - 0.5) * 0.5);
            } else if (this.emotionalState.joy > 0.5) {
                // Joy makes ambient light brighter
                intensity *= (1 + (this.emotionalState.joy - 0.5) * 0.5);
            }
            
            ambientLight.intensity = intensity;
        }
    }
    
    getEmotionalColor() {
        // Calculate color based on emotional state
        const r = this.emotionalState.anger;
        const g = this.emotionalState.joy;
        const b = this.emotionalState.sadness;
        
        return new THREE.Color(r, g, b);
    }
    
    setEmotionalState(emotion, value) {
        // Set emotional state
        this.emotionalState[emotion] = THREE.MathUtils.clamp(value, 0, 1);
        
        // Update faction relationships based on emotional state
        this.updateFactionRelationships();
    }
    
    updateFactionRelationships() {
        // Update faction relationships based on emotional state
        for (let i = 0; i < this.factions.length; i++) {
            const faction = this.factions[i];
            
            // Different factions respond to different emotions
            switch (i) {
                case 0: // Red faction - responds to anger
                    faction.relationship = this.emotionalState.anger * 2 - 1;
                    break;
                case 1: // Blue faction - responds to sadness
                    faction.relationship = this.emotionalState.sadness * 2 - 1;
                    break;
                case 2: // Green faction - responds to joy
                    faction.relationship = this.emotionalState.joy * 2 - 1;
                    break;
            }
            
            // Update faction influence based on relationship
            faction.influence = 0.2 + Math.max(0, faction.relationship) * 0.3;
        }
    }
    
    // Enhanced interaction handling
    handleInteraction(type, data) {
        console.log(`Handling interaction: ${type}`);
        
        switch (type) {
            case 'territory':
                console.log(`Interacting with territory ${data.id}`);
                this.interactWithTerritory(data.id);
                break;
            case 'structure':
                console.log(`Interacting with structure ${data.id}`);
                this.interactWithStructure(data.id);
                break;
            case 'npc':
                console.log(`Talking to NPC ${data.id}`);
                break;
            case 'social':
                console.log('Engaging in social interaction');
                break;
            case 'emotion':
                // Direct emotional adjustment
                if (data.emotion && typeof data.value === 'number') {
                    console.log(`Setting emotional state: ${data.emotion} = ${data.value}`);
                    this.setEmotionalState(data.emotion, data.value);
                }
                break;
            default:
                console.log(`Interacting with ${data.type}`);
        }
    }
    
    // Interact with a territory
    interactWithTerritory(territoryId) {
        // Find the faction for this territory
        const faction = this.factions[territoryId];
        if (!faction) {
            console.error(`Territory ${territoryId} not found`);
            return;
        }
        
        console.log(`Interacting with ${this.getFactionName(territoryId)} territory`);
        
        // Visual feedback
        this.createTerritoryInteractionEffect(faction);
        
        // Affect emotional state based on faction type
        switch(territoryId) {
            case 0: // Red territory (anger-based)
                this.setEmotionalState('anger', Math.min(1, this.emotionalState.anger + 0.1));
                break;
            case 1: // Blue territory (sadness-based)
                this.setEmotionalState('sadness', Math.min(1, this.emotionalState.sadness + 0.1));
                break;
            case 2: // Green territory (joy-based)
                this.setEmotionalState('joy', Math.min(1, this.emotionalState.joy + 0.1));
                break;
        }
        
        // Update faction relationship
        faction.relationship = Math.min(1, faction.relationship + 0.1);
        
        // Update faction relationships based on new emotional state
        this.updateFactionRelationships();
    }
    
    // Interact with a structure
    interactWithStructure(structureData) {
        if (!structureData || typeof structureData.factionId !== 'number') {
            console.error('Invalid structure data');
            return;
        }
        
        const factionId = structureData.factionId;
        const structureId = structureData.structureId;
        
        console.log(`Interacting with structure ${structureId} of faction ${factionId}`);
        
        // Find the faction and structure
        const faction = this.factions[factionId];
        if (!faction) {
            console.error(`Faction ${factionId} not found`);
            return;
        }
        
        // More significant impact on emotional state
        switch(factionId) {
            case 0: // Red faction (anger-based)
                this.setEmotionalState('anger', Math.min(1, this.emotionalState.anger + 0.2));
                this.setEmotionalState('joy', Math.max(0, this.emotionalState.joy - 0.1));
                break;
            case 1: // Blue faction (sadness-based)
                this.setEmotionalState('sadness', Math.min(1, this.emotionalState.sadness + 0.2));
                this.setEmotionalState('fear', Math.min(1, this.emotionalState.fear + 0.1));
                break;
            case 2: // Green faction (joy-based)
                this.setEmotionalState('joy', Math.min(1, this.emotionalState.joy + 0.2));
                this.setEmotionalState('anger', Math.max(0, this.emotionalState.anger - 0.1));
                break;
        }
        
        // Update faction relationship
        faction.relationship = Math.min(1, faction.relationship + 0.2);
        
        // Create visual effect at structure
        if (faction.structures && faction.structures[structureId]) {
            const structure = faction.structures[structureId];
            
            // Create a pulse effect
            this.createStructureInteractionEffect(structure, faction.color);
        }
        
        // Update faction relationships
        this.updateFactionRelationships();
    }
    
    // Create visual effect for interaction
    createInteractionEffect(position, color, type) {
        // Create particle system for interaction effect
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        
        // Setup particles
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Distribute particles in sphere
            const radius = 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i3] = position.x + radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i3 + 1] = position.y + 2 + radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i3 + 2] = position.z + radius * Math.cos(phi);
            
            // Random sizes
            particleSizes[i] = 0.5 + Math.random() * 0.5;
        }
        
        // Set geometry attributes
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        // Create material based on interaction type
        let particleMaterial;
        
        if (type === 'positive') {
            // Positive interaction - bright glow
            particleMaterial = new THREE.PointsMaterial({
                color: color,
                size: 0.5,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
        } else if (type === 'negative') {
            // Negative interaction - dark, smoky effect
            particleMaterial = new THREE.PointsMaterial({
                color: color.clone().multiplyScalar(0.5), // Darker
                size: 0.5,
                transparent: true,
                opacity: 0.6,
                blending: THREE.NormalBlending
            });
        } else {
            // Neutral interaction - subtle effect
            particleMaterial = new THREE.PointsMaterial({
                color: color.clone().multiplyScalar(0.8), // Slightly darker
                size: 0.3,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
        }
        
        // Create particle system
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = `interaction-effect-${Date.now()}`;
        this.group.add(particles);
        
        // Store for animation
        const effect = {
            particles: particles,
            type: type,
            createdAt: Date.now(),
            duration: 2000 // 2 seconds
        };
        
        if (!this.interactionEffects) {
            this.interactionEffects = [];
        }
        
        this.interactionEffects.push(effect);
    }
    
    // Update interaction effects
    updateInteractionEffects(delta) {
        if (!this.interactionEffects || this.interactionEffects.length === 0) return;
        
        const now = Date.now();
        const remaining = [];
        
        for (let i = 0; i < this.interactionEffects.length; i++) {
            const effect = this.interactionEffects[i];
            const age = now - effect.createdAt;
            
            if (age < effect.duration) {
                // Still active, update effect
                const progress = age / effect.duration; // 0 to 1
                const particles = effect.particles;
                
                // Scale up and fade out
                particles.scale.set(1 + progress, 1 + progress, 1 + progress);
                particles.material.opacity = Math.max(0, 1 - progress * 1.2);
                
                // Move upward slightly
                particles.position.y += delta * 3;
                
                // Add to remaining list
                remaining.push(effect);
            } else {
                // Effect expired, remove
                this.group.remove(effect.particles);
            }
        }
        
        // Update effects list
        this.interactionEffects = remaining;
    }
    
    // Enhanced interaction handling
    handleInteraction(type, data) {
        if (type === 'faction') {
            this.interactWithFaction(data.factionId);
        } else {
            // Use existing interaction code
            console.log(`Handling interaction: ${type}`);
            
            switch (type) {
                case 'territory':
                    console.log(`Entering territory ${data.id}`);
                    // Trigger faction interaction
                    this.interactWithFaction(data.id);
                    break;
                case 'structure':
                    console.log(`Interacting with structure ${data.id}`);
                    break;
                case 'npc':
                    console.log(`Talking to NPC ${data.id}`);
                    break;
                case 'social':
                    console.log('Engaging in social interaction');
                    break;
                default:
                    console.log(`Interacting with ${data.type}`);
            }
        }
    }
    
    // Add atmospheric effects based on emotional state
    createAtmosphericEffects() {
        console.log('Creating atmospheric effects for Circuit 2');
        
        // Create fog to represent emotional atmosphere
        this.scene.fog = new THREE.FogExp2(0xFFAA55, 0.005);
        
        // Create a sky dome
        const skyDomeGeometry = new THREE.SphereGeometry(400, 32, 32);
        skyDomeGeometry.scale(-1, 1, 1); // Flip inside out
        
        const skyDomeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFA07A, // Light salmon
            side: THREE.BackSide,
            fog: false // Not affected by fog
        });
        
        this.skyDome = new THREE.Mesh(skyDomeGeometry, skyDomeMaterial);
        this.skyDome.name = 'sky-dome';
        this.group.add(this.skyDome);
        
        // Create a horizon glow
        const horizonGeometry = new THREE.RingGeometry(390, 400, 32);
        horizonGeometry.rotateX(Math.PI/2);
        
        const horizonMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF6600, // Orange
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3,
            fog: false
        });
        
        this.horizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
        this.horizon.name = 'horizon-glow';
        this.horizon.position.y = -5;
        this.group.add(this.horizon);
    }
    
    // Update atmospheric effects
    updateAtmosphere(delta) {
        if (!this.scene.fog) return;
        
        // Get time of day (0-1)
        const timeOfDay = (Math.sin(Date.now() * 0.0001) + 1) * 0.5;
        
        // Update fog color and density based on time and emotional state
        let fogColor = new THREE.Color();
        let fogDensity = 0.005;
        
        if (timeOfDay < 0.3) {
            // Night
            fogColor.setHSL(0.6, 0.5, timeOfDay * 0.3); // Dark blue
            fogDensity = 0.01; // Thicker fog at night
        } else if (timeOfDay < 0.4) {
            // Dawn
            const t = (timeOfDay - 0.3) * 10; // 0-1 during dawn
            fogColor.setHSL(0.05, 0.5, 0.3 + t * 0.3); // Orange-yellow
            fogDensity = 0.008 - t * 0.003;
        } else if (timeOfDay < 0.7) {
            // Day
            fogColor.setHSL(0.1, 0.3, 0.8); // Light warm color
            fogDensity = 0.003;
        } else if (timeOfDay < 0.8) {
            // Dusk
            const t = (timeOfDay - 0.7) * 10; // 0-1 during dusk
            fogColor.setHSL(0.05 - t * 0.05, 0.5, 0.6 - t * 0.3); // Orange to dark red
            fogDensity = 0.005 + t * 0.003;
        } else {
            // Night
            fogColor.setHSL(0.6, 0.5, 0.3 - (timeOfDay - 0.8) * 0.3); // Dark blue getting darker
            fogDensity = 0.01;
        }
        
        // Mix with emotional state
        if (this.emotionalState.anger > 0.5) {
            // Angry fog has red tint
            fogColor.lerp(new THREE.Color(0xFF0000), (this.emotionalState.anger - 0.5) * 0.5);
            fogDensity += (this.emotionalState.anger - 0.5) * 0.005; // Thicker fog when angry
        } else if (this.emotionalState.sadness > 0.5) {
            // Sad fog has blue tint
            fogColor.lerp(new THREE.Color(0x0000AA), (this.emotionalState.sadness - 0.5) * 0.5);
            fogDensity += (this.emotionalState.sadness - 0.5) * 0.003; // Slightly thicker fog when sad
        } else if (this.emotionalState.joy > 0.5) {
            // Happy fog has golden tint
            fogColor.lerp(new THREE.Color(0xFFAA00), (this.emotionalState.joy - 0.5) * 0.5);
            fogDensity -= (this.emotionalState.joy - 0.5) * 0.002; // Clearer fog when happy
        }
        
        // Apply changes
        this.scene.fog.color = fogColor;
        this.scene.fog.density = fogDensity;
        
        // Update sky dome color
        if (this.skyDome) {
            // Use a slightly lighter version of fog color for sky
            const skyColor = fogColor.clone();
            skyColor.multiplyScalar(1.2);
            this.skyDome.material.color = skyColor;
        }
        
        // Update horizon glow
        if (this.horizon) {
            // Horizon has a complementary color
            const hsl = {};
            fogColor.getHSL(hsl);
            hsl.h = (hsl.h + 0.5) % 1; // Complementary hue
            hsl.s = 0.7;
            hsl.l = 0.5;
            
            const horizonColor = new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
            this.horizon.material.color = horizonColor;
            
            // Pulse opacity with time
            const pulseSpeed = 0.0005;
            const pulseAmount = 0.1;
            this.horizon.material.opacity = 0.3 + Math.sin(Date.now() * pulseSpeed) * pulseAmount;
            
            // Rotate slowly
            this.horizon.rotation.y += delta * 0.05;
        }
    }
    
    // Create weather effects that respond to emotional state
    createWeatherEffects() {
        console.log('Creating weather effects for Circuit 2');
        
        // Initialize weather state
        this.weatherState = {
            type: 'clear', // clear, rain, storm
            intensity: 0,  // 0-1
            transitionTime: 0,
            lastUpdate: Date.now()
        };
        
        // Create rain particles
        const rainCount = 1000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);
        const rainSizes = new Float32Array(rainCount);
        
        // Setup rain particles
        for (let i = 0; i < rainCount; i++) {
            const i3 = i * 3;
            // Distribute randomly above the scene
            rainPositions[i3] = (Math.random() - 0.5) * 200;
            rainPositions[i3 + 1] = Math.random() * 100 + 50; // Above the scene
            rainPositions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random sizes for varied rain
            rainSizes[i] = 0.1 + Math.random() * 0.3;
        }
        
        // Set geometry attributes
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        rainGeometry.setAttribute('size', new THREE.BufferAttribute(rainSizes, 1));
        
        // Create rain material
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x9999AA,
            size: 0.8,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });
        
        // Create rain system
        this.rainSystem = new THREE.Points(rainGeometry, rainMaterial);
        this.rainSystem.name = 'rain-system';
        this.rainSystem.visible = false;
        this.group.add(this.rainSystem);
        
        // Create lightning
        this.lightningLight = new THREE.PointLight(0xFFFFFF, 0, 500);
        this.lightningLight.position.set(0, 100, 0);
        this.group.add(this.lightningLight);
        
        // Store lightning state
        this.lightningState = {
            active: false,
            intensity: 0,
            decay: 0.1,
            nextStrike: 0
        };
    }
    
    // Update weather based on emotional state
    updateWeather(delta) {
        if (!this.weatherState) return;
        
        // Determine target weather based on emotional state
        let targetWeather = 'clear';
        let targetIntensity = 0;
        
        if (this.emotionalState.sadness > 0.6) {
            // Sadness creates rain
            targetWeather = 'rain';
            targetIntensity = (this.emotionalState.sadness - 0.6) * 2.5; // 0-1 scale
        }
        
        if (this.emotionalState.anger > 0.7) {
            // Anger creates storms
            targetWeather = 'storm';
            targetIntensity = (this.emotionalState.anger - 0.7) * 3.3; // 0-1 scale
        }
        
        // Check if we need to change weather
        if (targetWeather !== this.weatherState.type) {
            console.log(`Weather changing from ${this.weatherState.type} to ${targetWeather}`);
            this.weatherState.type = targetWeather;
            
            // Set transition time (3 seconds)
            this.weatherState.transitionTime = 3000;
            this.weatherState.lastUpdate = Date.now();
        }
        
        // Calculate current intensity based on transition
        const now = Date.now();
        const elapsed = now - this.weatherState.lastUpdate;
        
        if (this.weatherState.transitionTime > 0) {
            const progress = Math.min(1, elapsed / this.weatherState.transitionTime);
            this.weatherState.intensity = THREE.MathUtils.lerp(
                this.weatherState.intensity,
                targetIntensity,
                progress
            );
            
            if (progress >= 1) {
                this.weatherState.transitionTime = 0;
            }
        } else {
            // Gradual change when not in transition
            this.weatherState.intensity = THREE.MathUtils.lerp(
                this.weatherState.intensity,
                targetIntensity,
                delta * 0.5
            );
        }
        
        this.weatherState.lastUpdate = now;
        
        // Apply weather effects
        this.applyWeatherEffects(delta);
    }
    
    // Apply current weather effects to the scene
    applyWeatherEffects(delta) {
        const intensity = this.weatherState.intensity;
        
        // Handle rain
        if (this.weatherState.type === 'rain' || this.weatherState.type === 'storm') {
            // Make rain visible
            this.rainSystem.visible = true;
            this.rainSystem.material.opacity = intensity * 0.7;
            
            // Update rain drop positions
            const positions = this.rainSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Move rain downward
                positions[i + 1] -= (30 + Math.random() * 20) * delta * intensity;
                
                // If raindrop is below ground, reset to top
                if (positions[i + 1] < 0) {
                    positions[i] = (Math.random() - 0.5) * 200;
                    positions[i + 1] = Math.random() * 100 + 50;
                    positions[i + 2] = (Math.random() - 0.5) * 200;
                }
            }
            
            // Update geometry
            this.rainSystem.geometry.attributes.position.needsUpdate = true;
            
            // Adjust fog for rain
            if (this.scene.fog) {
                // Make fog denser in rain
                const baseDensity = this.scene.fog.density;
                this.scene.fog.density = baseDensity * (1 + intensity * 0.5);
            }
        } else {
            // No rain
            this.rainSystem.visible = false;
        }
        
        // Handle lightning in storms
        if (this.weatherState.type === 'storm' && intensity > 0.3) {
            // Update current lightning
            if (this.lightningState.active) {
                // Lightning is active, fade it out
                this.lightningState.intensity -= this.lightningState.decay;
                if (this.lightningState.intensity <= 0) {
                    this.lightningState.active = false;
                    this.lightningState.intensity = 0;
                }
                
                // Apply lightning intensity
                this.lightningLight.intensity = this.lightningState.intensity;
            } else {
                // Check for new lightning strike
                if (this.lightningState.nextStrike <= 0) {
                    // Random chance based on storm intensity
                    if (Math.random() < intensity * 0.02) {
                        // Lightning strike!
                        this.createLightningStrike();
                    }
                    
                    // Set next check time
                    this.lightningState.nextStrike = 0.1; // Check every 0.1 seconds
                } else {
                    this.lightningState.nextStrike -= delta;
                }
            }
        } else {
            // No lightning in clear weather
            this.lightningLight.intensity = 0;
            this.lightningState.active = false;
        }
    }
    
    // Create a lightning strike
    createLightningStrike() {
        // Set lightning position randomly in the scene
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        
        this.lightningLight.position.set(
            Math.cos(angle) * distance,
            80 + Math.random() * 50,
            Math.sin(angle) * distance
        );
        
        // Set lightning intensity
        this.lightningState.active = true;
        this.lightningState.intensity = 2 + Math.random() * 3;
        this.lightningState.decay = 0.1 + Math.random() * 0.2;
        
        // Update light
        this.lightningLight.intensity = this.lightningState.intensity;
        
        // Add thunder sound effect in the future
        console.log('Lightning strike!');
    }
    
    // Add update method
    update(delta) {
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
        
        // Update atmosphere
        if (typeof this.updateAtmosphere === 'function') {
            this.updateAtmosphere(delta);
        }
        
        // Update weather
        if (typeof this.updateWeather === 'function') {
            this.updateWeather(delta);
        }
        
        // Update interaction effects
        if (typeof this.updateInteractionEffects === 'function') {
            this.updateInteractionEffects(delta);
        }
    }
    
    // Create interactive elements for territories
    createInteractiveElements() {
        console.log('Creating interactive elements for Circuit 2');
        
        // Add interactive elements to each territory
        for (let i = 0; i < this.factions.length; i++) {
            const faction = this.factions[i];
            
            // Create an interactive totem at the center of each territory
            const totemGeometry = new THREE.CylinderGeometry(0.5, 1, 4, 8);
            const totemMaterial = new THREE.MeshStandardMaterial({
                color: faction.color,
                emissive: faction.color,
                emissiveIntensity: 0.3,
                roughness: 0.3,
                metalness: 0.7
            });
            
            const totem = new THREE.Mesh(totemGeometry, totemMaterial);
            
            // Position at territory center
            const territory = faction.territory;
            totem.position.copy(territory.position);
            totem.position.y = 2; // Half height above ground
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: faction.color,
                transparent: true,
                opacity: 0.5
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.y = 3; // Top of totem
            totem.add(glow);
            
            // Add metadata for interactions
            totem.userData = {
                type: 'interactive',
                factionId: i,
                name: `Faction ${i} Totem`,
                interactable: true
            };
            
            // Add to scene
            totem.name = `interactive-totem-${i}`;
            this.group.add(totem);
            this.objects.push(totem);
            
            // Store in faction
            if (!faction.interactiveElements) {
                faction.interactiveElements = [];
            }
            faction.interactiveElements.push(totem);
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
        
        // Create atmospheric effects
        this.createAtmosphericEffects();
        
        // Create weather effects
        this.createWeatherEffects();
        
        // Create interactive elements
        this.createInteractiveElements();
        
        this.isInitialized = true;
        console.log(`Initialized ${this.name}`);
    }
}
