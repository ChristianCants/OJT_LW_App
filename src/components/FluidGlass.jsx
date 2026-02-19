/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
    useFBO,
    useGLTF,
    useScroll,
    Image,
    Scroll,
    Preload,
    ScrollControls,
    MeshTransmissionMaterial,
    Text
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {}, fill = false, vibrant = false }) {
    const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
    const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

    const {
        navItems = [
            { label: 'Home', link: '' },
            { label: 'About', link: '' },
            { label: 'Contact', link: '' }
        ],
        ...modeProps
    } = rawOverrides;

    return (
        <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
            <Suspense fallback={null}>
                {fill ? (
                    <Wrapper modeProps={modeProps} fill={fill} vibrant={vibrant} />
                ) : (
                    <ScrollControls damping={0.2} pages={3} distance={0.4}>
                        {mode === 'bar' && <NavItems items={navItems} />}
                        <Wrapper modeProps={modeProps} vibrant={vibrant}>
                            <Scroll>
                                <Typography />
                                {/* <Images /> */}
                            </Scroll>
                            <Scroll html />
                            <Preload />
                        </Wrapper>
                    </ScrollControls>
                )}
            </Suspense>
        </Canvas>
    );
}

const ModeWrapper = memo(function ModeWrapper({
    children,
    glb,
    geometryKey,
    lockToBottom = false,
    followPointer = true,
    modeProps = {},
    vibrant = false,
    fill = false,
    ...props
}) {
    const ref = useRef();
    // const { nodes } = useGLTF(glb); // Commented out to prevent crash on missing assets
    const buffer = useFBO();
    const { viewport: vp } = useThree();
    const [scene] = useState(() => new THREE.Scene());
    const geoWidthRef = useRef(1);

    // Set initial width ref based on geometry type
    useEffect(() => {
        // Approximate width for fallback geometries
        geoWidthRef.current = 1;
    }, []);

    useFrame((state, delta) => {
        const { gl, viewport, pointer, camera } = state;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

        // Only move if NOT in fill mode
        if (!fill) {
            const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
            const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;

            if (ref.current) {
                easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

                if (modeProps.scale == null) {
                    const maxWorld = v.width * 0.9;
                    const desired = maxWorld / geoWidthRef.current;
                    ref.current.scale.setScalar(Math.min(0.15, desired));
                }
            }
        }

        gl.setRenderTarget(buffer);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        // Background Color - Dark if vibrant
        gl.setClearColor(vibrant ? 0x111111 : 0x000000, vibrant ? 1 : 0);
    });

    const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

    return (
        <>
            {createPortal(
                <group>
                    {children}
                    {vibrant && <BackgroundBlobs />}
                </group>,
                scene
            )}
            <mesh scale={[vp.width, vp.height, 1]}>
                <planeGeometry />
                <meshBasicMaterial map={buffer.texture} transparent />
            </mesh>
            <mesh
                ref={ref}
                scale={fill ? [vp.width, vp.height, 1] : (scale ?? 0.15)}
                rotation-x={fill ? 0 : Math.PI / 2}
                {...props}
            >
                {fill ? (
                    <boxGeometry args={[1, 1, 1]} />
                ) : geometryKey === 'Cylinder' ? (
                    <cylinderGeometry args={[1, 1, 0.5, 32]} />
                ) : (
                    <boxGeometry args={[1, 1, 0.2]} />
                )}
                <MeshTransmissionMaterial
                    buffer={buffer.texture}
                    ior={ior ?? 1.2}
                    thickness={thickness ?? 3}
                    anisotropy={anisotropy ?? 0.2}
                    chromaticAberration={chromaticAberration ?? 0.1}
                    roughness={0.2}
                    {...extraMat}
                />
            </mesh>
        </>
    );
});

function BackgroundBlobs() {
    const group = useRef();
    const mesh1 = useRef();
    const mesh2 = useRef();
    const mesh3 = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.z = t * 0.1;
        }
        if (mesh1.current) {
            mesh1.current.position.y = 2 + Math.sin(t * 0.5) * 1;
            mesh1.current.position.x = -4 + Math.cos(t * 0.3) * 1;
        }
        if (mesh2.current) {
            mesh2.current.position.y = -2 + Math.sin(t * 0.8 + 2) * 1;
            mesh2.current.position.x = 4 + Math.cos(t * 0.4) * 1;
        }
        if (mesh3.current) {
            mesh3.current.scale.setScalar(10 + Math.sin(t) * 1);
        }
    });

    return (
        <group ref={group} position={[0, 0, -10]}>
            <mesh ref={mesh1} position={[-4, 2, -5]} scale={[8, 8, 8]}>
                <sphereGeometry />
                <meshBasicMaterial color="#ff0088" />
            </mesh>
            <mesh ref={mesh2} position={[4, -2, -5]} scale={[6, 6, 6]}>
                <sphereGeometry />
                <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh ref={mesh3} position={[0, 0, -8]} scale={[10, 10, 10]}>
                <sphereGeometry />
                <meshBasicMaterial color="#5500ff" />
            </mesh>
        </group>
    );
}

// Pre-load but catch errors to avoid crash if files are missing
try {
    // useGLTF.preload("/assets/3d/lens.glb"); // Commented out preload
    // useGLTF.preload("/assets/3d/cube.glb"); // Commented out preload
    // useGLTF.preload("/assets/3d/bar.glb"); // Commented out preload
} catch (e) {
    console.warn("Failed to preload GLTFs");
}

function Lens({ modeProps, ...p }) {
    // Use fallback if glb missing handling is done in ModeWrapper
    return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }) {
    return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }) {
    const defaultMat = {
        transmission: 1,
        roughness: 0,
        thickness: 10,
        ior: 1.15,
        color: '#ffffff',
        attenuationColor: '#ffffff',
        attenuationDistance: 0.25
    };

    return (
        <ModeWrapper
            glb="/assets/3d/bar.glb"
            geometryKey="Cube"
            lockToBottom
            followPointer={false}
            modeProps={{ ...defaultMat, ...modeProps }}
            {...p}
        />
    );
}

function NavItems({ items }) {
    const group = useRef();
    const { viewport, camera } = useThree();

    const DEVICE = {
        mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
        tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
        desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 }
    };
    const getDevice = () => {
        const w = window.innerWidth;
        return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
    };

    const [device, setDevice] = useState(getDevice());

    useEffect(() => {
        const onResize = () => setDevice(getDevice());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { spacing, fontSize } = DEVICE[device];

    useFrame(() => {
        if (!group.current) return;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
        group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

        group.current.children.forEach((child, i) => {
            child.position.x = (i - (items.length - 1) / 2) * spacing;
        });
    });

    const handleNavigate = link => {
        if (!link) return;
        link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
    };

    return (
        <group ref={group} renderOrder={10}>
            {items.map(({ label, link }) => (
                <Text
                    key={label}
                    fontSize={fontSize}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    depthWrite={false}
                    outlineWidth={0}
                    outlineBlur="20%"
                    outlineColor="#000"
                    outlineOpacity={0.5}
                    depthTest={false}
                    renderOrder={10}
                    onClick={e => {
                        e.stopPropagation();
                        handleNavigate(link);
                    }}
                    onPointerOver={() => (document.body.style.cursor = 'pointer')}
                    onPointerOut={() => (document.body.style.cursor = 'auto')}
                >
                    {label}
                </Text>
            ))}
        </group>
    );
}

function Images() {
    const group = useRef();
    const data = useScroll();
    const { height } = useThree(s => s.viewport);

    useFrame(() => {
        if (group.current && data) { // Check if group and data exist
            group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
            group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
            group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
            group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
            group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
        }
    });

    return (
        <group ref={group}>
            <Image position={[-2, 0, 0]} scale={[3, height / 1.1, 1]} url="/assets/demo/cs1.webp" />
            <Image position={[2, 0, 3]} scale={3} url="/assets/demo/cs2.webp" />
            <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url="/assets/demo/cs3.webp" />
            <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url="/assets/demo/cs1.webp" />
            <Image position={[0.75, -height, 10.5]} scale={1.5} url="/assets/demo/cs2.webp" />
        </group>
    );
}

function Typography() {
    const DEVICE = {
        mobile: { fontSize: 0.2 },
        tablet: { fontSize: 0.4 },
        desktop: { fontSize: 0.6 }
    };
    const getDevice = () => {
        const w = window.innerWidth;
        return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
    };

    const [device, setDevice] = useState(getDevice());

    useEffect(() => {
        const onResize = () => setDevice(getDevice());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const { fontSize } = DEVICE[device];

    return (
        <Text
            position={[0, 0, 12]}
            fontSize={fontSize}
            letterSpacing={-0.05}
            outlineWidth={0}
            outlineBlur="20%"
            outlineColor="#000"
            outlineOpacity={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
        >
            Admin Panel
        </Text>
    );
}
