import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const fragment = `
precision highp float;

uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uNoiseScale;
uniform vec2 uResolution; // Added resolution uniform

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    
    // Adjust UV for aspect ratio to maintain fixed size of grain/warps
    vec2 correctUv = uv;
    correctUv.x *= uResolution.x / uResolution.y;

    // Domain warping
    float noise1 = snoise(correctUv * uWarpFrequency + uTime * uWarpSpeed);
    vec2 warpedUv = correctUv + vec2(noise1) * uWarpAmplitude * 0.01;
    
    // Gradient generation
    float n = snoise(warpedUv * uNoiseScale + uTime * 0.2);
    
    vec3 color = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, n));
    color = mix(color, uColor3, smoothstep(0.0, 1.0, n * noise1));
    
    // Grain
    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453));
    color += (grain - 0.5) * uGrainAmount;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const Grainient = ({
    color1 = "#ffffff",
    color2 = "#ffc370",
    color3 = "#f5eedb",
    timeSpeed = 0.25,
    warpStrength = 1,
    warpFrequency = 5,
    warpSpeed = 2,
    warpAmplitude = 50,
    noiseScale = 2,
    grainAmount = 0.1,
    className
}) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const programRef = useRef(null);
    const meshRef = useRef(null);
    const animationIdRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({
            alpha: true,
            dpr: Math.min(window.devicePixelRatio, 2)
        });
        rendererRef.current = renderer;

        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new Color(color1) },
                uColor2: { value: new Color(color2) },
                uColor3: { value: new Color(color3) },
                uWarpStrength: { value: warpStrength },
                uWarpFrequency: { value: warpFrequency },
                uWarpSpeed: { value: warpSpeed },
                uWarpAmplitude: { value: warpAmplitude },
                uGrainAmount: { value: grainAmount },
                uNoiseScale: { value: noiseScale },
                uResolution: { value: [gl.canvas.width, gl.canvas.height] }
            },
        });
        programRef.current = program;

        const mesh = new Mesh(gl, { geometry, program });
        meshRef.current = mesh;

        const resize = () => {
            if (containerRef.current) {
                renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
                program.uniforms.uResolution.value = [
                    containerRef.current.offsetWidth * renderer.dpr,
                    containerRef.current.offsetHeight * renderer.dpr
                ];
            }
        };
        window.addEventListener('resize', resize);
        resize();

        let requestID;
        const update = (t) => {
            requestID = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001 * timeSpeed;
            renderer.render({ scene: mesh });
        };
        requestID = requestAnimationFrame(update);
        animationIdRef.current = requestID;

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(requestID);
            if (containerRef.current && containerRef.current.contains(gl.canvas)) {
                containerRef.current.removeChild(gl.canvas);
            }
            // Optional: dispose resources if ogl supports explicit disposal to prevent leaks
        };
    }, []); // Re-init if big structural changes, but usually we just update uniforms

    // Update uniforms when props change
    useEffect(() => {
        if (programRef.current) {
            const uniforms = programRef.current.uniforms;
            uniforms.uColor1.value = new Color(color1);
            uniforms.uColor2.value = new Color(color2);
            uniforms.uColor3.value = new Color(color3);
            uniforms.uWarpStrength.value = warpStrength;
            uniforms.uWarpFrequency.value = warpFrequency;
            uniforms.uWarpSpeed.value = warpSpeed;
            uniforms.uWarpAmplitude.value = warpAmplitude;
            uniforms.uGrainAmount.value = grainAmount;
            uniforms.uNoiseScale.value = noiseScale;
        }
    }, [color1, color2, color3, warpStrength, warpFrequency, warpSpeed, warpAmplitude, grainAmount, noiseScale]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden ${className || ''}`}
        />
    );
};

export default Grainient;
