"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <Sphere args={[2.5, 64, 64]} ref={meshRef}>
            <meshStandardMaterial
                color="#1E3A8A" // Deep Blue
                emissive="#1E3A8A"
                emissiveIntensity={0.2}
                roughness={0.7}
                wireframe={true} // Sci-fi wireframe look
                wireframeLinewidth={1.5}
            />
        </Sphere>
    );
}

function CityMarkers() {
    const cities = useMemo(() => {
        return [
            { name: "NY", lat: 40.7128, lng: -74.0060, color: "#10B981" }, // New York
            { name: "LDN", lat: 51.5074, lng: -0.1278, color: "#3B82F6" }, // London
            { name: "TKY", lat: 35.6762, lng: 139.6503, color: "#EF4444" }, // Tokyo
            { name: "HK", lat: 22.3193, lng: 114.1694, color: "#F59E0B" }, // Hong Kong
            { name: "SGP", lat: 1.3521, lng: 103.8198, color: "#8B5CF6" }, // Singapore
        ];
    }, []);

    return (
        <group rotation={[0, 0, 0]}>
            {cities.map((city, i) => {
                // Convert lat/lng to 3D position
                const phi = (90 - city.lat) * (Math.PI / 180);
                const theta = (city.lng + 180) * (Math.PI / 180);
                const r = 2.55; // Slightly larger than earth
                const x = -(r * Math.sin(phi) * Math.cos(theta));
                const z = r * Math.sin(phi) * Math.sin(theta);
                const y = r * Math.cos(phi);

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color={city.color} />
                    </mesh>
                );
            })}
        </group>
    );
}

export function Globe() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full opacity-40">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Earth />
                <CityMarkers />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
