import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const GalaxyScene = ({
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1,
  glowIntensity = 0.45,
  saturation = 0,
  mouseRepulsion = false,
  repulsionStrength = 1.5,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = false,
}) => {
  const pointsRef = useRef();
  const { viewport, camera, mouse } = useThree();

  // Ensure camera looks at center
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Galaxy parameters
  const parameters = useMemo(() => {
    return {
      count: Math.floor(2000 * density), // Increased base count for better visibility
      size: 0.005 * glowIntensity,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: new THREE.Color(`hsl(${hueShift}, 100%, 50%)`),
      outsideColor: new THREE.Color(`hsl(${hueShift + 40}, 100%, 60%)`),
    };
  }, [density, hueShift, glowIntensity]);

  // Generate Geometry Data
  const { positions, colors, scales, randomness } = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);
    const randomness = new Float32Array(parameters.count * 3);

    const insideColor = parameters.insideColor;
    const outsideColor = parameters.outsideColor;

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Position
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Randomness for shader animation
      randomness[i3] = Math.random();
      randomness[i3 + 1] = Math.random();
      randomness[i3 + 2] = Math.random();

      // Color
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Scale
      scales[i] = Math.random();
    }

    return { positions, colors, scales, randomness };
  }, [parameters]);

  // Shader Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSize: { value: 30 * glowIntensity * (viewport.dpr || 1) }, // Fallback for dpr
    uSpeed: { value: speed },
    uTwinkle: { value: twinkleIntensity },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uRepulsion: { value: mouseRepulsion ? repulsionStrength : 0 },
  }), [glowIntensity, viewport.dpr, speed, twinkleIntensity, mouseRepulsion, repulsionStrength]);

  useFrame((state) => {
    const { clock } = state;

    // Update uniforms
    if (pointsRef.current && pointsRef.current.material) {
      pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      pointsRef.current.material.uniforms.uMouse.value.copy(state.mouse.x, state.mouse.y, 0); // Simplified mouse tracking
    }

    // Mouse interaction - simplified projection for performance and stability
    if (mouseRepulsion && pointsRef.current && pointsRef.current.material) {
      // Map normalized mouse (-1 to 1) to world coordinates roughly at z=0
      // Camera is at z=3, fov=75. 
      // At z=0, visible height is roughly 2 * 3 * tan(75/2) ~ 4.6
      // This is an approximation
      const mouseX = state.mouse.x * (state.viewport.width / 2);
      const mouseY = state.mouse.y * (state.viewport.height / 2);
      pointsRef.current.material.uniforms.uMouse.value.set(mouseX, mouseY, 0);
    }

    // Rotate entire galaxy
    if (pointsRef.current) {
      pointsRef.current.rotation.y += rotationSpeed * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          count={randomness.length / 3}
          array={randomness}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uSize;
          uniform float uSpeed;
          uniform float uTwinkle;
          uniform vec3 uMouse;
          uniform float uRepulsion;
          
          attribute float aScale;
          attribute vec3 aRandomness;
          
          varying vec3 vColor;
          
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Rotation animation
            float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0 / distanceToCenter) * uTime * uSpeed * 0.2;
            angle += angleOffset;
            
            modelPosition.x = cos(angle) * distanceToCenter;
            modelPosition.z = sin(angle) * distanceToCenter;

            // Mouse Repulsion
            float distToMouse = distance(modelPosition.xyz, uMouse);
            if (distToMouse < 3.0 && uRepulsion > 0.0) {
              vec3 dir = normalize(modelPosition.xyz - uMouse);
              modelPosition.xyz += dir * (3.0 - distToMouse) * uRepulsion * 0.2;
            }

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectionPosition;
            
            // Size
            gl_PointSize = uSize * aScale;
            gl_PointSize *= (1.0 / -viewPosition.z);
            
            // Twinkle
            float twinkle = sin(uTime * 5.0 + aRandomness.x * 100.0) * uTwinkle;
            gl_PointSize += gl_PointSize * twinkle;

            vColor = color;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            // Circular particle with soft edge
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 10.0);
            
            if (strength < 0.01) discard; // Optimization
            
            vec3 finalColor = vColor;
            gl_FragColor = vec4(finalColor, strength);
          }
        `}
      />
    </points>
  );
};

const Galaxy = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none', ...props.style }}>
      <Canvas
        camera={{ position: [0, 3, 3], fov: 75 }}
        style={{ background: props.transparent ? 'transparent' : '#000' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]} // Support high DPI
      >
        <GalaxyScene {...props} />
      </Canvas>
    </div>
  );
};

export default Galaxy;
