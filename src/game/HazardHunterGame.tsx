import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './audio.ts';

interface HazardHunterGameProps {
  onExit: () => void;
}

type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

interface HazardSpot {
  id: string;
  type: 'trench' | 'gas_pipe' | 'crane_zone' | 'guardrail';
  name: string;
  x: number;
  z: number;
  radius: number;
  resolved: boolean;
  meshGroup?: THREE.Group;
  unresolvedMesh?: THREE.Mesh;
  resolvedMesh?: THREE.Mesh;
  telegraphMesh?: THREE.Mesh;
}

export const HazardHunterGame: React.FC<HazardHunterGameProps> = ({ onExit }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [score, setScore] = useState(0);
  const [hazardsResolved, setHazardsResolved] = useState(0);
  const [safetyRating, setSafetyRating] = useState(72);
  const [timeRemaining, setTimeRemaining] = useState(75);
  const [scannerStrength, setScannerStrength] = useState(0);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Mutable refs for zero-overhead animation loop
  const stateRef = useRef({
    gameState: 'title' as GameState,
    score: 0,
    hazardsResolved: 0,
    safetyRating: 72,
    timeRemaining: 75,
    playerPos: new THREE.Vector3(0, 0, 5),
    playerVelocity: new THREE.Vector3(),
    playerHeading: 0,
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      spaceJustPressed: false,
    },
    cameraShake: 0,
    hitstop: 0,
    craneAngle: 0,
  });

  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    sound.isMuted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1726);
    scene.fog = new THREE.FogExp2(0x0e1726, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    keyLight.position.set(20, 35, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 100;
    const d = 30;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x7c839b, 0x1f293d, 0.8);
    scene.add(hemiLight);

    // --- PROCEDURAL GROUND TERRAIN ---
    const groundGeo = new THREE.PlaneGeometry(80, 80, 20, 20);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e, // Mud/soil
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Gravel pathway
    const pathGeo = new THREE.PlaneGeometry(8, 70);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x5a544d,
      roughness: 0.9,
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(-6, 0.01, 0);
    path.receiveShadow = true;
    scene.add(path);

    // Deep trench excavation excavation zone
    const trenchGeo = new THREE.BoxGeometry(6, 2.2, 16);
    const trenchMat = new THREE.MeshStandardMaterial({
      color: 0x241d17,
      roughness: 1.0,
    });
    const trench = new THREE.Mesh(trenchGeo, trenchMat);
    trench.position.set(8, -1.0, 2);
    scene.add(trench);

    // Concrete slabs around site
    for (let i = 0; i < 4; i++) {
      const slabGeo = new THREE.BoxGeometry(4.5, 0.2, 4.5);
      const slabMat = new THREE.MeshStandardMaterial({ color: 0x7c828d, roughness: 0.8 });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(-18 + i * 5, 0.1, -12);
      slab.receiveShadow = true;
      scene.add(slab);
    }

    // --- PROCEDURAL TOWER CRANE (Composite Group: 7 parts) ---
    const craneGroup = new THREE.Group();
    craneGroup.position.set(16, 0, -12);

    // 1. Base mast
    const mastGeo = new THREE.CylinderGeometry(0.6, 0.8, 16, 6);
    const craneYellowMat = new THREE.MeshStandardMaterial({ color: 0xfea619, metalness: 0.6, roughness: 0.4 });
    const mast = new THREE.Mesh(mastGeo, craneYellowMat);
    mast.position.y = 8;
    mast.castShadow = true;
    craneGroup.add(mast);

    // 2. Cab & slewing ring
    const cabGeo = new THREE.BoxGeometry(2, 2.2, 2.5);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x131b2e, metalness: 0.8, roughness: 0.3 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 16.5, 0);
    craneGroup.add(cab);

    // 3. Rotating Jib Group
    const jibGroup = new THREE.Group();
    jibGroup.position.set(0, 17, 0);

    const jibGeo = new THREE.BoxGeometry(0.8, 0.8, 22);
    const jib = new THREE.Mesh(jibGeo, craneYellowMat);
    jib.position.set(0, 0, 7);
    jib.castShadow = true;
    jibGroup.add(jib);

    // Winch hook
    const hookGeo = new THREE.CylinderGeometry(0.05, 0.05, 7);
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const cable = new THREE.Mesh(hookGeo, cableMat);
    cable.position.set(0, -3.5, 12);
    jibGroup.add(cable);

    craneGroup.add(jibGroup);
    scene.add(craneGroup);

    // Crane Danger Circle Projection on ground
    const dangerRingGeo = new THREE.RingGeometry(10, 11, 32);
    const dangerRingMat = new THREE.MeshBasicMaterial({
      color: 0xba1a1a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const dangerRing = new THREE.Mesh(dangerRingGeo, dangerRingMat);
    dangerRing.rotation.x = -Math.PI / 2;
    dangerRing.position.set(16, 0.03, -12);
    scene.add(dangerRing);

    // --- PROCEDURAL EXCAVATOR (Composite: 6 parts) ---
    const excavatorGroup = new THREE.Group();
    excavatorGroup.position.set(-14, 0, 8);

    const trackGeo = new THREE.BoxGeometry(3.5, 0.9, 5);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const tracks = new THREE.Mesh(trackGeo, trackMat);
    tracks.position.y = 0.45;
    tracks.castShadow = true;
    excavatorGroup.add(tracks);

    const bodyGeo = new THREE.BoxGeometry(3.2, 2.2, 3.8);
    const excavatorBody = new THREE.Mesh(bodyGeo, craneYellowMat);
    excavatorBody.position.set(0, 2, 0);
    excavatorBody.castShadow = true;
    excavatorGroup.add(excavatorBody);

    const boomGeo = new THREE.BoxGeometry(0.6, 0.6, 6);
    const boom = new THREE.Mesh(boomGeo, craneYellowMat);
    boom.position.set(0, 3.5, 3.5);
    boom.rotation.x = -Math.PI / 4;
    boom.castShadow = true;
    excavatorGroup.add(boom);

    scene.add(excavatorGroup);

    // --- PLAYER AVATAR (Site Inspector: 6 parts) ---
    const playerGroup = new THREE.Group();
    playerGroup.position.copy(stateRef.current.playerPos);

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.3, 0.25, 0.5);
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const leftBoot = new THREE.Mesh(bootGeo, bootMat);
    leftBoot.position.set(-0.25, 0.12, 0);
    const rightBoot = new THREE.Mesh(bootGeo, bootMat);
    rightBoot.position.set(0.25, 0.12, 0);
    playerGroup.add(leftBoot, rightBoot);

    // Dark trousers
    const legGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9);
    const trouserMat = new THREE.MeshStandardMaterial({ color: 0x131b2e });
    const legs = new THREE.Mesh(legGeo, trouserMat);
    legs.position.y = 0.7;
    legs.castShadow = true;
    playerGroup.add(legs);

    // High-vis orange vest torso
    const torsoGeo = new THREE.BoxGeometry(0.85, 1.1, 0.55);
    const vestMat = new THREE.MeshStandardMaterial({
      color: 0xfea619,
      roughness: 0.5,
      metalness: 0.1,
    });
    const torso = new THREE.Mesh(torsoGeo, vestMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    playerGroup.add(torso);

    // Silver reflective safety stripes
    const stripeGeo = new THREE.BoxGeometry(0.88, 0.12, 0.58);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 1.6;
    playerGroup.add(stripe);

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xd9a07a });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.35;
    playerGroup.add(head);

    // Yellow hard hat with brim
    const hatGeo = new THREE.CylinderGeometry(0.36, 0.42, 0.28, 16);
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xffd000,
      roughness: 0.3,
      metalness: 0.2,
    });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 2.58;
    playerGroup.add(hat);

    // CAT scanner tool in hand
    const scannerGeo = new THREE.BoxGeometry(0.18, 0.8, 0.18);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0xfea619, roughness: 0.3 });
    const scanner = new THREE.Mesh(scannerGeo, scannerMat);
    scanner.position.set(0.55, 1.1, 0.3);
    scanner.rotation.x = Math.PI / 8;
    playerGroup.add(scanner);

    scene.add(playerGroup);

    // Contact shadow beneath player
    const shadowGeo = new THREE.CircleGeometry(0.7, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    playerGroup.add(contactShadow);

    // --- HAZARD SPOTS DATA & MESHES ---
    const hazards: HazardSpot[] = [
      {
        id: 'hz-1',
        type: 'trench',
        name: 'Deep Trench: Missing Trench Box Shoring',
        x: 8,
        z: 3,
        radius: 3.5,
        resolved: false,
      },
      {
        id: 'hz-2',
        type: 'gas_pipe',
        name: 'Unmapped Live PE Gas Pipeline (HSG47)',
        x: -3,
        z: -6,
        radius: 3.0,
        resolved: false,
      },
      {
        id: 'hz-3',
        type: 'guardrail',
        name: 'Unprotected Excavation Edge',
        x: 8,
        z: -4,
        radius: 3.2,
        resolved: false,
      },
      {
        id: 'hz-4',
        type: 'crane_zone',
        name: 'Crane Swing Pinch-Point Exclusion Zone',
        x: 16,
        z: -6,
        radius: 4.5,
        resolved: false,
      },
    ];

    hazards.forEach((h) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(h.x, 0, h.z);

      // Warning holographic beacon
      const beaconGeo = new THREE.CylinderGeometry(0.1, 0.8, 2.5, 12, 1, true);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xfea619,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 1.25;
      hGroup.add(beacon);
      h.telegraphMesh = beacon;

      // Unresolved object
      if (h.type === 'trench') {
        // Red hazard marker cone
        const coneGeo = new THREE.ConeGeometry(0.4, 1.2, 12);
        const coneMat = new THREE.MeshStandardMaterial({ color: 0xba1a1a });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = 0.6;
        hGroup.add(cone);
        h.unresolvedMesh = cone;

        // Resolved Shoring Box (initially hidden)
        const boxGeo = new THREE.BoxGeometry(4.5, 2.4, 1.2);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xfea619, metalness: 0.7, roughness: 0.3 });
        const shoringBox = new THREE.Mesh(boxGeo, boxMat);
        shoringBox.position.y = 0.2;
        shoringBox.visible = false;
        hGroup.add(shoringBox);
        h.resolvedMesh = shoringBox;
      } else if (h.type === 'gas_pipe') {
        // Exposed yellow gas pipe
        const pipeGeo = new THREE.CylinderGeometry(0.25, 0.25, 4, 16);
        const pipeMat = new THREE.MeshStandardMaterial({ color: 0xffd000, roughness: 0.3 });
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.y = 0.15;
        hGroup.add(pipe);
        h.unresolvedMesh = pipe;

        // Resolved Barrier Fence
        const barrierGeo = new THREE.BoxGeometry(4, 1.2, 0.2);
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0xfea619, roughness: 0.4 });
        const barrier = new THREE.Mesh(barrierGeo, barrierMat);
        barrier.position.y = 0.6;
        barrier.visible = false;
        hGroup.add(barrier);
        h.resolvedMesh = barrier;
      } else {
        const defaultMarkerGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
        const defaultMarkerMat = new THREE.MeshStandardMaterial({ color: 0xba1a1a });
        const marker = new THREE.Mesh(defaultMarkerGeo, defaultMarkerMat);
        marker.position.y = 0.5;
        hGroup.add(marker);
        h.unresolvedMesh = marker;
      }

      scene.add(hGroup);
      h.meshGroup = hGroup;
    });

    // --- PARTICLE BURST SYSTEM ---
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = -100; // start hidden
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push(new THREE.Vector3());
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4edea3,
      size: 0.25,
      transparent: true,
      opacity: 0.9,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const triggerParticleBurst = (x: number, y: number, z: number) => {
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        posAttr.setXYZ(i, x, y + 0.5, z);
        particleVelocities[i].set(
          (Math.random() - 0.5) * 6,
          Math.random() * 4 + 2,
          (Math.random() - 0.5) * 6
        );
      }
      posAttr.needsUpdate = true;
    };

    // --- KEYBOARD CONTROLS ---
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') stateRef.current.keys.w = true;
      if (key === 'a' || key === 'arrowleft') stateRef.current.keys.a = true;
      if (key === 's' || key === 'arrowdown') stateRef.current.keys.s = true;
      if (key === 'd' || key === 'arrowright') stateRef.current.keys.d = true;

      if (e.code === 'Space') {
        e.preventDefault();
        stateRef.current.keys.spaceJustPressed = true;
        if (stateRef.current.gameState === 'title') {
          setGameState('playing');
        }
      }

      if (e.key === 'Enter') {
        if (stateRef.current.gameState === 'title') {
          setGameState('playing');
        } else if (stateRef.current.gameState === 'gameover' || stateRef.current.gameState === 'victory') {
          // Restart
          window.location.reload();
        }
      }

      if (e.key === 'Escape') {
        if (stateRef.current.gameState === 'playing') {
          setGameState('paused');
        } else if (stateRef.current.gameState === 'paused') {
          setGameState('playing');
        }
      }

      if (key === 'm') {
        setIsMuted((prev) => !prev);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') stateRef.current.keys.w = false;
      if (key === 'a' || key === 'arrowleft') stateRef.current.keys.a = false;
      if (key === 's' || key === 'arrowdown') stateRef.current.keys.s = false;
      if (key === 'd' || key === 'arrowright') stateRef.current.keys.d = false;
    };

    const onBlur = () => {
      stateRef.current.keys.w = false;
      stateRef.current.keys.a = false;
      stateRef.current.keys.s = false;
      stateRef.current.keys.d = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- GAME LOOP ---
    let lastTime = performance.now();
    let animId: number;
    let scannerTick = 0;
    let timerTick = 0;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      // Hitstop delay check
      if (stateRef.current.hitstop > 0) {
        stateRef.current.hitstop -= dt;
        return;
      }

      const st = stateRef.current;

      // Jib rotation
      st.craneAngle += dt * 0.4;
      jibGroup.rotation.y = st.craneAngle;

      if (st.gameState === 'title') {
        // Dramatic cinematic camera orbit on Title Screen
        const t = now * 0.0003;
        camera.position.x = Math.sin(t) * 22;
        camera.position.z = Math.cos(t) * 22;
        camera.position.y = 12 + Math.sin(t * 0.5) * 3;
        camera.lookAt(0, 1.5, 0);
        renderer.render(scene, camera);
        return;
      }

      if (st.gameState === 'paused') {
        renderer.render(scene, camera);
        return;
      }

      if (st.gameState === 'playing') {
        // Timer countdown
        timerTick += dt;
        if (timerTick >= 1.0) {
          timerTick = 0;
          st.timeRemaining = Math.max(0, st.timeRemaining - 1);
          setTimeRemaining(st.timeRemaining);

          if (st.timeRemaining <= 0) {
            setGameState('gameover');
          }
        }

        // Movement input
        const speed = 7.5;
        const moveDir = new THREE.Vector3();
        if (st.keys.w) moveDir.z -= 1;
        if (st.keys.s) moveDir.z += 1;
        if (st.keys.a) moveDir.x -= 1;
        if (st.keys.d) moveDir.x += 1;

        if (moveDir.lengthSq() > 0) {
          moveDir.normalize();
          st.playerVelocity.copy(moveDir).multiplyScalar(speed);
          st.playerHeading = Math.atan2(moveDir.x, moveDir.z);

          // Subtle walking bob
          playerGroup.position.y = Math.abs(Math.sin(now * 0.012)) * 0.12;
        } else {
          st.playerVelocity.set(0, 0, 0);
          playerGroup.position.y = 0;
        }

        // Update player position
        st.playerPos.x += st.playerVelocity.x * dt;
        st.playerPos.z += st.playerVelocity.z * dt;

        // Boundaries
        st.playerPos.x = Math.max(-36, Math.min(36, st.playerPos.x));
        st.playerPos.z = Math.max(-36, Math.min(36, st.playerPos.z));

        playerGroup.position.x = st.playerPos.x;
        playerGroup.position.z = st.playerPos.z;
        playerGroup.rotation.y = st.playerHeading;

        // Camera follow with smooth damping and camera shake
        const targetCamX = st.playerPos.x;
        const targetCamZ = st.playerPos.z + 14;
        const targetCamY = 12;

        let shakeOffset = 0;
        if (st.cameraShake > 0) {
          st.cameraShake = Math.max(0, st.cameraShake - dt * 2.5);
          shakeOffset = (Math.random() - 0.5) * st.cameraShake * 0.8;
        }

        camera.position.x += (targetCamX + shakeOffset - camera.position.x) * 4 * dt;
        camera.position.z += (targetCamZ + shakeOffset - camera.position.z) * 4 * dt;
        camera.position.y += (targetCamY - camera.position.y) * 4 * dt;
        camera.lookAt(st.playerPos.x, 1.5, st.playerPos.z);

        // --- HAZARD DETECTION & CAT SCANNER RADAR ---
        let nearestDist = 999;
        let promptText: string | null = null;
        let activeHazardNearby: HazardSpot | null = null;

        hazards.forEach((h) => {
          if (h.resolved) return;

          const dist = Math.hypot(st.playerPos.x - h.x, st.playerPos.z - h.z);
          if (dist < nearestDist) {
            nearestDist = dist;
          }

          // Telegraph animation (pulse opacity)
          if (h.telegraphMesh) {
            h.telegraphMesh.rotation.y += dt * 2;
            (h.telegraphMesh.material as THREE.MeshBasicMaterial).opacity =
              0.3 + Math.sin(now * 0.008) * 0.2;
          }

          if (dist <= h.radius) {
            activeHazardNearby = h;
            promptText = `PRESS SPACE: Fix ${h.name}`;
          }
        });

        // CAT Scanner audio beeping frequency based on proximity
        const signal = Math.max(0, Math.min(100, Math.round((1 - nearestDist / 20) * 100)));
        setScannerStrength(signal);
        setActivePrompt(promptText);

        scannerTick += dt;
        const beepInterval = Math.max(0.12, 1.2 - (signal / 100) * 1.0);
        if (scannerTick >= beepInterval && signal > 25) {
          scannerTick = 0;
          sound.playScannerBeep(600 + signal * 8);
        }

        // Action Trigger (Spacebar pressed near a hazard)
        if (st.keys.spaceJustPressed) {
          st.keys.spaceJustPressed = false;

          if (activeHazardNearby) {
            const h = activeHazardNearby as HazardSpot;
            h.resolved = true;

            // Visual model transition
            if (h.unresolvedMesh) h.unresolvedMesh.visible = false;
            if (h.resolvedMesh) h.resolvedMesh.visible = true;
            if (h.telegraphMesh) h.telegraphMesh.visible = false;

            // Trigger juiciness
            sound.playActionSuccess();
            triggerParticleBurst(h.x, 1, h.z);

            st.score += 250;
            st.hazardsResolved += 1;
            st.safetyRating = Math.min(100, st.safetyRating + 7);

            setScore(st.score);
            setHazardsResolved(st.hazardsResolved);
            setSafetyRating(st.safetyRating);

            // Victory condition check
            if (st.hazardsResolved >= hazards.length) {
              setGameState('victory');
            }
          } else {
            // Scanner pulse effect
            sound.playScannerBeep(440);
          }
        }

        // Particle update
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        let particlesActive = false;
        for (let i = 0; i < particleCount; i++) {
          const py = posAttr.getY(i);
          if (py > -50) {
            particlesActive = true;
            particleVelocities[i].y -= 9.8 * dt;
            posAttr.setXYZ(
              i,
              posAttr.getX(i) + particleVelocities[i].x * dt,
              py + particleVelocities[i].y * dt,
              posAttr.getZ(i) + particleVelocities[i].z * dt
            );
          }
        }
        if (particlesActive) {
          posAttr.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1726] overflow-hidden select-none font-headline">
      {/* 3D Canvas Mount Container (isolated) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* TITLE SCREEN SHELL (30-40% negative space, bespoke inline SVG lockup) */}
      {gameState === 'title' && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 z-20 pointer-events-auto bg-gradient-to-t from-black/85 via-black/35 to-transparent">
          {/* Top Bar with CITB Accreditation Badge & Mute Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#fea619] text-[#2a1700] text-xs font-extrabold uppercase tracking-widest">
                CITB MAP 3D
              </span>
              <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">
                Interactive Site Hazard Simulation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Toggle Mute"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Exit to App
              </button>
            </div>
          </div>

          {/* Center Title Lockup (Bespoke Inline SVG) */}
          <div className="max-w-xl mx-auto flex flex-col items-center text-center">
            <svg
              className="w-full max-w-md h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              viewBox="0 0 460 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Construction warning hazard stripes */}
              <defs>
                <pattern id="hazardStripes" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="20" stroke="#fea619" strokeWidth="10" />
                  <line x1="10" y1="0" x2="10" y2="20" stroke="#131b2e" strokeWidth="10" />
                </pattern>
              </defs>
              <rect x="5" y="5" width="450" height="12" fill="url(#hazardStripes)" rx="3" />
              <text x="230" y="56" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="900" letterSpacing="-1">
                HAZARD HUNTER 3D
              </text>
              <text x="230" y="86" textAnchor="middle" fill="#ffb95f" fontSize="14" fontWeight="800" letterSpacing="4">
                SITE INSPECTION PROTOCOL
              </text>
              <rect x="5" y="96" width="450" height="8" fill="url(#hazardStripes)" rx="2" />
            </svg>

            <p className="text-white/80 text-sm max-w-md mt-4 leading-relaxed font-body">
              Take command as a certified Site Safety Manager. Scan underground utilities,
              deploy shoring boxes, prevent crane pinch hazards, and achieve zero category 1 breaches!
            </p>

            {/* Primary Start CTA Button */}
            <button
              type="button"
              onClick={() => setGameState('playing')}
              className="mt-6 px-8 py-4 rounded-2xl bg-[#fea619] hover:bg-[#ffb95f] active:scale-95 text-[#2a1700] text-base font-extrabold shadow-xl hover:shadow-[#fea619]/30 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">play_arrow</span>
              <span>START INSPECTION (ENTER / SPACE)</span>
            </button>

            {/* Flat Control Hint Line */}
            <p className="text-white/60 text-xs font-mono tracking-wider mt-4">
              WASD Move · Space Action · Esc Pause · M Mute
            </p>
          </div>

          {/* Bottom accreditation note */}
          <div className="flex justify-between items-center text-white/50 text-[11px]">
            <span>Calibrated to CITB HSG47 &amp; CDM 2015 Standards</span>
            <span>60 FPS WebGL Engine</span>
          </div>
        </div>
      )}

      {/* IN-GAME LOW-OCCLUSION HUD (>=85% unobstructed playfield) */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-10">
          {/* Top Perimeter Status Cluster */}
          <div className="flex items-start justify-between">
            {/* Left Cluster: Score & Safety Rating */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="bg-[#131b2e]/90 border border-white/10 p-2.5 px-4 rounded-xl text-white shadow-lg flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
                    Safety Rating
                  </span>
                  <span className="text-xl font-extrabold text-[#4edea3] tabular-nums">
                    {safetyRating}%
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
                    Score
                  </span>
                  <span className="text-xl font-extrabold text-white tabular-nums">
                    {score}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">
                    Cleared
                  </span>
                  <span className="text-xl font-extrabold text-[#fea619] tabular-nums">
                    {hazardsResolved}/4
                  </span>
                </div>
              </div>
            </div>

            {/* Right Cluster: Timer, CAT Signal & Controls */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Timer */}
              <div className="bg-[#131b2e]/90 border border-white/10 p-2.5 px-3.5 rounded-xl text-white shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fea619] text-[18px]">
                  timer
                </span>
                <span className="text-base font-bold font-mono tabular-nums">
                  {timeRemaining}s
                </span>
              </div>

              {/* CAT Scanner Meter */}
              <div className="bg-[#131b2e]/90 border border-white/10 p-2.5 px-3.5 rounded-xl text-white shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fea619] text-[18px]">
                  sensors
                </span>
                <div className="flex flex-col min-w-[70px]">
                  <span className="text-[9px] uppercase font-bold text-white/60">
                    CAT Signal
                  </span>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-[#fea619] rounded-full transition-all duration-100"
                      style={{ width: `${scannerStrength}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pause & Mute Buttons */}
              <button
                type="button"
                onClick={() => setGameState('paused')}
                className="w-10 h-10 rounded-xl bg-[#131b2e]/90 border border-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Pause Game"
              >
                <span className="material-symbols-outlined text-[20px]">pause</span>
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-3 h-10 rounded-xl bg-[#131b2e]/90 border border-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Bottom Action Prompt Banner (Only shows when near a hazard) */}
          <div className="flex flex-col items-center">
            {activePrompt ? (
              <div className="bg-[#fea619] text-[#2a1700] px-6 py-2.5 rounded-2xl shadow-2xl font-extrabold text-sm tracking-wide animate-bounce flex items-center gap-2 border-2 border-white pointer-events-auto">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>{activePrompt}</span>
              </div>
            ) : (
              <div className="bg-[#131b2e]/70 border border-white/10 text-white/70 px-4 py-1.5 rounded-full text-xs font-mono">
                WASD: Walk · Approach warning beacons &amp; press SPACE to deploy safety controls
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAUSE MODAL */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 z-30 pointer-events-auto">
          <div className="bg-[#131b2e] border border-white/20 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white font-headline">INSPECTION PAUSED</h3>
            <p className="text-xs text-white/70">
              Take your time to review the safety map and controls.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full py-3 rounded-xl bg-[#fea619] text-[#2a1700] font-bold text-sm hover:brightness-105 cursor-pointer"
              >
                RESUME INSPECTION
              </button>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 cursor-pointer"
              >
                EXIT TO BUILDPASS MAP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-30 pointer-events-auto animate-in zoom-in-95 duration-200">
          <div className="bg-[#131b2e] border-2 border-[#4edea3] p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="text-xl font-bold text-white font-headline">SITE AUDIT PASSED!</h3>
            <p className="text-xs text-white/80">
              All 4 high-risk statutory hazards successfully neutralized. You achieved a certified safety rating of{' '}
              <strong className="text-[#4edea3]">{safetyRating}%</strong>!
            </p>
            <div className="bg-white/5 w-full p-3 rounded-xl flex justify-around text-center my-1">
              <div>
                <span className="text-[10px] text-white/60 block uppercase">Final Score</span>
                <span className="text-lg font-bold text-white">{score}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase">Hazards Solved</span>
                <span className="text-lg font-bold text-[#fea619]">{hazardsResolved}/4</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-[#4edea3] text-[#002113] font-bold text-sm hover:brightness-105 cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 cursor-pointer"
              >
                RETURN TO MODULES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-30 pointer-events-auto">
          <div className="bg-[#131b2e] border-2 border-[#ba1a1a] p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#ba1a1a]/20 text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <h3 className="text-xl font-bold text-white font-headline">SHIFT TIME EXPIRED</h3>
            <p className="text-xs text-white/80">
              Unresolved hazards remained at the end of the shift. Always complete pre-dig scans before mechanical teeth touch ground!
            </p>
            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-[#fea619] text-[#2a1700] font-bold text-sm hover:brightness-105 cursor-pointer"
              >
                RETRY SHIFT
              </button>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 cursor-pointer"
              >
                RETURN TO MODULES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
