"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface UfoOverlayProps {
  count: number;
}

interface UfoData {
  group: THREE.Group;
  velocity: THREE.Vector3;
  rotSpeed: number;
  bobOffset: number;
}

export default function UfoOverlay({ count }: UfoOverlayProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ufosRef = useRef<UfoData[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  // Create a single UFO group
  const createUfo = () => {
    const rootStyle = getComputedStyle(document.documentElement);
    const accentColorStr = rootStyle.getPropertyValue("--accent").trim();
    const accentColor = new THREE.Color(accentColorStr || "#802EE9");

    const ufoGroup = new THREE.Group();
    const glowMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.3, 8, 24), darkMat);
    ring.rotation.x = Math.PI / 2;

    const lights = [
      [1.5, 0, 0],
      [-1.5, 0, 0],
      [0, 0, 1.5],
      [0, 0, -1.5],
    ].map(([x, y, z]) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.3), glowMat);
      s.position.set(x, y, z);
      return s;
    });

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8), glowMat);
    ufoGroup.add(ring, dome, ...lights);

    // Smaller size
    ufoGroup.scale.set(0.25, 0.25, 0.25);
    return ufoGroup;
  };

  const getBounds = (camera: THREE.PerspectiveCamera, zDepth: number) => {
    const distance = camera.position.z - zDepth;
    const vFovRad = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFovRad / 2) * distance;
    const visibleWidth = visibleHeight * camera.aspect;

    // Convert 32px margin to world units
    const unitsPerPixel = visibleHeight / window.innerHeight;
    const marginUnits = 24 * unitsPerPixel;
    const ufoRadius = 0.5;

    return {
      x: visibleWidth / 2 - marginUnits - ufoRadius,
      y: visibleHeight / 2 - marginUnits - ufoRadius,
    };
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const generateUfo = () => {
      const obj = createUfo();
      obj.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3,
        0
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        0
      );
      const rotSpeed = 0.005 + Math.random() * 0.01;
      const bobOffset = Math.random() * 1000;

      scene.add(obj);
      return { group: obj, velocity, rotSpeed, bobOffset };
    };

    ufosRef.current = Array.from({ length: count }, generateUfo);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const bounds = getBounds(camera, 0);
      const time = Date.now();

      ufosRef.current.forEach((ufo) => {
        ufo.group.position.add(ufo.velocity);
        ufo.group.rotation.y += ufo.rotSpeed;
        ufo.group.rotation.x = Math.sin((time + ufo.bobOffset) * 0.002) * 0.2;
        ufo.group.rotation.z = Math.cos((time + ufo.bobOffset) * 0.002) * 0.1;

        const p = ufo.group.position;
        const v = ufo.velocity;

        if (p.x > bounds.x) { p.x = bounds.x; v.x *= -1; }
        else if (p.x < -bounds.x) { p.x = -bounds.x; v.x *= -1; }
        if (p.y > bounds.y) { p.y = bounds.y; v.y *= -1; }
        else if (p.y < -bounds.y) { p.y = -bounds.y; v.y *= -1; }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rend = rendererRef.current;
      const cam = cameraRef.current;
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      rend.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frameIdRef.current!);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [count]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1998 }}
    />
  );
}
