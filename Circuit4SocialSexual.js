// Circuit 4: Social-Sexual - The social and sexual roles circuit
// import { BaseCircuit } from './BaseCircuit.js';

class Circuit4SocialSexual {
    constructor(scene, camera) {
        // Scene and camera references
        this.scene = scene;
        this.camera = camera;

        // Circuit elements
        this.objects = [];
        this.lights = [];
        this.particles = [];
        this.dataPoints = []; // For moving data

        // Circuit-specific group
        this.group = new THREE.Group();
        this.group.name = 'circuit4-group';
        this.scene.add(this.group);

        // Circuit state
        this.isInitialized = false;

        // Circuit properties
        this.name = 'Circuit 4: Social-Sexual';
        this.description = 'The social and sexual roles circuit';
        this.circuitNumber = 4;

        // Colors
        this.primaryColor = new THREE.Color(0x00FFFF); // Cyan
        this.secondaryColor = new THREE.Color(0x00008B); // Dark Blue
        this.accentColor = new THREE.Color(0xFF00FF); // Magenta

        // Data stream properties
        this.dataStreamCount = 5;
        this.dataStreamLength = 50;
        this.dataStreamSpeed = 0.5;

        // Neural network properties
        this.nodeCount = 20;
        this.connectionCount = 30;
        this.nodeRadius = 1;
        this.connectionRadius = 0.1;
        this.nodeSpacing = 10;

        // Player interface
        this.interface = null;
        this.connectivity = 0; // Player's connection strength
        this.targetConnectivity = 0.5; // Target for mini-game
        this.connectivityInstructions = null;
    }

    init() {
        if (this.isInitialized) return;

        try {
            console.log("Initializing Circuit 4: Social-Sexual");

            // Create the cybernetic environment
            this.createEnvironment();
            console.log("Environment created");

            // Create data streams
            this.createDataStreams();
            console.log("Data streams created");

            // Create neural network visualization
            this.createNeuralNetwork();
            console.log("Neural network created");

            // Create player interface (glowing sphere)
            this.createPlayerInterface();
            console.log("Player interface created");

            // Create special lighting for this circuit
            this.createLighting();
            console.log("Lighting created");
            
            // Create connectivity instructions
            this.createConnectivityInstructions();
            console.log("Instructions created");

            this.isInitialized = true;
            console.log(`Initialized ${this.name}`);
        } catch (error) {
            console.error("Error initializing Circuit 4:", error);
            // Try to recover from initialization error
            this.isInitialized = true; // Mark as initialized to prevent further attempts
            
            // Create a minimal environment if initialization failed
            this.createMinimalEnvironment();
        }
    }

    createMinimalEnvironment() {
        // Clean up any partial initialization
        while (this.group.children.length > 0) {
            const child = this.group.children[0];
            this.group.remove(child);
        }
        
        // Create a simple grid for minimal environment
        const gridHelper = new THREE.GridHelper(100, 20, this.primaryColor, this.secondaryColor);
        this.group.add(gridHelper);
        
        // Create a minimal interface
        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: this.primaryColor,
            wireframe: true
        });
        this.interface = new THREE.Mesh(geometry, material);
        this.interface.position.set(0, 5, 0);
        this.group.add(this.interface);
        
        // Add a simple light
        const light = new THREE.PointLight(this.primaryColor, 1, 100);
        light.position.set(0, 10, 0);
        this.group.add(light);
        this.lights.push(light);
        
        console.log("Created minimal fallback environment for Circuit 4");
    }

    createEnvironment() {
        // Create a dark, abstract environment with gridlines for a digital feel

        // Grid
        const gridSize = 100;
        const gridDivisions = 50;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, this.primaryColor, this.secondaryColor);
        this.group.add(gridHelper);

        // Create a dark "sky"
        const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.9
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.group.add(sky);
    }

    createDataStreams() {
        // Create flowing data streams using lines
        const dataStreamMaterial = new THREE.LineBasicMaterial({
            color: this.primaryColor,
            linewidth: 2, // Use linewidth for thicker lines
            transparent: true,
            opacity: 0.8
        });
    
        // Create reusable geometry for data points
        const dataPointGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const dataPointMaterial = new THREE.MeshBasicMaterial({
            color: this.primaryColor,
            transparent: true,
            opacity: 0.9
        });
    
        for (let i = 0; i < this.dataStreamCount; i++) {
            // Create points for the stream's path
            const points = [];
            for (let j = 0; j < this.dataStreamLength; j++) {
                const x = (Math.random() - 0.5) * 50;
                const y = (Math.random() - 0.5) * 20 + 5; // Keep above ground
                const z = (Math.random() - 0.5) * 50;
    
                points.push(new THREE.Vector3(x, y, z));
            }
    
            // Create a curve from the points
            const curve = new THREE.CatmullRomCurve3(points);
    
            // Create geometry from the curve
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(this.dataStreamLength * 2));
    
            // Create line
            const dataStream = new THREE.Line(geometry, dataStreamMaterial);
    
            dataStream.userData = {
                type: 'dataStream',
                curve: curve,
                speed: this.dataStreamSpeed + Math.random() * 0.5, // Vary speed
                offset: Math.random() * 100 // Randomize start point
            };
    
            this.group.add(dataStream);
            this.objects.push(dataStream);
    
            // Add moving data points along the stream
            for (let k = 0; k < 5; k++) { // Add a few data points
                const dataPoint = new THREE.Mesh(dataPointGeometry, dataPointMaterial);
                dataPoint.userData = {
                    type: 'dataPoint',
                    stream: dataStream,
                    positionOnCurve: Math.random() // Initial position
                };
    
                this.group.add(dataPoint);
                this.dataPoints.push(dataPoint);
            }
        }
    }

    createNeuralNetwork() {
        // Create nodes
        for (let i = 0; i < this.nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(this.nodeRadius, 16, 16);
            const nodeMaterial = new THREE.MeshStandardMaterial({
                color: this.secondaryColor,
                emissive: this.secondaryColor,
                emissiveIntensity: 0.5
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

            // Position nodes in a 3D grid pattern
            const x = (i % 5) * this.nodeSpacing - (2 * this.nodeSpacing);
            const y = Math.floor(i / 5) % 4 * this.nodeSpacing - (1.5 * this.nodeSpacing) + 5;
            const z = Math.floor(i / 20) * this.nodeSpacing - (0.5 * this.nodeSpacing);

            node.position.set(x, y, z);
            node.userData = { type: 'node', connections: [] };

            this.group.add(node);
            this.objects.push(node);
        }

        // Create connections
        for (let i = 0; i < this.connectionCount; i++) {
            const sourceIndex = Math.floor(Math.random() * this.nodeCount);
            let targetIndex = Math.floor(Math.random() * this.nodeCount);

            // Ensure different nodes
            while (targetIndex === sourceIndex) {
                targetIndex = Math.floor(Math.random() * this.nodeCount);
            }

            const sourceNode = this.objects[sourceIndex];
            const targetNode = this.objects[targetIndex];

            // Add connection information
            sourceNode.userData.connections.push(targetNode);
            targetNode.userData.connections.push(sourceNode);

            // Create connection line
            const connectionGeometry = new THREE.CylinderGeometry(this.connectionRadius, this.connectionRadius, 1, 8);
            const connectionMaterial = new THREE.MeshStandardMaterial({
                color: this.accentColor,
                emissive: this.accentColor,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.5
            });
            const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);

            // Position and orient the connection
            const start = sourceNode.position;
            const end = targetNode.position;
            connection.position.copy(start).add(end).multiplyScalar(0.5);
            connection.lookAt(end);
            connection.scale.y = start.distanceTo(end);

            connection.userData = { type: 'connection' };

            this.group.add(connection);
            this.objects.push(connection);
        }
    }

    createPlayerInterface() {
        // Create a glowing sphere representing the player's neural interface
        const interfaceGeometry = new THREE.SphereGeometry(2, 32, 32);
        const interfaceMaterial = new THREE.MeshStandardMaterial({
            color: this.primaryColor,
            emissive: this.primaryColor,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7,
            wireframe: true // Add wireframe for a techy look
        });
        this.interface = new THREE.Mesh(interfaceGeometry, interfaceMaterial);
        this.interface.position.set(0, 5, 0); // Start above the grid

        this.group.add(this.interface);
    }
    
    createConnectivityInstructions() {
        // Create a canvas for the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Set up text
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        context.strokeStyle = this.primaryColor.getStyle();
        context.lineWidth = 4;
        context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Add title text
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.fillStyle = this.primaryColor.getStyle();
        context.fillText('CIRCUIT 4', canvas.width / 2, 60);
        
        // Add instructions
        context.font = '20px Arial';
        context.fillStyle = '#FFFFFF';
        context.fillText('Establish Neural-Social Connections', canvas.width / 2, 100);
        context.font = '16px Arial';
        context.fillText('Move near data streams to increase connectivity', canvas.width / 2, 140);
        context.fillText('Press E to interact with nodes', canvas.width / 2, 170);
        context.fillText('Reach 50% connectivity to proceed', canvas.width / 2, 200);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create material with the texture
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        // Create plane geometry for the instructions
        const geometry = new THREE.PlaneGeometry(10, 5);
        
        // Create mesh with geometry and material
        this.connectivityInstructions = new THREE.Mesh(geometry, material);
        
        // Position the instructions in front of the player
        this.connectivityInstructions.position.set(0, 10, -10);
        
        // Add to group
        this.group.add(this.connectivityInstructions);
    }

    createLighting() {
        // Add subtle ambient light
        const ambientLight = new THREE.AmbientLight(this.secondaryColor, 0.2);
        this.group.add(ambientLight);

        // Add a few point lights for highlights
        const pointLight1 = new THREE.PointLight(this.primaryColor, 0.8, 50);
        pointLight1.position.set(10, 20, 10);
        this.group.add(pointLight1);
        this.lights.push(pointLight1);

        const pointLight2 = new THREE.PointLight(this.accentColor, 0.8, 50);
        pointLight2.position.set(-10, 20, -10);
        this.group.add(pointLight2);
        this.lights.push(pointLight2);
    }
    

    update(delta) {
        try {
            // Move data along streams
            this.objects.forEach(object => {
                if (object && object.userData && object.userData.type === 'dataStream' && object.userData.curve) {
                    // Animate the line by adjusting the offset
                    object.userData.offset += delta * object.userData.speed;
                    
                    try {
                        // Get points from the curve with error handling
                        const points = object.userData.curve.getPoints(this.dataStreamLength * 2);
                        if (points && points.length > 0) {
                            object.geometry.setFromPoints(points);
                        }
                    } catch (error) {
                        console.error("Error updating data stream points:", error);
                    }
                }
            });

            // Position data points with safety checks
            if (this.dataPoints && this.dataPoints.length > 0) {
                this.dataPoints.forEach(dataPoint => {
                    if (!dataPoint || !dataPoint.userData || !dataPoint.userData.stream || 
                        !dataPoint.userData.stream.userData || !dataPoint.userData.stream.userData.curve) {
                        return; // Skip invalid data points
                    }
                    
                    try {
                        const stream = dataPoint.userData.stream;
                        dataPoint.userData.positionOnCurve += delta * stream.userData.speed * 0.1; // Adjust speed

                        // Loop back to start
                        if (dataPoint.userData.positionOnCurve > 1) {
                            dataPoint.userData.positionOnCurve -= 1;
                        }

                        const point = stream.userData.curve.getPoint(dataPoint.userData.positionOnCurve);
                        if (point) {
                            dataPoint.position.copy(point);
                            
                            if (dataPoint.material) {
                                dataPoint.material.opacity = 0.5 + Math.sin(Date.now() * 0.004) * 0.4;
                            }
                        }
                    } catch (error) {
                        console.error("Error updating data point:", error);
                    }
                });
            }

            // Animate neural network with safety checks
            this.objects.forEach(object => {
                if (!object || !object.userData) return;
                
                try {
                    if (object.userData.type === 'node') {
                        // Pulse nodes
                        const scale = 1 + 0.1 * Math.sin(Date.now() * 0.003 + object.position.x);
                        object.scale.set(scale, scale, scale);
                        
                        if (object.material) {
                            object.material.emissiveIntensity = 0.5 + 0.2 * Math.sin(Date.now() * 0.002 + object.position.z);
                        }
                    }

                    if (object.userData.type === 'connection' && object.material) {
                        // Pulse connections
                        object.material.emissiveIntensity = 0.2 + 0.1 * Math.sin(Date.now() * 0.005 + object.position.y);
                    }
                } catch (error) {
                    console.error("Error animating neural network:", error);
                }
            });

            // Update player interface with safety checks
            if (this.interface && this.interface.material) {
                try {
                    // Pulse
                    const scale = 1 + 0.1 * Math.sin(Date.now() * 0.004);
                    this.interface.scale.set(scale, scale, scale);
                    this.interface.material.emissiveIntensity = 0.8 + 0.2 * Math.sin(Date.now() * 0.003);

                    // Match position to camera (simplified)
                    if (this.camera) {
                        const cameraPos = this.camera.position.clone();
                        cameraPos.y = 5; // Keep interface at fixed height
                        this.interface.position.copy(cameraPos);
                    }
                } catch (error) {
                    console.error("Error updating player interface:", error);
                }
            }
            
            // Move instructions to face camera
            if (this.connectivityInstructions && this.camera) {
                try {
                    this.connectivityInstructions.lookAt(this.camera.position);
                } catch (error) {
                    console.error("Error updating connectivity instructions:", error);
                }
            }

            // Update connectivity (simplified)
            this.updateConnectivity();
        } catch (error) {
            console.error("Critical error in Circuit 4 update:", error);
        }
    }

    updateConnectivity() {
        try {
            // Safety check for interface
            if (!this.interface) return;
            
            // Increase connectivity when near data streams, decrease over time
            let proximityBonus = 0;
            
            if (this.dataPoints && this.dataPoints.length > 0) {
                this.dataPoints.forEach(dataPoint => {
                    if (!dataPoint) return;
                    
                    const distance = this.interface.position.distanceTo(dataPoint.position);
                    if (distance < 5) {
                        proximityBonus += 0.01 * (5 - distance);
                    }
                });
            }

            this.connectivity += proximityBonus;
            this.connectivity -= 0.005; // Decay over time
            this.connectivity = THREE.MathUtils.clamp(this.connectivity, 0, 1);

            // Check if target connectivity reached
            if (this.connectivity >= this.targetConnectivity) {
                // Trigger success state (e.g., visual effect, change in environment)
            }
        } catch (error) {
            console.error("Error in updateConnectivity:", error);
        }
    }
    
    handleInteraction(type, data) {
        console.log(`Social-Sexual Circuit: ${type} interaction at position ${data.position.x}, ${data.position.y}, ${data.position.z}`);
    
        // Handle different types of interactions.
        // For example, interacting with data streams to increase connectivity
        if (type === 'interact') {
            console.log('Player interacting with Social-Sexual environment');
    
            // Example: Find the nearest data stream
            let nearestStream = null;
            let minDistance = Infinity;
    
            // Assuming you have a list of data streams
            for (const object of this.objects) {
                if (object.userData.type === 'dataStream') {
                    const distance = data.position.distanceTo(object.position);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestStream = object;
                    }
                }
            }
    
            if (nearestStream && minDistance < 5) {
                // Increase connectivity or trigger some effect when interacting with a data stream
                console.log('Interacting with data stream');
                this.connectivity += 0.1;  // Simple example: Increase connectivity
            }
    
            // Cap the connectivity
            this.connectivity = Math.min(this.connectivity, 1);
        }
    }
}