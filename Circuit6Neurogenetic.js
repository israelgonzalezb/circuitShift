// Circuit 6: Neurogenetic - Future Evolution (Test Version)

class Circuit6Neurogenetic {
    constructor(scene, camera) {
        // Scene and camera references
        this.scene = scene;
        this.camera = camera;
        
        // Circuit elements
        this.objects = [];
        this.lights = [];
        this.particles = [];
        this.dnaStrands = [];
        
        // Circuit-specific group to hold all elements
        this.group = new THREE.Group();
        this.group.name = 'circuit6-group';
        this.scene.add(this.group);
        
        // Circuit state
        this.isInitialized = false;
        
        // Circuit properties
        this.name = 'Circuit 6: Neurogenetic';
        this.description = 'Future Evolution and the Expansion of Consciousness';
        this.circuitNumber = 6;
        
        // Circuit colors
        this.primaryColor = new THREE.Color(0x00BFFF);   // Deep Sky Blue
        this.secondaryColor = new THREE.Color(0x32CD32); // Lime Green
        this.accentColor = new THREE.Color(0xC0C0C0);    // Silver
        this.goldColor = new THREE.Color(0xFFD700);      // Gold
        
        // DNA Strand Parameters
        this.numDNAStrands = 3;
        this.dnaStrandLength = 50;
        this.dnaRotationSpeed = 0.05;
        
        // Evolution Choice Parameters
        this.numEvolutionChoices = 3;
        this.evolutionChoiceRadius = 2;
        
        // Information Stream Parameters
        this.numInfoStreams = 5;
        this.infoStreamLength = 30;
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log("Initializing Circuit 6: Neurogenetic");
        
        // Create environment
        this.createEnvironment();
        
        // Create DNA strands
        this.createDNAStrands();
        
        // Create evolution choices
        this.createEvolutionChoices();
        
        // Create information streams
        this.createInformationStreams();
        
        // Create particles
        this.createParticles();
        
        // Add lights
        this.createLighting();
        
        // Set camera position
        if (this.camera) {
            this.camera.position.set(0, 20, 50);
            this.camera.lookAt(0, 10, 0);
        }
        
        this.isInitialized = true;
    }
    
    createEnvironment() {
        // Futuristic, abstract environment
        const skyGeometry = new THREE.SphereGeometry(200, 32, 16);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x111122, // Dark, slightly bluish
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.9
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.group.add(sky);

        // Add a grid for reference
        const gridHelper = new THREE.GridHelper(100, 50, this.accentColor, 0x444444);
        this.group.add(gridHelper);

        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x111122, 0.008);
    }
    
    createDNAStrands() {
        // Define strand colors that complement the nucleotide colors
        const strandColors = [
            new THREE.Color(0x00BFFF),   // Light Blue
            new THREE.Color(0x32CD32),   // Lime Green
            new THREE.Color(0xFFD700)    // Gold
        ];

        // Create nucleotide textures
        const nucleotides = ['T', 'G', 'C', 'A'];
        const nucleotideColors = ['#FF0000', '#FFFF00', '#0000FF', '#00FF00']; // Red, Yellow, Blue, Green
        const nucleotideTextures = nucleotides.map((n, index) => {
            // Create a new canvas for each nucleotide
            const nucleotideCanvas = document.createElement('canvas');
            const nucleotideContext = nucleotideCanvas.getContext('2d');
            nucleotideCanvas.width = 64;
            nucleotideCanvas.height = 64;
            
            nucleotideContext.fillStyle = 'rgba(0, 0, 0, 0)';
            nucleotideContext.fillRect(0, 0, nucleotideCanvas.width, nucleotideCanvas.height);
            nucleotideContext.fillStyle = nucleotideColors[index];
            nucleotideContext.font = 'bold 48px Arial';
            nucleotideContext.textAlign = 'center';
            nucleotideContext.textBaseline = 'middle';
            nucleotideContext.fillText(n, nucleotideCanvas.width/2, nucleotideCanvas.height/2);
            return new THREE.CanvasTexture(nucleotideCanvas);
        });

        for (let i = 0; i < this.numDNAStrands; i++) {
            const strandMaterial = new THREE.MeshStandardMaterial({
                color: strandColors[i % strandColors.length],
                emissive: strandColors[i % strandColors.length],
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
            });

            const points = [];
            const radius = 5 + Math.random() * 2; // Vary radius
            const height = this.dnaStrandLength;
            const twists = 3 + Math.floor(Math.random() * 3); // Vary twists

            // Create a helix
            for (let j = 0; j < this.dnaStrandLength * 2; j++) {
                const t = j / (this.dnaStrandLength * 2);
                const angle = t * Math.PI * 2 * twists;
                const x = Math.cos(angle) * radius;
                const y = t * height - height / 2; // Center vertically
                const z = Math.sin(angle) * radius;
                points.push(new THREE.Vector3(x, y, z));
            }
            const curve = new THREE.CatmullRomCurve3(points);

            // Create TWO tubes, offset slightly, for the double helix
            const geometry1 = new THREE.TubeGeometry(curve, this.dnaStrandLength * 4, 0.5, 8, false);
            const strand1 = new THREE.Mesh(geometry1, strandMaterial);

            // Offset second strand
            const points2 = [];
            for (let j = 0; j < this.dnaStrandLength * 2; j++) {
                const t = j / (this.dnaStrandLength * 2);
                const angle = t * Math.PI * 2 * twists + Math.PI; // + PI for opposite side
                const x = Math.cos(angle) * radius;
                const y = t * height - height / 2;
                const z = Math.sin(angle) * radius;
                points2.push(new THREE.Vector3(x, y, z));
            }
            const curve2 = new THREE.CatmullRomCurve3(points2);
            const geometry2 = new THREE.TubeGeometry(curve2, this.dnaStrandLength * 4, 0.5, 8, false);
            const strand2 = new THREE.Mesh(geometry2, strandMaterial);

            // Add nucleotide labels
            const nucleotideSpacing = height / (this.dnaStrandLength / 4); // Reduced frequency of labels
            for (let j = 0; j < this.dnaStrandLength / 4; j++) { // Reduced number of labels
                // First strand nucleotides
                const t = j / (this.dnaStrandLength / 4);
                const angle = t * Math.PI * 2 * twists;
                const x = Math.cos(angle) * (radius + 2); // Increased distance from helix
                const y = t * height - height / 2;
                const z = Math.sin(angle) * (radius + 2);
                
                const nucleotideIndex = Math.floor(Math.random() * nucleotides.length);
                const nucleotideTexture = nucleotideTextures[nucleotideIndex];
                const nucleotideMaterial = new THREE.MeshBasicMaterial({
                    map: nucleotideTexture,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                
                const nucleotideGeometry = new THREE.PlaneGeometry(1.5, 1.5); // Increased size
                const nucleotide = new THREE.Mesh(nucleotideGeometry, nucleotideMaterial);
                nucleotide.position.set(x, y, z);
                nucleotide.lookAt(new THREE.Vector3(0, y, 0));
                strand1.add(nucleotide);

                // Second strand nucleotides (complementary)
                const angle2 = t * Math.PI * 2 * twists + Math.PI;
                const x2 = Math.cos(angle2) * (radius + 2);
                const z2 = Math.sin(angle2) * (radius + 2);
                
                // Get complementary nucleotide
                const complementaryIndex = (nucleotideIndex + 2) % 4; // T->A, G->C
                const complementaryTexture = nucleotideTextures[complementaryIndex];
                const complementaryMaterial = new THREE.MeshBasicMaterial({
                    map: complementaryTexture,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                
                const complementaryNucleotide = new THREE.Mesh(nucleotideGeometry, complementaryMaterial);
                complementaryNucleotide.position.set(x2, y, z2);
                complementaryNucleotide.lookAt(new THREE.Vector3(0, y, 0));
                strand2.add(complementaryNucleotide);
            }

            // Group the two strands together
            const dnaGroup = new THREE.Group();
            dnaGroup.add(strand1);
            dnaGroup.add(strand2);
            dnaGroup.userData = { type: 'dnaStrand' };

            // Position strands randomly
            dnaGroup.position.set(
                (Math.random() - 0.5) * 50,
                0,
                (Math.random() - 0.5) * 50
            );
            dnaGroup.rotation.y = Math.random() * Math.PI * 2; // Random initial rotation

            this.group.add(dnaGroup);
            this.dnaStrands.push(dnaGroup);
            this.objects.push(dnaGroup);
        }
    }
    
    createEvolutionChoices() {
        for (let i = 0; i < this.numEvolutionChoices; i++) {
            const choiceGeometry = new THREE.SphereGeometry(this.evolutionChoiceRadius, 16, 16);
            const choiceMaterial = new THREE.MeshStandardMaterial({
                color: this.secondaryColor,
                emissive: this.secondaryColor,
                emissiveIntensity: 0.5,
            });

            const choice = new THREE.Mesh(choiceGeometry, choiceMaterial);

            const angle = (i / this.numEvolutionChoices) * Math.PI * 2;
            const radius = 25;
            const height = 10;

            choice.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            choice.userData = { type: 'evolutionChoice', choiceId: i };
            this.group.add(choice);
            this.objects.push(choice);
        }
    }
    
    createInformationStreams() {
        const streamMaterial = new THREE.LineBasicMaterial({
            color: this.accentColor,
            transparent: true,
            opacity: 0.6,
            linewidth: 1
        });

        for (let i = 0; i < this.numInfoStreams; i++) {
            const points = [];
            for (let j = 0; j < this.infoStreamLength; j++) {
                const x = (Math.random() - 0.5) * 60;
                const y = (Math.random() - 0.5) * 30 + 5;
                const z = (Math.random() - 0.5) * 60;
                points.push(new THREE.Vector3(x, y, z));
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(this.infoStreamLength * 2));

            const stream = new THREE.Line(geometry, streamMaterial);
            stream.userData = { 
                type: 'infoStream', 
                curve: curve, 
                speed: 0.02 + Math.random() * 0.03, 
                offset: Math.random() * 100 
            };
            this.group.add(stream);
            this.objects.push(stream);
        }
    }
    
    createParticles() {
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 80;
            particlePositions[i * 3 + 1] = Math.random() * 40;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: this.goldColor,
            size: 0.4,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.group.add(particles);
        this.particles.push(particles);
    }
    
    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x444466, 0.4);
        this.group.add(ambientLight);
        this.lights.push(ambientLight);

        // Directional light (like a "sun")
        const directionalLight = new THREE.DirectionalLight(0x88aaff, 0.7); // Bluish
        directionalLight.position.set(1, 1, 1); // From top-right
        this.group.add(directionalLight);
        this.lights.push(directionalLight);

        // Point lights for accents
        const pointLight1 = new THREE.PointLight(this.primaryColor, 0.6, 50);
        pointLight1.position.set(-10, 15, -10);
        this.group.add(pointLight1);
        this.lights.push(pointLight1);

        const pointLight2 = new THREE.PointLight(this.secondaryColor, 0.6, 50);
        pointLight2.position.set(10, 15, 10);
        this.group.add(pointLight2);
        this.lights.push(pointLight2);
    }
    
    update(delta) {
        // Animate DNA strands
        this.dnaStrands.forEach(strandGroup => {
            strandGroup.rotation.y += this.dnaRotationSpeed * delta;
        });
        
        // Animate information streams
        this.objects.forEach(object => {
            if (object.userData.type === 'infoStream') {
                object.userData.offset += delta * object.userData.speed;
                const points = object.userData.curve.getPoints(this.infoStreamLength * 2).map((point, index) => {
                    const t = index / (this.infoStreamLength * 2);
                    return new THREE.Vector3(
                        point.x + Math.sin(t * 10 + object.userData.offset) * 0.5,
                        point.y + Math.cos(t * 8 + object.userData.offset) * 0.3,
                        point.z + Math.sin(t * 6 + object.userData.offset) * 0.5
                    );
                });
                object.geometry.setFromPoints(points);
            }
            
            // Pulse evolution choice spheres
            if (object.userData.type === 'evolutionChoice') {
                const pulse = Math.sin(Date.now() * 0.001 + object.userData.choiceId) * 0.1 + 0.9;
                object.scale.set(pulse, pulse, pulse);
                
                // Also slightly rotate them
                object.rotation.y += 0.01 * delta;
                object.rotation.x += 0.005 * delta;
            }
        });
        
        // Animate particles
        this.particles.forEach(particles => {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin((i + Date.now() * 0.001) * 0.1) * 0.02;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0005;
        });
    }
    
    handleInteraction(type, data) {
        if (type === 'interact') {
            const nearestObject = this.findNearestObject(data.position);

            if (nearestObject && this.isWithinInteractionRange(nearestObject, data.position, 5)) {
                if (nearestObject.userData.type === 'evolutionChoice') {
                    console.log("Evolution Choice:", nearestObject.userData.choiceId);
                    // Trigger some effect based on the choice
                    this.handleEvolutionChoice(nearestObject.userData.choiceId);
                }
            }
        }
    }
    
    handleEvolutionChoice(choiceId) {
        // Implement effects based on the choice made
        switch (choiceId) {
            case 0:
                // Change the color of the DNA strands
                this.dnaStrands.forEach(strandGroup => {
                    strandGroup.children.forEach(strand => {
                        if (strand.material) {
                            strand.material.color.set(0xff0000); // Red
                            strand.material.emissive.set(0xff0000);
                        }
                    });
                });
                break;
            case 1:
                // Increase the speed of information streams
                this.objects.forEach(object => {
                    if (object.userData.type === 'infoStream') {
                        object.userData.speed *= 2; // Double the speed
                    }
                });
                break;
            case 2:
                // Add more particles
                this.createParticles();
                break;
        }
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