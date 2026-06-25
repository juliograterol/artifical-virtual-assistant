"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Object3D({
  src,
  scale = 1,
}: {
  src: string;
  scale?: number;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(50, 10, 5);
    scene.add(directional);

    // Debug helper (optional but useful)
    // const axes = new THREE.AxesHelper(2);
    // scene.add(axes);

    const loader = new GLTFLoader();
    let model: THREE.Object3D | null = null;

    loader.load(
      src,
      (gltf) => {
        model = gltf.scene;

        scene.add(model);

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center the model
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        // Fit camera to object
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        cameraZ *= 1.5; // add padding
        camera.position.z = cameraZ;

        const minZ = box.min.z;
        const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

        camera.far = cameraToFarEdge * 3;
        camera.updateProjectionMatrix();

        camera.lookAt(0, 0, 0);

        // Optional scale prop
        model.scale.multiplyScalar(scale);
      },
      undefined,
      (error) => {
        console.error(`Error loading ${src}:`, error);
      },
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (model) {
        model.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;

      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [src, scale]);

  return (
    <div
      ref={mountRef}
      className="absolute top-0 left-0 w-full h-full"
      // style={{
      //   width: "100%",
      //   height: "400px",
      // }}
    />
  );
}
