import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface CryptoSceneProps {
  width?: number;
  height?: number;
  rotationSpeed?: number;
}

const CryptoScene = ({
  width = 1200,
  height = 600,
  rotationSpeed = 0.01,
}: CryptoSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coinsRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create Bitcoin
    const bitcoinGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const bitcoinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7931a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const bitcoin = new THREE.Mesh(bitcoinGeometry, bitcoinMaterial);
    bitcoin.position.x = -2.5;

    // Bitcoin logo
    const btcLogoGroup = new THREE.Group();
    btcLogoGroup.position.set(-2.5, 0, 0.16);

    // Base circle
    const btcLogoBase = new THREE.Mesh(
      new THREE.CircleGeometry(0.8, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    btcLogoBase.rotation.x = -Math.PI / 2;

    // Bitcoin symbol parts
    const btcSymbol = new THREE.Group();

    // Vertical line
    const verticalLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.8, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xf7931a }),
    );
    verticalLine.position.z = 0.02;

    // Top horizontal line
    const topLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.15, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xf7931a }),
    );
    topLine.position.set(0.1, 0.3, 0.02);

    // Bottom horizontal line
    const bottomLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.15, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xf7931a }),
    );
    bottomLine.position.set(0.1, -0.3, 0.02);

    btcSymbol.add(verticalLine, topLine, bottomLine);
    btcLogoGroup.add(btcLogoBase, btcSymbol);

    // Create Ethereum
    const ethereumGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const ethereumMaterial = new THREE.MeshStandardMaterial({
      color: 0x627eea,
      metalness: 0.7,
      roughness: 0.3,
    });
    const ethereum = new THREE.Mesh(ethereumGeometry, ethereumMaterial);
    ethereum.position.x = 2.5;

    // Ethereum logo
    const ethLogoGroup = new THREE.Group();
    ethLogoGroup.position.set(2.5, 0, 0.16);

    // Create diamond shape for ETH logo
    const ethShape = new THREE.Shape();
    ethShape.moveTo(0, 0.6);
    ethShape.lineTo(0.4, 0);
    ethShape.lineTo(0, -0.6);
    ethShape.lineTo(-0.4, 0);
    ethShape.lineTo(0, 0.6);

    const ethLogo = new THREE.Mesh(
      new THREE.ShapeGeometry(ethShape),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    ethLogo.rotation.x = -Math.PI / 2;
    ethLogoGroup.add(ethLogo);

    // Add everything to the scene
    coinsRef.current.add(bitcoin, btcLogoGroup, ethereum, ethLogoGroup);
    scene.add(coinsRef.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      coinsRef.current.rotation.y += rotationSpeed;
      bitcoin.rotation.y -= rotationSpeed * 2;
      ethereum.rotation.y -= rotationSpeed * 2;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(coinsRef.current);
      bitcoinGeometry.dispose();
      bitcoinMaterial.dispose();
      ethereumGeometry.dispose();
      ethereumMaterial.dispose();
      renderer.dispose();
    };
  }, [width, height, rotationSpeed]);

  return (
    <div
      ref={mountRef}
      className="bg-[#1A1A1A] rounded-lg overflow-hidden"
      style={{ width, height }}
    />
  );
};

export default CryptoScene;
