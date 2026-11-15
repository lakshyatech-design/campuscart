/**
 * GSV Direct — Interactive 3D Train & Multi-Modal Transit Engine
 * Powered by Three.js
 * 
 * High-performance, 60 FPS interactive aerodynamic bullet train locomotive
 * with dynamic rail tracks, volumetric headlights, particle speed trails,
 * mouse-follow parallax, orbit drag, and interactive speed/light modes.
 */

(function () {
  'use strict';

  let scene, camera, renderer, trainGroup, trackGroup, particlesGroup;
  let wheels = [];
  let headlights = [];
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0.1, targetRotationY = -0.55;
  let isDragging = false, prevMouseX = 0, prevMouseY = 0;
  let currentSpeed = 1.0; // 1.0 = 160 km/h, 2.2 = 320 km/h
  let isNightMode = false;
  let autoRotate = false;
  let animFrameId = null;

  function init() {
    const container = document.getElementById('gsv-3d-container');
    if (!container) return;

    // Check WebGL availability
    if (!window.WebGLRenderingContext) {
      container.innerHTML = '<div class="gsv-3d-fallback"><span>🚅 GSV High-Speed Transit Engine</span></div>';
      return;
    }

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 440;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 8.5);

    // 2. Renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      container.innerHTML = '<div class="gsv-3d-fallback"><span>🚅 GSV Transit Engine (WebGL Unavailable)</span></div>';
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 3. Lighting
    setupLighting();

    // 4. Build 3D GSV Locomotive & Tracks
    buildLocomotive();
    buildTracks();
    buildSpeedParticles();

    // 5. Event Listeners
    setupEvents(container);

    // 6. Animation Loop
    animate();
  }

  function setupLighting() {
    // Ambient Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    ambient.name = 'ambientLight';
    scene.add(ambient);

    // Sun / Key Light
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    sunLight.position.set(8, 12, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.name = 'sunLight';
    scene.add(sunLight);

    // Blue Rim Light (GSV Rail Branding glow)
    const rimLight = new THREE.DirectionalLight(0x0052cc, 1.2);
    rimLight.position.set(-10, 6, -8);
    rimLight.name = 'rimLight';
    scene.add(rimLight);

    // Warm Ground Bounce Light
    const bounceLight = new THREE.DirectionalLight(0xd97706, 0.4);
    bounceLight.position.set(0, -5, 4);
    scene.add(bounceLight);
  }

  function buildLocomotive() {
    trainGroup = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0052cc, // GSV Rail Cobalt
      roughness: 0.25,
      metalness: 0.75
    });

    const goldStripeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // High-Speed Gold
      roughness: 0.3,
      metalness: 0.85
    });

    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xecf0f5,
      roughness: 0.2,
      metalness: 0.9
    });

    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6,
      metalness: 0.4
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1128,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85
    });

    const glowLightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // Main Locomotive Body (Elongated aerodynamic cab)
    const bodyGeom = new THREE.BoxGeometry(1.5, 1.3, 5.8);
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.set(0, 1.1, 0);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    trainGroup.add(bodyMesh);

    // Aerodynamic Sloped Nose
    const noseGeom = new THREE.CylinderGeometry(0.75, 1.1, 1.8, 16, 1, false, 0, Math.PI);
    noseGeom.rotateX(Math.PI / 2);
    noseGeom.rotateY(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeom, bodyMat);
    noseMesh.position.set(0, 0.95, 3.4);
    noseMesh.scale.set(1, 0.7, 1);
    trainGroup.add(noseMesh);

    // Nose Cone Wedge Tip
    const tipGeom = new THREE.ConeGeometry(0.65, 1.2, 16);
    tipGeom.rotateX(Math.PI / 2);
    const tipMesh = new THREE.Mesh(tipGeom, goldStripeMat);
    tipMesh.position.set(0, 0.8, 4.3);
    tipMesh.scale.set(1.1, 0.6, 1);
    trainGroup.add(tipMesh);

    // Aerodynamic Cockpit Windshield (Glass)
    const glassGeom = new THREE.BoxGeometry(1.3, 0.42, 1.1);
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    glassMesh.position.set(0, 1.45, 2.5);
    glassMesh.rotation.x = -0.35;
    trainGroup.add(glassMesh);

    // Side Passenger Window Bands (Dark Glass Ribbons)
    const leftWindowGeom = new THREE.BoxGeometry(0.04, 0.35, 3.6);
    const leftWindow = new THREE.Mesh(leftWindowGeom, glassMat);
    leftWindow.position.set(-0.76, 1.2, -0.4);
    trainGroup.add(leftWindow);

    const rightWindow = new THREE.Mesh(leftWindowGeom, glassMat);
    rightWindow.position.set(0.76, 1.2, -0.4);
    trainGroup.add(rightWindow);

    // GSV Gold Racing Speed Stripe (Left & Right)
    const stripeGeom = new THREE.BoxGeometry(0.02, 0.12, 5.2);
    const leftStripe = new THREE.Mesh(stripeGeom, goldStripeMat);
    leftStripe.position.set(-0.76, 0.85, 0.4);
    trainGroup.add(leftStripe);

    const rightStripe = new THREE.Mesh(stripeGeom, goldStripeMat);
    rightStripe.position.set(0.76, 0.85, 0.4);
    trainGroup.add(rightStripe);

    // Silver Platinum Lower Skirt
    const skirtGeom = new THREE.BoxGeometry(1.54, 0.22, 5.7);
    const skirt = new THREE.Mesh(skirtGeom, silverMat);
    skirt.position.set(0, 0.45, 0);
    trainGroup.add(skirt);

    // Roof Aerodynamic Fairing & AC Cowl
    const roofGeom = new THREE.BoxGeometry(1.2, 0.22, 4.5);
    const roof = new THREE.Mesh(roofGeom, silverMat);
    roof.position.set(0, 1.82, -0.4);
    trainGroup.add(roof);

    // Pantograph Assembly (Roof Power Collector)
    const pantoBaseGeom = new THREE.BoxGeometry(0.7, 0.08, 0.9);
    const pantoBase = new THREE.Mesh(pantoBaseGeom, darkChassisMat);
    pantoBase.position.set(0, 1.95, -1.8);
    trainGroup.add(pantoBase);

    const armGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const arm1 = new THREE.Mesh(armGeom, goldStripeMat);
    arm1.position.set(-0.2, 2.25, -1.9);
    arm1.rotation.z = -0.4;
    arm1.rotation.x = 0.3;
    trainGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeom, goldStripeMat);
    arm2.position.set(0.2, 2.25, -1.9);
    arm2.rotation.z = 0.4;
    arm2.rotation.x = 0.3;
    trainGroup.add(arm2);

    const headBarGeom = new THREE.BoxGeometry(0.9, 0.04, 0.12);
    const headBar = new THREE.Mesh(headBarGeom, darkChassisMat);
    headBar.position.set(0, 2.55, -1.8);
    trainGroup.add(headBar);

    // Front Dual LED Headlights
    const lightGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
    lightGeom.rotateX(Math.PI / 2);

    const leftLight = new THREE.Mesh(lightGeom, glowLightMat);
    leftLight.position.set(-0.45, 0.75, 4.15);
    trainGroup.add(leftLight);

    const rightLight = new THREE.Mesh(lightGeom, glowLightMat);
    rightLight.position.set(0.45, 0.75, 4.15);
    trainGroup.add(rightLight);

    // Spotlight Cones (Headlight Beams)
    const spotLeft = new THREE.SpotLight(0xffffff, 2.8, 18, Math.PI / 7, 0.4, 1.2);
    spotLeft.position.set(-0.45, 0.75, 4.2);
    spotLeft.target.position.set(-0.45, 0, 12);
    trainGroup.add(spotLeft);
    trainGroup.add(spotLeft.target);
    headlights.push(spotLeft);

    const spotRight = new THREE.SpotLight(0xffffff, 2.8, 18, Math.PI / 7, 0.4, 1.2);
    spotRight.position.set(0.45, 0.75, 4.2);
    spotRight.target.position.set(0.45, 0, 12);
    trainGroup.add(spotRight);
    trainGroup.add(spotRight.target);
    headlights.push(spotRight);

    // Undercarriage Bogies & Wheels
    const bogieGeom = new THREE.BoxGeometry(1.3, 0.25, 1.6);
    const frontBogie = new THREE.Mesh(bogieGeom, darkChassisMat);
    frontBogie.position.set(0, 0.3, 1.8);
    trainGroup.add(frontBogie);

    const rearBogie = new THREE.Mesh(bogieGeom, darkChassisMat);
    rearBogie.position.set(0, 0.3, -1.8);
    trainGroup.add(rearBogie);

    // 8 Wheels (2 axles per bogie)
    const wheelGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.1, 24);
    wheelGeom.rotateZ(Math.PI / 2);

    const wheelPositions = [
      [-0.68, 0.26, 2.3], [0.68, 0.26, 2.3],
      [-0.68, 0.26, 1.3], [0.68, 0.26, 1.3],
      [-0.68, 0.26, -1.3], [0.68, 0.26, -1.3],
      [-0.68, 0.26, -2.3], [0.68, 0.26, -2.3]
    ];

    wheelPositions.forEach(pos => {
      const wheelMesh = new THREE.Mesh(wheelGeom, silverMat);
      wheelMesh.position.set(pos[0], pos[1], pos[2]);
      wheelMesh.castShadow = true;
      trainGroup.add(wheelMesh);
      wheels.push(wheelMesh);
    });

    // Initial group placement
    trainGroup.position.set(0, 0.1, 0);
    scene.add(trainGroup);
  }

  function buildTracks() {
    trackGroup = new THREE.Group();

    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.15
    });

    const sleeperMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      metalness: 0.2
    });

    // Two Continuous Steel Rails
    const railGeom = new THREE.BoxGeometry(0.08, 0.12, 34);
    const leftRail = new THREE.Mesh(railGeom, railMat);
    leftRail.position.set(-0.68, 0.06, 0);
    leftRail.receiveShadow = true;
    trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeom, railMat);
    rightRail.position.set(0.68, 0.06, 0);
    rightRail.receiveShadow = true;
    trackGroup.add(rightRail);

    // Ballast Bed (Clean Platform Floor)
    const bedGeom = new THREE.PlaneGeometry(3.6, 36);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1
    });
    const bed = new THREE.Mesh(bedGeom, bedMat);
    bed.rotation.x = -Math.PI / 2;
    bed.position.set(0, -0.01, 0);
    bed.receiveShadow = true;
    trackGroup.add(bed);

    // Sleepers (Cross-ties)
    const sleeperGeom = new THREE.BoxGeometry(2.0, 0.08, 0.22);
    for (let z = -16; z <= 16; z += 0.9) {
      const sleeper = new THREE.Mesh(sleeperGeom, sleeperMat);
      sleeper.position.set(0, 0.02, z);
      sleeper.receiveShadow = true;
      trackGroup.add(sleeper);
    }

    scene.add(trackGroup);
  }

  function buildSpeedParticles() {
    particlesGroup = new THREE.Group();
    const count = 120;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      speeds.push(0.15 + Math.random() * 0.35);
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geom, pMat);
    particles.userData = { speeds };
    particlesGroup.add(particles);
    scene.add(particlesGroup);
  }

  function setupEvents(container) {
    // Mouse move parallax
    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (!isDragging) {
        targetRotationY = -0.55 + x * 0.45;
        targetRotationX = 0.12 - y * 0.2;
      }
    });

    // Orbit Drag (Mouse & Touch)
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.25, Math.min(0.65, targetRotationX));
    });

    // Touch Support
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.25, Math.min(0.65, targetRotationX));
    }, { passive: true });

    // Click on Train: Trigger Acceleration Pulse chime + speed boost
    container.addEventListener('click', (e) => {
      if (Math.abs(e.clientX - prevMouseX) > 5) return; // ignore drag
      playTrainHornChime();
      triggerBoostEffect();
    });

    // Window Resize
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    const container = document.getElementById('gsv-3d-container');
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || 580;
    const height = container.clientHeight || 440;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Web Audio Train Harmonic Acceleration Chime
  function playTrainHornChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const freqs = [330, 440, 554, 659]; // High-speed harmonic chord (E4, A4, C#5, E5)
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + 0.7);
      });
    } catch (e) {
      // Audio autoplay policy or silent mode
    }
  }

  function triggerBoostEffect() {
    currentSpeed = 2.4;
    const badge = document.getElementById('gsv-speed-indicator');
    if (badge) badge.textContent = '320 KM/H (MAX VELOCITY)';
    setTimeout(() => {
      currentSpeed = 1.0;
      if (badge) badge.textContent = '160 KM/H (CRUISE)';
    }, 2500);
  }

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    // Smooth Lerp Rotation
    if (trainGroup) {
      if (autoRotate) {
        targetRotationY += 0.008;
      }
      trainGroup.rotation.y += (targetRotationY - trainGroup.rotation.y) * 0.06;
      trainGroup.rotation.x += (targetRotationX - trainGroup.rotation.x) * 0.06;

      // Subtle Hover Floating Oscillation
      const t = Date.now() * 0.0025;
      trainGroup.position.y = 0.1 + Math.sin(t) * 0.03;
    }

    // Wheel Rotation
    wheels.forEach(w => {
      w.rotation.x += 0.08 * currentSpeed;
    });

    // Move Track Sleepers to simulate infinite high-speed railway motion
    if (trackGroup) {
      trackGroup.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'BoxGeometry' && child.position.x === 0 && child.position.z !== 0) {
          child.position.z -= 0.18 * currentSpeed;
          if (child.position.z < -16) {
            child.position.z += 32;
          }
        }
      });
    }

    // Move Speed Particles
    if (particlesGroup) {
      const points = particlesGroup.children[0];
      if (points) {
        const pos = points.geometry.attributes.position.array;
        const speeds = points.userData.speeds;
        for (let i = 0; i < speeds.length; i++) {
          pos[i * 3 + 2] -= speeds[i] * currentSpeed * 1.5;
          if (pos[i * 3 + 2] < -12) {
            pos[i * 3 + 2] = 12;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      }
    }

    renderer.render(scene, camera);
  }

  // Public Controller API for UI Buttons
  window.GSV3D = {
    init: init,
    setCameraView: function (view) {
      if (!trainGroup) return;
      autoRotate = false;
      if (view === 'front') {
        targetRotationY = -0.55;
        targetRotationX = 0.12;
      } else if (view === 'side') {
        targetRotationY = -Math.PI / 2;
        targetRotationX = 0.02;
      } else if (view === 'cockpit') {
        targetRotationY = 0;
        targetRotationX = 0.22;
      } else if (view === 'orbit') {
        autoRotate = true;
      }
    },
    toggleSpeed: function () {
      if (currentSpeed > 1.5) {
        currentSpeed = 1.0;
        return '160 km/h';
      } else {
        currentSpeed = 2.4;
        return '320 km/h';
      }
    },
    toggleLighting: function () {
      isNightMode = !isNightMode;
      const ambient = scene.getObjectByName('ambientLight');
      const sun = scene.getObjectByName('sunLight');
      if (ambient && sun) {
        if (isNightMode) {
          ambient.intensity = 0.2;
          sun.intensity = 0.3;
          headlights.forEach(h => { h.intensity = 5.0; });
        } else {
          ambient.intensity = 0.85;
          sun.intensity = 1.4;
          headlights.forEach(h => { h.intensity = 2.8; });
        }
      }
      return isNightMode ? 'Night Mode' : 'Day Mode';
    }
  };

  // Auto initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }
})();
