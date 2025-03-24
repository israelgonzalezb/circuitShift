// Circuit 3: Symbolic - Realm of language, symbols, and conceptual thinking
class Circuit3Symbolic {
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
        this.group.name = 'circuit3-group';
        this.scene.add(this.group);
        
        // Circuit state
        this.isInitialized = false;
        
        // Circuit properties
        this.name = 'Circuit 3: Symbolic';
        this.description = 'Realm of language, symbols, and conceptual thinking';
        this.circuitNumber = 3;
        
        // Circuit-specific colors
        this.primaryColor = new THREE.Color(0x4B0082); // Indigo
        this.secondaryColor = new THREE.Color(0xFFFFFF); // White
        this.accentColor = new THREE.Color(0xFFA500); // Orange
        
        // Symbol properties
        this.symbolScale = 1;
        this.symbolRotationSpeed = 0.5;
        this.symbolCount = 20;
        this.textFragments = [
            "KNOWLEDGE", "LANGUAGE", "SYMBOL", "LOGIC", "REASON",
            "CONCEPT", "THOUGHT", "IDEA", "WORD", "MEANING"
        ];
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Create the symbolic environment
        this.createEnvironment();
        
        // Create floating symbols
        this.createSymbols();
        
        // Create text fragments
        this.createTextFragments();
        
        // Create interactive concept nodes
        this.createConceptNodes();
        
        // Create special lighting for this circuit
        this.createLighting();
        
        this.isInitialized = true;
        console.log(`Initialized ${this.name}`);
    }
    
    createEnvironment() {
        // Create a dark environment with a grid floor representing structure and order
        
        // Grid floor
        const gridSize = 100;
        const gridDivisions = 50;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, this.accentColor, this.secondaryColor);
        this.group.add(gridHelper);
        
        // Create a dome/sky
        const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.group.add(sky);
        
        // Add fog for atmospheric effect
        this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
    }
    
    createSymbols() {
        // Create various 3D symbols representing different concepts
        const symbols = [
            { shape: 'cube', meaning: 'structure' },
            { shape: 'sphere', meaning: 'wholeness' },
            { shape: 'tetrahedron', meaning: 'stability' },
            { shape: 'torus', meaning: 'cycle' },
            { shape: 'octahedron', meaning: 'expansion' }
        ];
        
        // Create symbol instances
        for (let i = 0; i < this.symbolCount; i++) {
            const symbolType = symbols[Math.floor(Math.random() * symbols.length)];
            let geometry;
            
            // Create the appropriate geometry
            switch(symbolType.shape) {
                case 'cube':
                    geometry = new THREE.BoxGeometry(2, 2, 2);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(1, 16, 16);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(1.5);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(1, 0.4, 16, 32);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(1.5);
                    break;
            }
            
            // Create material with wireframe for symbolic effect
            const material = new THREE.MeshStandardMaterial({
                color: this.primaryColor,
                emissive: this.primaryColor,
                emissiveIntensity: 0.5,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            // Create the symbol mesh
            const symbol = new THREE.Mesh(geometry, material);
            
            // Position randomly in space
            symbol.position.set(
                (Math.random() - 0.5) * 50,
                5 + Math.random() * 20,
                (Math.random() - 0.5) * 50
            );
            
            // Set random rotation
            symbol.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            
            // Add metadata
            symbol.userData = {
                type: 'symbol',
                meaning: symbolType.meaning,
                isInteractive: true,
                // Add rotation speeds for animation
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };
            
            // Add to group and objects array
            this.group.add(symbol);
            this.objects.push(symbol);
        }
    }
    
    createTextFragments() {
        // We'll simulate text with special particle effects
        // In a real implementation, use texture-based sprites or TextGeometry
        
        for (let i = 0; i < this.textFragments.length; i++) {
            const text = this.textFragments[i];
            
            // Create a points system to represent text
            const particleCount = 100;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            
            // Arrange particles in a flat rectangle to mimic text
            const textWidth = text.length * 0.5;
            const textHeight = 1;
            
            for (let j = 0; j < particleCount; j++) {
                const x = (Math.random() - 0.5) * textWidth;
                const y = (Math.random() - 0.5) * textHeight;
                const z = (Math.random() - 0.1) * 0.2;
                
                particlePositions[j * 3] = x;
                particlePositions[j * 3 + 1] = y;
                particlePositions[j * 3 + 2] = z;
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                color: this.secondaryColor,
                size: 0.05,
                transparent: true,
                opacity: 0.8
            });
            
            const textParticles = new THREE.Points(particleGeometry, particleMaterial);
            
            // Position the text in the environment
            textParticles.position.set(
                (Math.random() - 0.5) * 40,
                10 + Math.random() * 15,
                (Math.random() - 0.5) * 40
            );
            
            // Add metadata
            textParticles.userData = {
                type: 'text',
                content: text,
                isInteractive: true
            };
            
            // Add to group and objects array
            this.group.add(textParticles);
            this.objects.push(textParticles);
        }
    }
    
    createConceptNodes() {
        // Create interactive nodes representing complex concepts
        // These will be connection points in a semantic network
        
        const concepts = [
            { name: 'Language', connections: ['Symbol', 'Meaning'] },
            { name: 'Symbol', connections: ['Concept', 'Knowledge'] },
            { name: 'Logic', connections: ['Reason', 'Knowledge'] },
            { name: 'Concept', connections: ['Idea', 'Thought'] },
            { name: 'Knowledge', connections: ['Meaning', 'Logic'] }
        ];
        
        // Create nodes
        concepts.forEach((concept, index) => {
            // Create node geometry
            const nodeGeometry = new THREE.SphereGeometry(1, 16, 16);
            const nodeMaterial = new THREE.MeshStandardMaterial({
                color: this.accentColor,
                emissive: this.accentColor,
                emissiveIntensity: 0.7
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Position in a circular pattern
            const angle = (index / concepts.length) * Math.PI * 2;
            const radius = 15;
            const height = 10;
            
            node.position.x = Math.cos(angle) * radius;
            node.position.y = height;
            node.position.z = Math.sin(angle) * radius;
            
            // Add metadata
            node.userData = {
                type: 'concept',
                name: concept.name,
                connections: concept.connections,
                isInteractive: true
            };
            
            // Add to group and objects array
            this.group.add(node);
            this.objects.push(node);
        });
        
        // Create connections between related concepts (visual lines)
        concepts.forEach((sourceConcept) => {
            // Find source node
            const sourceNode = this.objects.find(obj => 
                obj.userData.type === 'concept' && obj.userData.name === sourceConcept.name
            );
            
            if (!sourceNode) return;
            
            // For each connection
            sourceConcept.connections.forEach(targetName => {
                // Find target node
                const targetNode = this.objects.find(obj => 
                    obj.userData.type === 'concept' && obj.userData.name === targetName
                );
                
                if (!targetNode) return;
                
                // Create a line connecting them
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: this.secondaryColor,
                    transparent: true,
                    opacity: 0.4
                });
                
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    sourceNode.position,
                    targetNode.position
                ]);
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                
                // Add to group
                this.group.add(line);
            });
        });
    }
    
    createLighting() {
        // Add symbolic lighting - we'll use several point lights
        
        // Central bright light
        const centralLight = new THREE.PointLight(this.primaryColor, 1, 100);
        centralLight.position.set(0, 15, 0);
        this.group.add(centralLight);
        
        // Add a few smaller accent lights
        const accentColors = [
            new THREE.Color(0xFF4500), // Orange Red
            new THREE.Color(0x9400D3), // Dark Violet
            new THREE.Color(0x00BFFF)  // Deep Sky Blue
        ];
        
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const height = 12;
            const radius = 20;
            
            const light = new THREE.PointLight(accentColors[i], 0.8, 50);
            light.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            this.group.add(light);
            this.lights.push(light);
        }
    }
    
    update(delta) {
        // Animate symbols
        this.objects.forEach(object => {
            if (object.userData.type === 'symbol') {
                // Rotate the symbol based on its rotation speed
                object.rotation.x += object.userData.rotationSpeed.x;
                object.rotation.y += object.userData.rotationSpeed.y;
                object.rotation.z += object.userData.rotationSpeed.z;
                
                // Add subtle floating movement
                object.position.y += Math.sin(Date.now() * 0.001 + object.position.x) * 0.01;
            }
            
            if (object.userData.type === 'text') {
                // Make text shimmer by changing opacity
                if (object.material) {
                    object.material.opacity = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
                }
                
                // Slowly rotate text to face different angles
                object.rotation.y += 0.001;
            }
            
            if (object.userData.type === 'concept') {
                // Pulse the concept nodes
                const scale = 1 + 0.1 * Math.sin(Date.now() * 0.003 + object.position.x);
                object.scale.set(scale, scale, scale);
                
                // Also adjust emissive intensity
                if (object.material) {
                    object.material.emissiveIntensity = 0.5 + 0.3 * Math.sin(Date.now() * 0.002 + object.position.z);
                }
            }
        });
        
        // Animate lights
        this.lights.forEach((light, index) => {
            // Make lights pulse
            light.intensity = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 + index);
            
            // Slightly move lights
            const originalY = 12;
            light.position.y = originalY + Math.sin(Date.now() * 0.001 + index) * 2;
        });
    }
    
    handleInteraction(type, data) {
        console.log(`Symbolic Circuit: ${type} interaction at position ${data.position.x}, ${data.position.y}, ${data.position.z}`);
        
        if (type === 'interact') {
            console.log('Player interacting with Symbolic environment');
            
            // Find nearby objects
            const playerPos = data.position;
            const nearbyObjects = this.findNearbyObjects(playerPos, 3);
            
            if (nearbyObjects.length > 0) {
                console.log(`Found ${nearbyObjects.length} interactive objects nearby`);
                this.interactWithObject(nearbyObjects[0]);
            }
        }
    }
    
    findNearbyObjects(position, radius) {
        const nearbyObjects = [];
        
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
    
    interactWithObject(object) {
        if (!object.userData) return;
        
        switch(object.userData.type) {
            case 'symbol':
                console.log(`Interacting with symbol: ${object.userData.meaning}`);
                // Make the symbol glow brighter temporarily
                const originalEmissive = object.material.emissiveIntensity;
                object.material.emissiveIntensity = 2;
                setTimeout(() => {
                    object.material.emissiveIntensity = originalEmissive;
                }, 1000);
                break;
                
            case 'text':
                console.log(`Revealing text: ${object.userData.content}`);
                // Make the text more visible temporarily
                const originalOpacity = object.material.opacity;
                object.material.opacity = 1;
                object.material.size *= 2;
                setTimeout(() => {
                    object.material.opacity = originalOpacity;
                    object.material.size /= 2;
                }, 2000);
                break;
                
            case 'concept':
                console.log(`Exploring concept: ${object.userData.name}`);
                console.log(`Connected to: ${object.userData.connections.join(', ')}`);
                
                // Highlight this node and its connections
                const originalColor = object.material.color.clone();
                object.material.color.set(0xFFFFFF);
                
                // Find and highlight connected nodes
                object.userData.connections.forEach(connectionName => {
                    const connectedNode = this.objects.find(obj => 
                        obj.userData.type === 'concept' && obj.userData.name === connectionName
                    );
                    
                    if (connectedNode) {
                        const connectedOriginalColor = connectedNode.material.color.clone();
                        connectedNode.material.color.set(0xFFFFFF);
                        
                        setTimeout(() => {
                            connectedNode.material.color = connectedOriginalColor;
                        }, 2000);
                    }
                });
                
                setTimeout(() => {
                    object.material.color = originalColor;
                }, 2000);
                break;
        }
    }
} 