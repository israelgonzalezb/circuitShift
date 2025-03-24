// Circuit 5: Holistic-Intuitive - Integration of all circuits, intuition, and wholeness

class Circuit5HolisticIntuitive {
  constructor(scene, camera) {
    // Scene and camera references
    this.scene = scene;
    this.camera = camera;

    // Circuit elements
    this.objects = [];
    this.lights = [];
    this.particles = [];
    this.energyFlows = []; // Store energy flow objects
    this.nodes = []; // Store node objects

    // Circuit-specific group
    this.group = new THREE.Group();
    this.group.name = "circuit5-group";
    this.scene.add(this.group);

    // Circuit state
    this.isInitialized = false;

    // Circuit properties
    this.name = "Circuit 5: Holistic-Intuitive";
    this.description = "Integration of all circuits, intuition, and wholeness";
    this.circuitNumber = 5;

    // Colors
    this.primaryColor = new THREE.Color(0x87ceeb); // Sky Blue
    this.secondaryColor = new THREE.Color(0x98fb98); // Pale Green
    this.accentColor = new THREE.Color(0xda70d6); // Orchid

    // Energy flow parameters
    this.numEnergyFlows = 5;
    this.energyFlowLength = 100;
    this.energyFlowSpeed = 0.02;

    // Node parameters
    this.numNodes = 15;
    this.nodeRadius = 1;
    this.nodeConnectionChance = 0.3; // Chance of connecting to a previous node

    // Pattern parameters
    this.patterns = []; // We'll populate this in createPatterns()
    this.patternCompletionThreshold = 0.9; // 90% completion to trigger

    // Player resonance
    this.resonance = 0; // Initial resonance
    this.targetResonance = 0.8; // Resonance needed for ... something
    this.resonanceDecayRate = 0.005; // Resonance decreases over time
    this.resonanceIncreaseRate = 0.02; // Resonance increases with interaction

    // Audio
    this.listener = null;
    this.sound = null;
    this.ambientSoundPath = "sounds/ambient.mp3"; //  REPLACE with your actual path!
  }

  init() {
    if (this.isInitialized) return;

    console.log("Initializing Circuit 5: Holistic-Intuitive");

    try {
      // Create the environment
      this.createEnvironment();
      console.log("Environment created");

      // Create energy flows
      this.createEnergyFlows();
      console.log("Energy flows created");

      // Create nodes
      this.createNodes();
      console.log("Nodes created");

      // Create patterns
      this.createPatterns();
      console.log("Patterns created");

      // Create lighting
      this.createLighting();
      console.log("Lighting created");

      // Create echoes
      this.createEchoes();
      console.log("Echoes of the past created");

      // Try to initialize audio (but don't let it fail initialization)
      try {
        this.createAudio();
        console.log("Audio initialized");
      } catch (audioError) {
        console.warn(
          "Audio initialization failed, continuing without audio:",
          audioError
        );
      }

      // Set the camera to a good viewing position
      if (this.camera) {
        this.camera.position.set(0, 30, 60);
        this.camera.lookAt(0, 20, 0);
        console.log("Camera positioned for Circuit 5");
      }

      this.isInitialized = true;
      console.log(`Initialized ${this.name}`);
    } catch (error) {
      console.error("Error initializing Circuit 5:", error);
    }
  }

  createEnvironment() {
    // Create a large, open, slightly foggy sphere
    const skyGeometry = new THREE.SphereGeometry(200, 64, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x222233, // Dark, desaturated blue
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.95,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.group.add(sky);

    // Add subtle fog
    this.scene.fog = new THREE.FogExp2(0x222233, 0.005); // Adjust density as needed
  }

  createEnergyFlows() {
    const energyFlowMaterial = new THREE.MeshBasicMaterial({
      color: this.primaryColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < this.numEnergyFlows; i++) {
      const numPoints = this.energyFlowLength;
      const points = [];

      // Create more visually striking flows with interesting patterns
      const radius = 15 + Math.random() * 10;
      const height = 15 + Math.random() * 10;
      const loops = 1 + Math.floor(Math.random() * 3);

      // Create spiral or wave pattern
      for (let j = 0; j < numPoints; j++) {
        const t = j / numPoints;
        const angle = t * Math.PI * 2 * loops + (i * Math.PI) / this.numEnergyFlows;

        const x = Math.cos(angle) * radius * (1 + 0.3 * Math.sin(t * Math.PI * 4));
        const y = height + 10 * Math.sin(t * Math.PI * 2);
        const z = Math.sin(angle) * radius * (1 + 0.3 * Math.sin(t * Math.PI * 4));

        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      curve.closed = true; // Make the curve a loop

      const geometry = new THREE.TubeGeometry(
        curve,
        numPoints * 2,
        0.8,
        8,
        true
      );
      const energyFlow = new THREE.Mesh(geometry, energyFlowMaterial.clone());

      // Give each flow a slightly different hue
      energyFlow.material.color.offsetHSL(i * 0.1, 0, 0);

      energyFlow.userData = {
        type: "energyFlow",
        curve: curve,
        speed: this.energyFlowSpeed * (0.8 + Math.random() * 0.4), // Vary speed
        offset: Math.random() * 100, // Random starting point
        branchCount: 0, // Track how many times this flow has branched
        canBranch: true
      };

      this.group.add(energyFlow);
      this.energyFlows.push(energyFlow); // Store for updates
      this.objects.push(energyFlow);

      // Add glowing particles along the flow
      this.createFlowParticles(curve, i);
    }
  }

  createFlowParticles(curve, flowIndex) {
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    // Initialize positions and sizes
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const point = curve.getPointAt(t);

      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;

      particleSizes[i] = 0.5 + Math.random() * 1.5;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    // Create particle material with brighter colors
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(this.primaryColor).offsetHSL(
        flowIndex * 0.1,
        0.2,
        0.2
      ),
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = {
      type: "flowParticles",
      curve: curve,
      speed: 0.2 + Math.random() * 0.2,
      offset: Math.random(),
      particleCount: particleCount,
      flowIndex: flowIndex,
    };

    this.group.add(particles);
    this.particles.push(particles);
  }

  createNodes() {
    // Create more visible, larger nodes
    const nodeGeometry = new THREE.SphereGeometry(this.nodeRadius * 3, 16, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: this.secondaryColor,
      emissive: this.secondaryColor,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.4,
    });

    for (let i = 0; i < this.numNodes; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());

      // Give each node a slightly different hue
      node.material.color.offsetHSL(i * 0.1, 0, 0);
      node.material.emissive.offsetHSL(i * 0.1, 0, 0);

      // Position nodes in a more interesting pattern
      const angle = (i / this.numNodes) * Math.PI * 2;
      const radius = 25 + Math.random() * 20;
      const height = 15 + Math.sin(angle * 3) * 10;

      node.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      node.userData = {
        type: "node",
        connections: [],
        active: false,
        id: i,
        interactionCount: 0,
      };

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(
        this.nodeRadius * 5,
        16,
        16
      );
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: node.material.emissive.clone(),
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      node.add(glow);

      this.group.add(node);
      this.nodes.push(node);
      this.objects.push(node);

      // Create connections between nodes
      for (let j = 0; j < i; j++) {
        if (Math.random() < this.nodeConnectionChance) {
          const otherNode = this.nodes[j];
          this.createConnection(node, otherNode);
        }
      }
    }
  }

  createConnection(node1, node2) {
    // Create a more interesting, glowing connection
    const curve = new THREE.QuadraticBezierCurve3(
      node1.position,
      new THREE.Vector3(
        (node1.position.x + node2.position.x) / 2,
        Math.max(node1.position.y, node2.position.y) + 5 + Math.random() * 10,
        (node1.position.z + node2.position.z) / 2
      ),
      node2.position
    );

    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
      color: this.secondaryColor,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });

    const line = new THREE.Line(geometry, material);
    line.userData = {
      type: "nodeConnection",
      node1,
      node2,
      curve,
    };

    this.group.add(line);
    this.objects.push(line);

    // Store connection in both nodes
    node1.userData.connections.push(line);
    node2.userData.connections.push(line);
  }

  createPatterns() {
    // Pattern 1: Sequence
    const pattern1Nodes = this.getRandomNodes(3);
    this.patterns.push({
      type: "sequence",
      nodes: pattern1Nodes,
      currentIndex: 0,
      completed: false,
    });

    // Pattern 2: Simultaneous
    const pattern2Nodes = this.getRandomNodes(4);
    this.patterns.push({
      type: "simultaneous",
      nodes: pattern2Nodes,
      activatedCount: 0,
      completed: false,
    });

    // Visualize patterns
    this.patterns.forEach((pattern) => {
      pattern.nodes.forEach((node) => {
        node.material.emissiveIntensity = 0.1; // Dimly lit
      });
    });
  }

  createLighting() {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0x444466, 0.5);
    this.group.add(ambientLight);

    // Point lights
    const pointLight1 = new THREE.PointLight(this.primaryColor, 0.8, 80);
    pointLight1.position.set(20, 30, 20);
    this.group.add(pointLight1);
    this.lights.push(pointLight1);

    const pointLight2 = new THREE.PointLight(this.secondaryColor, 0.8, 80);
    pointLight2.position.set(-20, 30, -20);
    this.group.add(pointLight2);
    this.lights.push(pointLight2);
  }

  createEchoes() {
    //Geometric shape from Circuit 3 (Symbolic)
    const symbolGeometry = new THREE.TetrahedronGeometry(2);
    const symbolMaterial = new THREE.MeshBasicMaterial({
      color: this.accentColor,
      transparent: true,
      opacity: 0.1, // Very faint
      wireframe: true,
    });
    const symbolEcho = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbolEcho.position.set(5, 10, -15);
    this.group.add(symbolEcho);
    this.objects.push(symbolEcho);
  }

  createAudio() {
    // Only attempt to create audio if the required THREE.js audio classes exist
    if (!THREE.AudioListener || !THREE.Audio || !THREE.AudioLoader) {
      console.warn("THREE.js audio modules not available");
      return;
    }

    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    this.sound = new THREE.Audio(this.listener);

    const audioLoader = new THREE.AudioLoader();

    // Check if the audio file exists or use a fallback path
    let audioPath = this.ambientSoundPath;

    // Try to load the audio, with error handling
    try {
      audioLoader.load(
        audioPath,
        // onLoad callback
        (buffer) => {
          this.sound.setBuffer(buffer);
          this.sound.setLoop(true);
          this.sound.setVolume(0.5);
          this.sound.play();
          console.log("Circuit 5 ambient audio playing");
        },
        // onProgress callback
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // onError callback
        (err) => {
          console.warn("An error happened with the audio loading:", err);
        }
      );
    } catch (error) {
      console.warn("Could not load audio for Circuit 5:", error);
    }
  }

  // Helper function to get random nodes
  getRandomNodes(count) {
    const shuffled = [...this.nodes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  update(delta) {
    this.scene.fog.density = 0.005 * (1 - this.resonance);
    // Inside update(), add this:
    this.objects.forEach((object) => {
      if (object.userData.type === "nodeConnection") {
        // Pulse opacity between 0.2 and 0.4, based on resonance
        object.material.opacity =
          0.2 +
          0.2 *
            Math.sin(Date.now() * 0.003 + object.position.x) *
            (this.resonance + 0.5);
      }
    });
    
    // Animate energy flows
    this.energyFlows.forEach((flow) => {
      if (flow.userData && flow.userData.curve) {
        // Update offset for animation
        flow.userData.offset += delta * flow.userData.speed;

        // Make flow more visible
        if (flow.material) {
          // Pulse opacity based on resonance
          flow.material.opacity =
            0.3 +
            this.resonance * 0.5 +
            0.2 * Math.sin(Date.now() * 0.001 + flow.userData.offset);
        }
      }
    });

    // Branching
    this.handleBranching(delta);

    // Merging
    this.handleMerging(delta);

    // Update node effects (pulsating)
    this.nodes.forEach((node) => {
      const scale = 1 + 0.1 * Math.sin(Date.now() * 0.002 + node.position.x);
      node.scale.set(scale, scale, scale);
      if (node.material) {
        // Make nodes brighter
        node.material.emissiveIntensity = node.userData.active
          ? 0.8 // Active node is bright
          : 0.3 + 0.2 * Math.sin(Date.now() * 0.003 + node.position.z); // Inactive node pulses
      }
    });

    // Update flow particles
    this.particles.forEach((particleSystem) => {
      if (
        particleSystem.userData &&
        particleSystem.userData.type === "flowParticles"
      ) {
        const userData = particleSystem.userData;

        // Update offset (movement along the curve)
        userData.offset = (userData.offset + delta * userData.speed) % 1;

        // Update particle positions
        const positions = particleSystem.geometry.attributes.position.array;
        const count = userData.particleCount;
        const curve = userData.curve;

        for (let i = 0; i < count; i++) {
          // Calculate position on curve with offset and particle spacing
          const t = (userData.offset + i / count) % 1;
          const point = curve.getPointAt(t);

          // Add some jitter for a more natural look
          const jitter = 0.3 * (this.resonance + 0.5);
          positions[i * 3] = point.x + (Math.random() - 0.5) * jitter;
          positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * jitter;
          positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * jitter;
        }

        // Update sizes based on resonance
        if (particleSystem.geometry.attributes.size) {
          const sizes = particleSystem.geometry.attributes.size.array;
          for (let i = 0; i < sizes.length; i++) {
            sizes[i] = 0.5 + Math.random() * 1.5 + this.resonance * 2;
          }
          particleSystem.geometry.attributes.size.needsUpdate = true;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Update color/opacity based on resonance
        particleSystem.material.opacity = 0.3 + this.resonance * 0.7;
      }
    });

    // Handle echoes (color shifts, pulsing)
    this.handleEchoes(delta);

    // Update resonance (decay)
    this.resonance = Math.max(
      0,
      this.resonance - this.resonanceDecayRate * delta
    );

    // Check for pattern completion
    this.checkPatternCompletion();

    // Update audio volume based on resonance
    if (this.sound) {
      this.sound.setVolume(this.resonance * 0.5); // Adjust multiplier as needed
    }
  }

  handleBranching(delta) {
    const newFlows = [];
    this.energyFlows.forEach(flow => {
        if (flow.userData.canBranch && Math.random() < 0.002 && flow.userData.branchCount < 2) { // Low probability
          
            // Create a branch
            const branchPoint = Math.random(); // Random point along the curve (0 to 1)
            const newCurve = this.createBranchCurve(flow.userData.curve, branchPoint);
            const newGeometry = new THREE.TubeGeometry(newCurve, this.energyFlowLength * 2, 0.8, 8, false); // Adjust params
            const newMaterial = flow.material.clone();
            newMaterial.color.offsetHSL(0, 0, (Math.random()-0.5) * 0.2); // Adjust the color slightly
            const newFlow = new THREE.Mesh(newGeometry, newMaterial);

            newFlow.userData = {
                type: 'energyFlow',
                curve: newCurve,
                speed: flow.userData.speed * (0.8 + Math.random() * 0.4),
                offset: Math.random() * 100,
                branchCount: flow.userData.branchCount + 1,
                parentFlow: flow, // Keep track of the parent
                canBranch: true,
            };
            this.group.add(newFlow);
            newFlows.push(newFlow);
            this.objects.push(newFlow);
            this.createFlowParticles(newCurve, Math.random() * 10); // Use a random flowIndex

            //Increase the original flows branch count
            flow.userData.branchCount++;
        }
    });
    this.energyFlows.push(...newFlows);
  }

  handleMerging(delta) {
    const flowsToRemove = new Set();

    for (let i = 0; i < this.energyFlows.length; i++) {
      for (let j = i + 1; j < this.energyFlows.length; j++) { // Compare each flow to every *other* flow
          const flow1 = this.energyFlows[i];
          const flow2 = this.energyFlows[j];

          if (flowsToRemove.has(flow1) || flowsToRemove.has(flow2)) continue; // Skip if already merging

          const [closestPoint1, closestPoint2, distance] = this.findClosestPointsBetweenCurves(flow1.userData.curve, flow2.userData.curve, 50);

          if (distance < 5) { //  merge distance
              console.log("Merging flows");
              // Create a new curve that joins the two flows
              const mergedCurve = this.createMergedCurve(flow1, flow2, closestPoint1, closestPoint2);

              // Create new geometry and material
              const mergedGeometry = new THREE.TubeGeometry(mergedCurve, this.energyFlowLength * 4, 0.8, 8, false);
              const mergedMaterial = flow1.material.clone(); //  reuse material, maybe blend colors?
              const mergedFlow = new THREE.Mesh(mergedGeometry, mergedMaterial);

              mergedFlow.userData = {
                  type: 'energyFlow',
                  curve: mergedCurve,
                  speed: (flow1.userData.speed + flow2.userData.speed) / 2, // Average speed
                  offset: Math.random() * 100,
                  branchCount: 0,
                  canBranch: true,
              };

              this.group.add(mergedFlow);
              this.energyFlows.push(mergedFlow);
              this.objects.push(mergedFlow);
              this.createFlowParticles(mergedCurve, 11);

              // Remove the old flows and their particles
              flowsToRemove.add(flow1);
              flowsToRemove.add(flow2);

              //Remove associated particles.
              this.particles = this.particles.filter(p => {
                  return p.userData.type !== 'flowParticles' || (p.userData.flow !== flow1 && p.userData.flow !== flow2);
              });
          }
      }
    }

    // Remove merged flows. It's important to do this *after* the loops
    this.energyFlows = this.energyFlows.filter(flow => !flowsToRemove.has(flow));
    flowsToRemove.forEach(flow => {
      this.group.remove(flow);
      this.objects.splice(this.objects.indexOf(flow), 1); //Remove from objects array.
    });
  }

  createBranchCurve(originalCurve, branchPointT) {
    const originalPoints = originalCurve.getPoints(this.energyFlowLength); // Get points from the original
    const branchPointIndex = Math.floor(branchPointT * originalPoints.length);

    const newPoints = originalPoints.slice(0, branchPointIndex + 1); // Copy points up to the branch

    // Add new points, diverging from the original
    for (let i = 0; i < this.energyFlowLength / 2; i++) { //  length of the new branch
        const lastPoint = newPoints[newPoints.length - 1];
        const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const newPoint = new THREE.Vector3().copy(lastPoint).add(direction.multiplyScalar(3 + Math.random() * 3)); // Adjust for length
        newPoints.push(newPoint);
    }

    const newCurve = new THREE.CatmullRomCurve3(newPoints);
    return newCurve;
  }

  createMergedCurve(flow1, flow2, closestPoint1, closestPoint2) {
    // Get points along each curve
    const points1 = flow1.userData.curve.getPoints(this.energyFlowLength);
    const points2 = flow2.userData.curve.getPoints(this.energyFlowLength);

    // Find the indices of the closest points
    let index1 = -1;
    let minDistance1 = Infinity;
    for (let i = 0; i < points1.length; i++) {
        const distance = points1[i].distanceTo(closestPoint1);
        if (distance < minDistance1) {
            minDistance1 = distance;
            index1 = i;
        }
    }

    let index2 = -1;
    let minDistance2 = Infinity;
    for (let i = 0; i < points2.length; i++) {
        const distance = points2[i].distanceTo(closestPoint2);
        if (distance < minDistance2) {
            minDistance2 = distance;
            index2 = i;
        }
    }

    // Create the merged curve. There are many ways to do this; here's one approach:
    const mergedPoints = [];

    // 1. Add points from flow1 up to the closest point
    for (let i = 0; i <= index1; i++) {
        mergedPoints.push(points1[i]);
    }

    // 2. Add a few intermediate points to smoothly connect the flows
    const numIntermediatePoints = 5;
    for (let i = 0; i <= numIntermediatePoints; i++) {
        const t = i / numIntermediatePoints;
        const point = new THREE.Vector3().lerpVectors(points1[index1], points2[index2], t);
        mergedPoints.push(point);
    }

    // 3. Add points from flow2 from the closest point onwards
    for (let i = index2; i < points2.length; i++) {
      mergedPoints.push(points2[i]);
    }

    const mergedCurve = new THREE.CatmullRomCurve3(mergedPoints);
    return mergedCurve;
  }

  findClosestPointsBetweenCurves(curve1, curve2, numSamples) {
    const points1 = curve1.getPoints(numSamples);
    const points2 = curve2.getPoints(numSamples);

    let closestPoint1 = null;
    let closestPoint2 = null;
    let minDistance = Infinity;

    for (let i = 0; i < points1.length; i++) {
        for (let j = 0; j < points2.length; j++) {
            const distance = points1[i].distanceTo(points2[j]);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint1 = points1[i];
                closestPoint2 = points2[j];
            }
        }
    }

    return [closestPoint1, closestPoint2, minDistance];
  }

  handleEchoes(delta) {
    // Brief color shifts (Circuit 2 - Emotional)
    if (Math.random() < 0.01) {
      // 1% chance per frame
      const colors = [0xff6600, 0x8b4513, 0xffff00]; // Colors from Circuit 2
      const randomColor = new THREE.Color(
        colors[Math.floor(Math.random() * colors.length)]
      );
      this.scene.fog.color.lerp(randomColor, 0.1); // Briefly shift fog color

      // Reset
      setTimeout(() => {
        this.scene.fog.color.lerp(new THREE.Color(0x222233), 0.1);
      }, 200);
    }

    // Pulsing rhythm (Circuit 1 - Breathing)
    const pulse = Math.sin(Date.now() * 0.001); // Slow pulse
    this.group.scale.set(1 + pulse * 0.02, 1 + pulse * 0.02, 1 + pulse * 0.02);

    const skyColor = new THREE.Color(0x222233); //Initial color.
    const resonanceColor = this.getResonanceColor(); // Get a color based on resonance.
    skyColor.lerp(resonanceColor, this.resonance * 0.4); // Adjust the *0.4 for how strong of a shift you want
    
    // Find the sky mesh and update its color
    const sky = this.group.children.find(
      (child) =>
        child.type === "Mesh" && child.geometry instanceof THREE.SphereGeometry
    );
    if (sky && sky.material) {
      sky.material.color = skyColor;
    }
  }

  handleInteraction(type, data) {
    // console.log(`Holistic-Intuitive Circuit: ${type} interaction`);

    if (type === "interact") {
      // Find nearest node
      const nearestNode = this.findNearestNode(data.position);

      if (
        nearestNode &&
        this.isWithinInteractionRange(nearestNode, data.position, 3)
      ) {
        // Increase resonance
        this.resonance = Math.min(
          1,
          this.resonance + this.resonanceIncreaseRate
        );

        // Check node patterns
        this.patterns.forEach((pattern) => {
          if (pattern.type === "sequence") {
            if (pattern.nodes[pattern.currentIndex] === nearestNode) {
              nearestNode.userData.active = true;
              if (nearestNode.material) {
                nearestNode.material.emissiveIntensity = 0.7; // Brighten
              }
              pattern.currentIndex++;

              if (pattern.currentIndex >= pattern.nodes.length) {
                pattern.completed = true;
              }
            }
          } else if (pattern.type === "simultaneous") {
            if (
              pattern.nodes.includes(nearestNode) &&
              !nearestNode.userData.active
            ) {
              nearestNode.userData.active = true;
              if (nearestNode.material) {
                nearestNode.material.emissiveIntensity = 0.7;
              }
              pattern.activatedCount++;

              if (pattern.activatedCount >= pattern.nodes.length) {
                pattern.completed = true;
              }
            }
          }
        });
      }
    }
  }

  updateResonance() {
    // Could be used for visual feedback - handled in update()
  }

  checkPatternCompletion() {
    this.patterns.forEach((pattern) => {
      if (pattern.completed) {
        this.createCompletionEffect(pattern.nodes[0].position);
        pattern.completed = false; // Reset.
        pattern.nodes.forEach((n) => {
          n.userData.active = false;
          if (n.material) {
            n.material.emissiveIntensity = 0.1;
          }
        });
        if (pattern.type === "sequence") {
          pattern.currentIndex = 0;
        } else if (pattern.type === "simultaneous") {
          pattern.activatedCount = 0;
        }
      }
    });
  }

  createCompletionEffect(position) {
    // Expanding sphere of particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0; // Start at origin
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;

      particleSizes[i] = Math.random() * 0.5 + 0.2;

      // Random direction
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      const speed = Math.random() * 0.1 + 0.05;
      particleVelocities.push(direction.multiplyScalar(speed));
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: this.accentColor,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.copy(position); // Set origin

    this.group.add(particles);
    this.particles.push(particles);

    // Animate particles
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animateParticles = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      particleMaterial.opacity = 1 - progress; // Fade

      if (progress < 1) {
        requestAnimationFrame(animateParticles);
      } else {
        this.group.remove(particles);
        this.particles = this.particles.filter((p) => p !== particles);
      }
    };

    animateParticles();
  }

  findNearestNode(position) {
    let nearest = null;
    let minDist = Infinity;
    this.nodes.forEach((node) => {
      const dist = node.position.distanceTo(position);
      if (dist < minDist) {
        minDist = dist;
        nearest = node;
      }
    });
    return nearest;
  }

  isWithinInteractionRange(object, position, radius) {
    return object.position.distanceTo(position) < radius;
  }

  getResonanceColor() {
    // Interpolate between blue (low resonance) and gold (high resonance)
    const lowColor = new THREE.Color(0x0000ff);
    const highColor = new THREE.Color(0xffd700);
    return lowColor.lerp(highColor, this.resonance);
  }
}
