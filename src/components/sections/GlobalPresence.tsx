
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

export default function GlobalPresence() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Globe Geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x171717,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Points of interest (Glow dots)
    const locations = [
      { lat: 35, lon: 139 }, // Tokyo
      { lat: 48, lon: 2 },   // Paris
      { lat: 40, lon: -74 }, // NYC
      { lat: 25, lon: 55 },  // Dubai
    ];

    locations.forEach((loc) => {
      const phi = (90 - loc.lat) * (Math.PI / 180);
      const theta = (loc.lon + 180) * (Math.PI / 180);
      const dotGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x27A9E1 });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      
      dot.position.set(
        -1 * Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      globe.add(dot);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xe31837, 2);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="global" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10 order-2 lg:order-1">
          <h2 className="text-sm font-code uppercase tracking-[0.3em] text-secondary mb-6">Global Presence</h2>
          <h3 className="text-6xl md:text-8xl font-headline font-black uppercase mb-8 leading-tight">
            A Hub for <span className="text-primary italic">Innovation.</span>
          </h3>
          <p className="text-xl text-muted max-w-lg mb-12">
            Strategically positioned in the worlds most dynamic economies, 
            FourSix46 bridges the gap between raw technological advancement 
            and refined aesthetic experiences.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="text-3xl font-black block">12+</span>
              <span className="text-sm font-code uppercase text-accent">Active Cities</span>
            </div>
            <div>
              <span className="text-3xl font-black block">4</span>
              <span className="text-sm font-code uppercase text-accent">Continents</span>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="h-[600px] w-full relative order-1 lg:order-2">
          {/* Decorative gradients for depth */}
          <div className="absolute inset-0 bg-radial-gradient from-secondary/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
