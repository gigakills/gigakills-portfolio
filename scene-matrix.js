/**
 * Matrix Sector 3D Cockpit — Clean GLB-Only Mode
 * Renders Cockpitfinal.glb + video screen planes only.
 *
 * No procedural objects (starfield, planet, cockpit frame).
 * Camera tuning with live keyboard controls and preset system.
 *
 * ARCHITECTURE:
 * - Canvas: #scene-matrix (fixed position, transparent)
 * - Model: Cockpitfinal.glb (Blender transforms preserved)
 * - Screens: 3 independent planes with Matrix raining code video
 * - Camera: Tunable with keyboard, preset system for final framing
 */

(function () {
  console.log('[MatrixScene] scene-matrix.js loaded');

  const canvas = document.getElementById('scene-matrix');
  if (!canvas) {
    console.warn('[MatrixScene] Canvas #scene-matrix not found, aborting');
    return;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CONFIGURATION — GLB-ONLY MODE
  // ═════════════════════════════════════════════════════════════════════════════

  const MATRIX_SCENE_MODE = "glb_only";
  const MODEL_PATH = "Cockpitfinal.glb";
  const SCREEN_VIDEO_PATH = "The Matrix Raining Green Code Backdrop for OBS - Teams, Zoom calls in 4k - link to 45mins ver below.mp4";

  // Procedural object flags (all false in glb_only mode)
  const ENABLE_PROCEDURAL_STARFIELD = false;
  const ENABLE_PROCEDURAL_PLANET = false;
  const ENABLE_PROCEDURAL_COCKPIT = false;
  const ENABLE_PROCEDURAL_MONITOR_FRAMES = false;
  const ENABLE_VIDEO_SCREENS = true;
  const ENABLE_DEBUG_HELPERS = false;

  // ═════════════════════════════════════════════════════════════════════════════
  // CAMERA PRESET — Copy final values from printCameraPreset() output
  // ═════════════════════════════════════════════════════════════════════════════

  const CAMERA_PRESET = {
    position: { x: 0.000, y: 0.013, z: 0.563 },
    lookAt: { x: 0.000, y: -1.250, z: -15.250 },
    fov: 82.0,
    near: 0.1,
    far: 2000
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // CAMERA TUNING — Live adjustment with keyboard
  // ═════════════════════════════════════════════════════════════════════════════

  const CAMERA_TUNING = {
    enabled: true,
    moveStep: 0.25,
    rotateStep: 0.05,
    fovStep: 2
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // MODEL TRANSFORM — Applied after load, tweak as needed
  // ═════════════════════════════════════════════════════════════════════════════

  const MODEL_TRANSFORM = {
    scale: 1.0,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // SCREEN PLANES — Video texture display surfaces
  // ═════════════════════════════════════════════════════════════════════════════

  const SCREEN_CONFIG = {
    enabled: ENABLE_VIDEO_SCREENS,
    opacity: 0.95,
    brightness: 1.0,
    positions: [
      { x: -0.300, y: -0.080, z: 0.050 },
      { x: 0.000, y: -0.050, z: -0.000 },
      { x: 0.260, y: -0.070, z: 0.130 }
    ],
    rotations: [
      { x: -0.660, y: -0.030, z: -0.020 },
      { x: -0.680, y: 0.000, z: 0.000 },
      { x: -0.680, y: -0.010, z: 0.000 }
    ],
    scales: [
      { x: 0.200, y: 0.150 },
      { x: 0.250, y: 0.200 },
      { x: 0.150, y: 0.100 }
    ]
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // DEBUG FLAGS
  // ═════════════════════════════════════════════════════════════════════════════

  const DEBUG_VISIBILITY = false;
  const DEBUG_AXES = false;

  // ═════════════════════════════════════════════════════════════════════════════
  // SCREEN ALIGNMENT MODE — Tune screen plane positions/rotations/scales
  // ═════════════════════════════════════════════════════════════════════════════

  const SCREEN_ALIGNMENT_MODE = false;
  const SELECTED_SCREEN_INDEX = 0;
  const SCREEN_SURFACE_OFFSET = 0.03;
  const SCREEN_TUNING = {
    enabled: true,
    positionStep: 0.05,
    finePositionStep: 0.01,
    largePositionStep: 0.15,
    rotationStep: 0.02,
    scaleStep: 0.05
  };
  const SCREEN_MESH_KEYWORDS = [
    'screen',
    'monitor',
    'display',
    'panel',
    'glass',
    'holo',
    'tv',
    'terminal',
    'console',
    'plane'
  ];

  // ═════════════════════════════════════════════════════════════════════════════
  // SCENE STATE
  // ═════════════════════════════════════════════════════════════════════════════

  let scene, camera, renderer;
  let isVisible = canvas.style.display !== 'none';
  let rafId = null;
  let time = 0;

  // GLB model
  let gltfModel = null;
  let modelLoaded = false;

  // Video & screens
  let sharedVideoElement = null;
  let sharedVideoTexture = null;
  let screenPlanes = [];

  // Camera tuning state
  let cameraLookAtTarget = { x: CAMERA_PRESET.lookAt.x, y: CAMERA_PRESET.lookAt.y, z: CAMERA_PRESET.lookAt.z };
  let selectedScreenIndex = SCREEN_ALIGNMENT_MODE ? SELECTED_SCREEN_INDEX : -1;

  // Mouse parallax state
  let mouseX = 0, mouseY = 0;
  let parallaxOffsetPos = { x: 0, y: 0, z: 0 };
  const isMobile = window.innerWidth <= 768;
  const PARALLAX_AMOUNT = isMobile ? 0 : 0.08;
  const PARALLAX_DAMPING = 0.12;

  // Screen alignment
  let screenWireframes = [];
  let screenBorders = [];
  let candidateScreenMeshes = [];
  let suggestedScreenConfig = null;

  // Starfield plane
  let starfieldPlane = null;

  // ═════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═════════════════════════════════════════════════════════════════════════════

  function init() {
    console.log('🟢 Matrix Scene: Initializing (glb_only mode)...');

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 100, 2000);

    // Camera
    camera = new THREE.PerspectiveCamera(
      CAMERA_PRESET.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_PRESET.near,
      CAMERA_PRESET.far
    );
    camera.position.set(
      CAMERA_PRESET.position.x,
      CAMERA_PRESET.position.y,
      CAMERA_PRESET.position.z
    );
    camera.lookAt(
      cameraLookAtTarget.x,
      cameraLookAtTarget.y,
      cameraLookAtTarget.z
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const maxPixelRatio = isMobile ? 1.25 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;

    if (DEBUG_VISIBILITY) {
      renderer.setClearColor(0x330055, 1);
      canvas.style.zIndex = '1';
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a4d6d, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x3df0ff, 0.7);
    directionalLight.position.set(20, 30, -30);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Debug helpers
    if (DEBUG_AXES) {
      const axes = new THREE.AxesHelper(10);
      scene.add(axes);
      console.log('📍 Axes helper added (red=X, green=Y, blue=Z)');
    }

    // Load GLB and create screens
    loadGLBModel();
    if (ENABLE_VIDEO_SCREENS) {
      setupVideoTexture();
      createScreenPlanes();
    }
    createStarfieldPlane();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    if (CAMERA_TUNING.enabled) {
      setupCameraTuning();
    }

    console.log('✅ Matrix Scene ready');
    if (CAMERA_TUNING.enabled) {
      console.log('   Tuning: Arrow keys (pos), WASD (target), [/] (FOV), P (print preset)');
    }

    startLoop();
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // GLB MODEL LOADING
  // ═════════════════════════════════════════════════════════════════════════════

  function loadGLBModel() {
    if (!window.THREE || !window.THREE.GLTFLoader) {
      console.error('❌ THREE.GLTFLoader not available');
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      MODEL_PATH,
      (gltf) => {
        gltfModel = gltf.scene;

        // Apply transform
        gltfModel.position.set(
          MODEL_TRANSFORM.position.x,
          MODEL_TRANSFORM.position.y,
          MODEL_TRANSFORM.position.z
        );
        gltfModel.rotation.set(
          MODEL_TRANSFORM.rotation.x,
          MODEL_TRANSFORM.rotation.y,
          MODEL_TRANSFORM.rotation.z
        );
        gltfModel.scale.set(
          MODEL_TRANSFORM.scale,
          MODEL_TRANSFORM.scale,
          MODEL_TRANSFORM.scale
        );

        // Add to scene
        scene.add(gltfModel);
        modelLoaded = true;

        inspectModelMeshes();
      },
      undefined,
      (error) => {
        console.error('❌ Failed to load GLB model:', error);
        modelLoaded = false;
      }
    );
  }

  function discoverScreenMeshes(glbRoot) {
    const screenKeywords = ['screen', 'monitor', 'display', 'panel', 'glass', 'holo', 'tv'];
    const foundMeshes = [];

    glbRoot.traverse((child) => {
      if (!child.isMesh) return;
      const nameLower = child.name.toLowerCase();

      if (screenKeywords.some(keyword => nameLower.includes(keyword))) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        foundMeshes.push({
          name: child.name,
          position: { x: worldPos.x.toFixed(3), y: worldPos.y.toFixed(3), z: worldPos.z.toFixed(3) }
        });
      }
    });

    if (foundMeshes.length > 0) {
      console.log('📺 Found screen-like meshes in GLB:');
      foundMeshes.forEach(m => {
        console.log(`   ${m.name} at (${m.position.x}, ${m.position.y}, ${m.position.z})`);
      });
    }
  }

  function round3(value) {
    return Number(value.toFixed(3));
  }

  function vecToPlain(vec) {
    return { x: round3(vec.x), y: round3(vec.y), z: round3(vec.z) };
  }

  function getMeshNormal(mesh) {
    const worldQuat = new THREE.Quaternion();
    mesh.getWorldQuaternion(worldQuat);
    return new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat).normalize();
  }

  function getMaterialName(material) {
    if (!material) return '(none)';
    if (Array.isArray(material)) {
      return material.map((mat) => mat && mat.name ? mat.name : '(unnamed)').join(', ');
    }
    return material.name || '(unnamed)';
  }

  function matchesScreenKeyword(name, keyword) {
    if (!name) return false;
    const lower = name.toLowerCase();
    if (keyword !== 'plane') return lower.includes(keyword);
    return /(^|[^a-z])plane([^a-z]|$)/.test(lower);
  }

  function getScreenMeshScore(mesh, size) {
    const name = mesh.name || '';
    const parentName = mesh.parent && mesh.parent.name ? mesh.parent.name : '';
    const keywordScore = SCREEN_MESH_KEYWORDS.reduce((score, keyword) => {
      return score + (matchesScreenKeyword(name, keyword) ? 4 : 0) + (matchesScreenKeyword(parentName, keyword) ? 2 : 0);
    }, 0);
    const area = Math.max(size.x * size.y, size.x * size.z, size.y * size.z);
    return keywordScore * 1000 + area;
  }

  function collectCandidateScreenMeshes() {
    candidateScreenMeshes = [];
    if (!gltfModel) return candidateScreenMeshes;

    gltfModel.updateMatrixWorld(true);
    gltfModel.traverse((child) => {
      if (!child.isMesh) return;

      const isCandidate = SCREEN_MESH_KEYWORDS.some((keyword) => {
        return matchesScreenKeyword(child.name, keyword) || matchesScreenKeyword(child.parent && child.parent.name, keyword);
      });
      if (!isCandidate) return;

      const box = new THREE.Box3().setFromObject(child);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();
      const worldRotation = new THREE.Euler();

      box.getSize(size);
      box.getCenter(center);
      child.getWorldPosition(worldPosition);
      child.getWorldQuaternion(worldQuaternion);
      child.getWorldScale(worldScale);
      worldRotation.setFromQuaternion(worldQuaternion, 'XYZ');

      candidateScreenMeshes.push({
        mesh: child,
        name: child.name || '(unnamed mesh)',
        parentName: child.parent && child.parent.name ? child.parent.name : '(no parent)',
        materialName: getMaterialName(child.material),
        worldPosition,
        worldRotation,
        worldScale,
        boundingBoxSize: size,
        boundingBoxCenter: center,
        normal: getMeshNormal(child),
        visible: child.visible,
        score: getScreenMeshScore(child, size)
      });
    });

    candidateScreenMeshes.sort((a, b) => b.score - a.score);
    return candidateScreenMeshes;
  }

  function inspectModelMeshes() {
    if (!gltfModel) {
      console.warn('[MatrixScene] cockpit model is not loaded yet');
      return [];
    }

    const topLevelChildren = gltfModel.children.map((child) => child.name || child.type || '(unnamed)');
    const candidates = collectCandidateScreenMeshes();

    console.group('[MatrixScene] Cockpitfinal.glb mesh inspection');
    console.log('Top-level GLB children:', topLevelChildren);
    console.log('Candidate keywords:', SCREEN_MESH_KEYWORDS.join(', '));
    console.log(`Candidate meshes found: ${candidates.length}`);

    candidates.forEach((candidate, index) => {
      console.group(`#${index} ${candidate.name}`);
      console.log('mesh.name:', candidate.name);
      console.log('parent.name:', candidate.parentName);
      console.log('material:', candidate.materialName);
      console.log('world position:', vecToPlain(candidate.worldPosition));
      console.log('world rotation/euler:', vecToPlain(candidate.worldRotation));
      console.log('world scale:', vecToPlain(candidate.worldScale));
      console.log('bounding box size:', vecToPlain(candidate.boundingBoxSize));
      console.log('bounding box center:', vecToPlain(candidate.boundingBoxCenter));
      console.log('normal/facing:', vecToPlain(candidate.normal));
      console.log('visible:', candidate.visible);
      console.log('score:', round3(candidate.score));
      console.groupEnd();
    });
    console.groupEnd();

    return candidates;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VIDEO SETUP
  // ═════════════════════════════════════════════════════════════════════════════

  function setupVideoTexture() {
    sharedVideoElement = document.createElement('video');
    sharedVideoElement.src = SCREEN_VIDEO_PATH;
    sharedVideoElement.muted = true;
    sharedVideoElement.loop = true;
    sharedVideoElement.playsInline = true;
    sharedVideoElement.autoplay = true;
    sharedVideoElement.crossOrigin = 'anonymous';

    // Attempt autoplay
    const playPromise = sharedVideoElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Video autoplay failed (will play on interaction)');
      });
    }

    const resumeVideo = () => {
      if (sharedVideoElement && sharedVideoElement.paused) {
        sharedVideoElement.play().catch(() => {});
      }
    };
    window.addEventListener('click', resumeVideo, { passive: true });
    window.addEventListener('keydown', resumeVideo);

    sharedVideoTexture = new THREE.VideoTexture(sharedVideoElement);
    sharedVideoTexture.minFilter = THREE.LinearFilter;
    sharedVideoTexture.magFilter = THREE.LinearFilter;
  }

  function createScreenPlanes() {
    screenPlanes = [];
    screenWireframes = [];
    screenBorders = [];

    for (let i = 0; i < SCREEN_CONFIG.positions.length; i++) {
      const pos = SCREEN_CONFIG.positions[i];
      const rot = SCREEN_CONFIG.rotations[i];
      const scale = SCREEN_CONFIG.scales[i];

      // Video plane
      const geometry = new THREE.PlaneGeometry(1, 1);
      let material;
      if (sharedVideoTexture) {
        material = new THREE.MeshBasicMaterial({
          map: sharedVideoTexture,
          side: THREE.DoubleSide,
          toneMapped: false,
          transparent: SCREEN_CONFIG.opacity < 1 || SCREEN_ALIGNMENT_MODE,
          opacity: SCREEN_ALIGNMENT_MODE ? Math.min(SCREEN_CONFIG.opacity, 0.85) : SCREEN_CONFIG.opacity,
          color: new THREE.Color(SCREEN_CONFIG.brightness, SCREEN_CONFIG.brightness, SCREEN_CONFIG.brightness)
        });
      } else {
        material = new THREE.MeshBasicMaterial({
          color: 0x2fa84a,
          side: THREE.DoubleSide,
          transparent: SCREEN_ALIGNMENT_MODE,
          opacity: SCREEN_ALIGNMENT_MODE ? 0.85 : 1
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.rotation.set(rot.x, rot.y, rot.z);
      mesh.scale.set(scale.x, scale.y, 1);
      mesh.userData.screenIndex = i;
      mesh.userData.baseScale = { x: scale.x, y: scale.y };

      scene.add(mesh);
      screenPlanes.push(mesh);

      // Wireframe border (for alignment mode)
      if (SCREEN_ALIGNMENT_MODE && SCREEN_TUNING.enabled) {
        const wireGeo = new THREE.PlaneGeometry(1, 1);
        const wireEdges = new THREE.EdgesGeometry(wireGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: i === selectedScreenIndex ? 0x66ff66 : 0x008f39,
          linewidth: 2
        });
        const wireframe = new THREE.LineSegments(wireEdges, wireMat);
        wireframe.position.copy(mesh.position);
        wireframe.rotation.copy(mesh.rotation);
        wireframe.scale.copy(mesh.scale);
        wireframe.userData.screenIndex = i;
        wireframe.userData.linkedMesh = mesh;

        scene.add(wireframe);
        screenWireframes.push(wireframe);
        screenBorders.push(wireMat);
      }
    }

    if (SCREEN_ALIGNMENT_MODE) {
      console.log(`📍 Screen alignment mode: Press 1/2/3 to select, IJKLUOAZE to adjust, P to print`);
      updateScreenWireframes();
    }
  }

  function createStarfieldPlane() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('plain_starfield_1.png', (texture) => {
      const geometry = new THREE.PlaneGeometry(50, 50);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        toneMapped: false,
      });

      starfieldPlane = new THREE.Mesh(geometry, material);
      starfieldPlane.position.set(0, 0, -25);
      scene.add(starfieldPlane);
      console.log('✨ Starfield plane added');
    }, undefined, (error) => {
      console.warn('⚠️ Could not load starfield image:', error);
    });
  }

  function updateScreenWireframes() {
    if (!SCREEN_ALIGNMENT_MODE) return;

    screenWireframes.forEach((wire, i) => {
      const mesh = screenPlanes[i];
      wire.position.copy(mesh.position);
      wire.rotation.copy(mesh.rotation);
      wire.scale.copy(mesh.scale);

      const color = i === selectedScreenIndex ? 0x66ff66 : 0x008f39;
      wire.material.color.setHex(color);
    });
  }

  function selectScreen(index) {
    if (!SCREEN_ALIGNMENT_MODE || !SCREEN_TUNING.enabled) return false;
    if (index < 0 || index >= screenPlanes.length) {
      console.warn(`[MatrixScene] Screen index ${index} is out of range`);
      return false;
    }

    selectedScreenIndex = index;
    updateScreenWireframes();
    console.log(`[MatrixScene] Selected screen index ${selectedScreenIndex}`);
    return true;
  }

  function nudgeSelectedScreen(axis, amount) {
    const screen = screenPlanes[selectedScreenIndex];
    if (!screen) return false;

    if (axis === 'x' || axis === 'y' || axis === 'z') {
      screen.position[axis] += amount;
    } else if (axis === 'pitch' || axis === 'rotationX') {
      screen.rotation.x += amount;
    } else if (axis === 'yaw' || axis === 'rotationY') {
      screen.rotation.y += amount;
    } else if (axis === 'roll' || axis === 'rotationZ') {
      screen.rotation.z += amount;
    } else {
      console.warn(`[MatrixScene] Unknown nudge axis: ${axis}`);
      return false;
    }

    updateScreenWireframes();
    return true;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CAMERA TUNING
  // ═════════════════════════════════════════════════════════════════════════════

  function setupCameraTuning() {
    window.addEventListener('keydown', (e) => {
      const step = CAMERA_TUNING.moveStep;
      const rotStep = CAMERA_TUNING.rotateStep;
      const fovStep = CAMERA_TUNING.fovStep;

      // Get camera forward direction
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      // Get camera right direction
      const right = new THREE.Vector3();
      right.crossVectors(camera.up, forward).normalize();

      let isScreenControl = false;

      // ─────────────────────────────────────────────────────────────────
      // SCREEN ALIGNMENT CONTROLS
      // ─────────────────────────────────────────────────────────────────

      if (SCREEN_ALIGNMENT_MODE) {
        // Screen selection: 1, 2, 3 (no Shift needed)
        if (e.key === '1' && screenPlanes.length > 0) {
          selectedScreenIndex = 0;
          console.log('🎬 Selected screen 0 (left)');
          updateScreenWireframes();
          isScreenControl = true;
        } else if (e.key === '2' && screenPlanes.length > 1) {
          selectedScreenIndex = 1;
          console.log('🎬 Selected screen 1 (center)');
          updateScreenWireframes();
          isScreenControl = true;
        } else if (e.key === '3' && screenPlanes.length > 2) {
          selectedScreenIndex = 2;
          console.log('🎬 Selected screen 2 (right)');
          updateScreenWireframes();
          isScreenControl = true;
        }
      }

      // Screen adjustment (when selected)
      if (SCREEN_ALIGNMENT_MODE && SCREEN_TUNING.enabled && selectedScreenIndex >= 0 && selectedScreenIndex < screenPlanes.length) {
        const screen = screenPlanes[selectedScreenIndex];
        const posStep = e.altKey
          ? SCREEN_TUNING.finePositionStep
          : e.shiftKey && e.key !== '-' && e.key !== '_' && e.key !== '=' && e.key !== '+'
            ? SCREEN_TUNING.largePositionStep
            : SCREEN_TUNING.positionStep;
        const rotStep = SCREEN_TUNING.rotationStep;
        const scaleStep = SCREEN_TUNING.scaleStep;

        switch (e.key) {
          case 'i':
          case 'I':
            screen.position.y += posStep;
            isScreenControl = true;
            break;
          case 'k':
          case 'K':
            screen.position.y -= posStep;
            isScreenControl = true;
            break;
          case 'j':
          case 'J':
            screen.position.x -= posStep;
            isScreenControl = true;
            break;
          case 'l':
          case 'L':
            screen.position.x += posStep;
            isScreenControl = true;
            break;
          case 'u':
          case 'U':
            screen.position.z -= posStep;
            isScreenControl = true;
            break;
          case 'o':
          case 'O':
            screen.position.z += posStep;
            isScreenControl = true;
            break;

          // Rotation with Arrow keys + Z/X
          case 'ArrowLeft':
            screen.rotation.y -= rotStep;
            isScreenControl = true;
            break;
          case 'ArrowRight':
            screen.rotation.y += rotStep;
            isScreenControl = true;
            break;
          case 'ArrowUp':
            screen.rotation.x -= rotStep;
            isScreenControl = true;
            break;
          case 'ArrowDown':
            screen.rotation.x += rotStep;
            isScreenControl = true;
            break;
          case 'z':
          case 'Z':
            screen.rotation.z -= rotStep;
            isScreenControl = true;
            break;
          case 'x':
          case 'X':
            screen.rotation.z += rotStep;
            isScreenControl = true;
            break;

          // Scale with - and =
          case '-':
          case '_':
            if (e.ctrlKey) {
              screen.scale.y = Math.max(0.1, screen.scale.y - scaleStep);
            } else if (e.shiftKey) {
              screen.scale.x = Math.max(0.1, screen.scale.x - scaleStep);
            } else {
              screen.scale.x = Math.max(0.1, screen.scale.x - scaleStep);
              screen.scale.y = Math.max(0.1, screen.scale.y - scaleStep);
            }
            isScreenControl = true;
            break;
          case '=':
          case '+':
            if (e.ctrlKey) {
              screen.scale.y = Math.min(20, screen.scale.y + scaleStep);
            } else if (e.shiftKey) {
              screen.scale.x = Math.min(20, screen.scale.x + scaleStep);
            } else {
              screen.scale.x = Math.min(20, screen.scale.x + scaleStep);
              screen.scale.y = Math.min(20, screen.scale.y + scaleStep);
            }
            isScreenControl = true;
            break;
        }

        if (isScreenControl) {
          e.preventDefault();
          updateScreenWireframes();
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // CAMERA CONTROLS (unless adjusting screens)
      // ─────────────────────────────────────────────────────────────────

      if (!isScreenControl) {
        switch (e.key) {
          case 'ArrowUp':
            camera.position.addScaledVector(forward, step);
            break;
          case 'ArrowDown':
            camera.position.addScaledVector(forward, -step);
            break;
          case 'ArrowLeft':
            camera.position.addScaledVector(right, -step);
            break;
          case 'ArrowRight':
            camera.position.addScaledVector(right, step);
            break;
          case 'PageUp':
            camera.position.y += step;
            break;
          case 'PageDown':
            camera.position.y -= step;
            break;
          case 'w':
          case 'W':
            cameraLookAtTarget.y += step;
            break;
          case 's':
          case 'S':
            cameraLookAtTarget.y -= step;
            break;
          case 'a':
          case 'A':
            cameraLookAtTarget.x -= step;
            break;
          case 'd':
          case 'D':
            cameraLookAtTarget.x += step;
            break;
          case 'q':
          case 'Q':
            cameraLookAtTarget.z -= step;
            break;
          case 'e':
          case 'E':
            cameraLookAtTarget.z += step;
            break;
          case '[':
            camera.fov = Math.max(10, camera.fov - fovStep);
            camera.updateProjectionMatrix();
            break;
          case ']':
            camera.fov = Math.min(120, camera.fov + fovStep);
            camera.updateProjectionMatrix();
            break;
          case 'p':
          case 'P':
            printCameraAndScreenPreset();
            break;
        }
      }

      camera.lookAt(
        cameraLookAtTarget.x,
        cameraLookAtTarget.y,
        cameraLookAtTarget.z
      );
    });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CAMERA PRESET MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════════

  function getCameraState() {
    return {
      position: camera.position.clone(),
      lookAt: cameraLookAtTarget,
      fov: camera.fov,
      near: camera.near,
      far: camera.far
    };
  }

  function setCameraState(state) {
    if (state.position) {
      camera.position.copy(state.position);
    }
    if (state.lookAt) {
      cameraLookAtTarget = { ...state.lookAt };
    }
    if (state.fov) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(cameraLookAtTarget.x, cameraLookAtTarget.y, cameraLookAtTarget.z);
  }

  function getScreenConfig() {
    return {
      enabled: SCREEN_CONFIG.enabled,
      opacity: SCREEN_CONFIG.opacity,
      brightness: SCREEN_CONFIG.brightness,
      positions: screenPlanes.map((plane) => ({ x: plane.position.x, y: plane.position.y, z: plane.position.z })),
      rotations: screenPlanes.map((plane) => ({ x: plane.rotation.x, y: plane.rotation.y, z: plane.rotation.z })),
      scales: screenPlanes.map((plane) => ({ x: plane.scale.x, y: plane.scale.y }))
    };
  }

  function setScreenConfig(config) {
    const normalized = Array.isArray(config)
      ? {
        positions: config.map((cfg) => cfg.position),
        rotations: config.map((cfg) => cfg.rotation),
        scales: config.map((cfg) => cfg.scale)
      }
      : config;

    if (!normalized || !Array.isArray(normalized.positions) || normalized.positions.length !== screenPlanes.length) {
      console.warn('Screen config length mismatch');
      return;
    }

    screenPlanes.forEach((plane, i) => {
      const position = normalized.positions && normalized.positions[i];
      const rotation = normalized.rotations && normalized.rotations[i];
      const scale = normalized.scales && normalized.scales[i];
      if (position) plane.position.set(position.x, position.y, position.z);
      if (rotation) plane.rotation.set(rotation.x, rotation.y, rotation.z);
      if (scale) plane.scale.set(scale.x, scale.y, 1);
    });

    updateScreenWireframes();
  }

  function formatVec2(vec) {
    return `{ x: ${vec.x.toFixed(3)}, y: ${vec.y.toFixed(3)} }`;
  }

  function formatVec3(vec) {
    return `{ x: ${vec.x.toFixed(3)}, y: ${vec.y.toFixed(3)}, z: ${vec.z.toFixed(3)} }`;
  }

  function formatScreenConfigBlock(config) {
    return `const SCREEN_CONFIG = {
  enabled: true,
  opacity: ${config.opacity},
  brightness: ${config.brightness},
  positions: [
    ${formatVec3(config.positions[0])},
    ${formatVec3(config.positions[1])},
    ${formatVec3(config.positions[2])}
  ],
  rotations: [
    ${formatVec3(config.rotations[0])},
    ${formatVec3(config.rotations[1])},
    ${formatVec3(config.rotations[2])}
  ],
  scales: [
    ${formatVec2(config.scales[0])},
    ${formatVec2(config.scales[1])},
    ${formatVec2(config.scales[2])}
  ]
};`;
  }

  function printScreenConfig() {
    const config = getScreenConfig();
    console.log('[MatrixScene] SCREEN_CONFIG OUTPUT:\n' + formatScreenConfigBlock(config));
    return;
    const output = `
// Copy this into SCREEN_CONFIG at the top of scene-matrix.js:
const SCREEN_CONFIG = {
  enabled: true,
  opacity: ${SCREEN_CONFIG.opacity},
  brightness: ${SCREEN_CONFIG.brightness},
  positions: [
    { x: ${config[0].position.x.toFixed(3)}, y: ${config[0].position.y.toFixed(3)}, z: ${config[0].position.z.toFixed(3)} },
    { x: ${config[1].position.x.toFixed(3)}, y: ${config[1].position.y.toFixed(3)}, z: ${config[1].position.z.toFixed(3)} },
    { x: ${config[2].position.x.toFixed(3)}, y: ${config[2].position.y.toFixed(3)}, z: ${config[2].position.z.toFixed(3)} }
  ],
  rotations: [
    { x: ${config[0].rotation.x.toFixed(3)}, y: ${config[0].rotation.y.toFixed(3)}, z: ${config[0].rotation.z.toFixed(3)} },
    { x: ${config[1].rotation.x.toFixed(3)}, y: ${config[1].rotation.y.toFixed(3)}, z: ${config[1].rotation.z.toFixed(3)} },
    { x: ${config[2].rotation.x.toFixed(3)}, y: ${config[2].rotation.y.toFixed(3)}, z: ${config[2].rotation.z.toFixed(3)} }
  ],
  scales: [
    { x: ${config[0].scale.x.toFixed(3)}, y: ${config[0].scale.y.toFixed(3)} },
    { x: ${config[1].scale.x.toFixed(3)}, y: ${config[1].scale.y.toFixed(3)} },
    { x: ${config[2].scale.x.toFixed(3)}, y: ${config[2].scale.y.toFixed(3)} }
  ]
};
`;
    console.log('📺 SCREEN CONFIG OUTPUT:\n' + output);
  }

  function printCameraAndScreenPreset() {
    const state = getCameraState();
    const output = `
// Camera preset reference only. Do not paste this unless retuning camera:
const CAMERA_PRESET = {
  position: { x: ${state.position.x.toFixed(3)}, y: ${state.position.y.toFixed(3)}, z: ${state.position.z.toFixed(3)} },
  lookAt: { x: ${state.lookAt.x.toFixed(3)}, y: ${state.lookAt.y.toFixed(3)}, z: ${state.lookAt.z.toFixed(3)} },
  fov: ${state.fov.toFixed(1)},
  near: ${state.near},
  far: ${state.far}
};
`;
    console.log('📷 CAMERA PRESET OUTPUT:\n' + output);
    printScreenConfig();
  }

  function makeScreenConfigFromCandidates(candidates) {
    const picked = candidates.slice(0, 3);
    if (picked.length < 3) {
      console.warn(`[MatrixScene] Need 3 candidate meshes, found ${picked.length}`);
      return null;
    }

    const positions = [];
    const rotations = [];
    const scales = [];

    picked.forEach((candidate) => {
      const center = candidate.boundingBoxCenter.clone();
      let normal = candidate.normal.clone();
      if (camera && camera.position.clone().sub(center).dot(normal) < 0) {
        normal.multiplyScalar(-1);
      }
      center.addScaledVector(normal, SCREEN_SURFACE_OFFSET);

      positions.push({ x: center.x, y: center.y, z: center.z });
      rotations.push({
        x: candidate.worldRotation.x,
        y: candidate.worldRotation.y,
        z: candidate.worldRotation.z
      });

      const dims = [candidate.boundingBoxSize.x, candidate.boundingBoxSize.y, candidate.boundingBoxSize.z]
        .sort((a, b) => b - a);
      scales.push({
        x: Math.max(0.1, dims[0]),
        y: Math.max(0.1, dims[1])
      });
    });

    return {
      enabled: true,
      opacity: SCREEN_CONFIG.opacity,
      brightness: SCREEN_CONFIG.brightness,
      positions,
      rotations,
      scales
    };
  }

  function suggestScreenConfigFromMeshes() {
    const candidates = collectCandidateScreenMeshes();
    suggestedScreenConfig = makeScreenConfigFromCandidates(candidates);

    if (suggestedScreenConfig) {
      console.log('[MatrixScene] Suggested from candidates:', candidates.slice(0, 3).map((candidate) => ({
        name: candidate.name,
        position: vecToPlain(candidate.worldPosition),
        center: vecToPlain(candidate.boundingBoxCenter)
      })));
      console.log('[MatrixScene] SUGGESTED SCREEN_CONFIG:\n' + formatScreenConfigBlock(suggestedScreenConfig));
    }

    return suggestedScreenConfig;
  }

  function applySuggestedScreenConfig() {
    if (!suggestedScreenConfig) {
      suggestScreenConfigFromMeshes();
    }
    if (!suggestedScreenConfig) return false;

    setScreenConfig(suggestedScreenConfig);
    printScreenConfig();
    return true;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER LOOP & UTILITIES
  // ═════════════════════════════════════════════════════════════════════════════

  function startLoop() {
    function animate() {
      rafId = requestAnimationFrame(animate);

      if (!isVisible) {
        return;
      }

      time += 1 / 60;

      // Update mouse parallax
      const targetParallaxPos = {
        x: mouseX * PARALLAX_AMOUNT,
        y: -mouseY * PARALLAX_AMOUNT * 0.5,
        z: 0
      };
      parallaxOffsetPos.x += (targetParallaxPos.x - parallaxOffsetPos.x) * PARALLAX_DAMPING;
      parallaxOffsetPos.y += (targetParallaxPos.y - parallaxOffsetPos.y) * PARALLAX_DAMPING;

      // Apply parallax to camera
      camera.position.x = CAMERA_PRESET.position.x + parallaxOffsetPos.x;
      camera.position.y = CAMERA_PRESET.position.y + parallaxOffsetPos.y;
      camera.position.z = CAMERA_PRESET.position.z + parallaxOffsetPos.z;
      camera.lookAt(
        cameraLookAtTarget.x,
        cameraLookAtTarget.y,
        cameraLookAtTarget.z
      );

      // Render
      renderer.render(scene, camera);
    }

    animate();
  }

  function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═════════════════════════════════════════════════════════════════════════════

  window.__matrixScene = {
    setVisible(visible) {
      isVisible = visible;
      canvas.style.display = visible ? 'block' : 'none';
      if (visible && !rafId) {
        startLoop();
      }
    },

    getCamera() {
      return camera;
    },

    getScene() {
      return scene;
    },

    getCameraState,
    setCameraState,
    printCameraAndScreenPreset,

    getScreenConfig,
    setScreenConfig,
    printScreenConfig,
    inspectModelMeshes,
    selectScreen,
    nudgeSelectedScreen,
    suggestScreenConfigFromMeshes,
    applySuggestedScreenConfig
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // START
  // ═════════════════════════════════════════════════════════════════════════════

  init();
})();
