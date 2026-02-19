import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const LightPillar = ({
    topColor = "#E0E0E0", // Silver
    bottomColor = "#FFD700", // Yellow/Gold
    intensity = 1.0,
    rotationSpeed = 0.5,
    glowAmount = 1.0,
    pillarWidth = 2.0,
    pillarHeight = 0.8,
    noiseIntensity = 0.5,
    pillarRotation = 0,
    interactive = false,
    mixBlendMode = "normal", // Screen can sometimes wash out on certain backgrounds, 'normal' or 'add' safer
    quality = "high",
    className
}) => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const materialRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        // No background color, transparency handled by renderer
        sceneRef.current = scene;

        const width = mountRef.current.offsetWidth;
        const height = mountRef.current.offsetHeight;

        // Orthographic camera for 2D-like shader control
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: quality === "high" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- SHADER ---
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

        // A reliable, visible pillar shader
        const fragmentShader = `
      uniform float uTime;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uPillarRotation;
      uniform vec2 uResolution;

      varying vec2 vUv;

      // Simple pseudo-random
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      // Value Noise
      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
          // 1. Normalize UVs (Center 0,0)
          vec2 uv = vUv - 0.5;
          
          // 2. Fix Aspect Ratio (Keep pillar width consistent)
          float aspect = uResolution.x / uResolution.y;
          uv.x *= aspect;

          // 3. Rotation
          float angle = radians(uPillarRotation);
          float c = cos(angle);
          float s = sin(angle);
          mat2 rot = mat2(c, -s, s, c);
          uv = rot * uv;

          // 4. Vertical Noise Flow
          // Scale UVs for noise texture
          vec2 noiseUV = uv * vec2(2.0, 1.0); 
          noiseUV.y -= uTime * 0.5; // Upward flow
          float n = noise(noiseUV * 5.0); 

          // 5. Pillar Shape
          // Horizontal distance from center
          float xDist = abs(uv.x);
          
          // Add some waviness using the noise
          xDist += (n - 0.5) * 0.05 * uPillarWidth; 

          // Brightness falloff (1/x style for glow)
          float brightness = (0.01 * uPillarWidth) / (xDist + 0.001);
          
          // Soft clamp to prevent infinite brightness but keep it punchy
          brightness = clamp(brightness, 0.0, 5.0);
          
          // 6. Vertical Fade
          // Fade out towards top and bottom
          float yDist = abs(uv.y);
          float vFade = smoothstep(uPillarHeight, 0.0, yDist);
          
          // 7. Combine
          float alpha = brightness * vFade * uIntensity;
          
          // 8. Color Gradient (Top/Bottom mixed by screen Y)
          vec3 color = mix(uBottomColor, uTopColor, vUv.y);
          
          // Apply noise texture to color slightly
          color += n * 0.1;

          gl_FragColor = vec4(color, alpha);
      }
    `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uTopColor: { value: new THREE.Color(topColor) },
                uBottomColor: { value: new THREE.Color(bottomColor) },
                uIntensity: { value: intensity },
                uPillarWidth: { value: pillarWidth },
                uPillarHeight: { value: pillarHeight },
                uPillarRotation: { value: pillarRotation },
                uResolution: { value: new THREE.Vector2(width, height) }
            },
            transparent: true,
            blending: THREE.AdditiveBlending, // Key for "light" effect
            depthWrite: false,
        });
        materialRef.current = material;

        // --- GEOMETRY ---
        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // --- ANIMATION ---
        const animate = (time) => {
            frameRef.current = requestAnimationFrame(animate);
            if (materialRef.current) {
                materialRef.current.uniforms.uTime.value = time * 0.001 * rotationSpeed;
            }
            renderer.render(scene, camera);
        };
        animate(0);

        // --- RESIZE ---
        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.offsetWidth;
            const h = mountRef.current.offsetHeight;
            if (w === 0 || h === 0) return;

            renderer.setSize(w, h);
            if (materialRef.current) {
                materialRef.current.uniforms.uResolution.value.set(w, h);
            }
        };
        window.addEventListener('resize', handleResize);
        // Force initial resize check in case of layout shifts
        setTimeout(handleResize, 100);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameRef.current);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []); // Re-run if totally unmounted

    // Update props without re-creating scene
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTopColor.value.set(topColor);
            materialRef.current.uniforms.uBottomColor.value.set(bottomColor);
            materialRef.current.uniforms.uIntensity.value = intensity;
            materialRef.current.uniforms.uPillarWidth.value = pillarWidth;
            materialRef.current.uniforms.uPillarHeight.value = pillarHeight;
            materialRef.current.uniforms.uPillarRotation.value = pillarRotation;
        }
    }, [topColor, bottomColor, intensity, pillarWidth, pillarHeight, pillarRotation]);

    return (
        <div
            ref={mountRef}
            className={className}
            style={{
                width: '100%',
                height: '100%',
                mixBlendMode: mixBlendMode
            }}
        />
    );
};

export default LightPillar;
