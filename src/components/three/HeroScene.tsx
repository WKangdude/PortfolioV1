'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector2,
  Color,
  type OrthographicCamera,
  type LineBasicMaterial,
} from 'three';
import { SceneFallback } from './SceneFallback';
import {
  createShape,
  projectSurface,
  surfaceValues,
  particleSeed,
  PARTICLE_COUNT,
  SHAPE_SEQUENCE,
  SHAPE_DURATION,
  DATA_DURATION,
  MORPH_DURATION,
  type ParticleShape,
} from './particleModel';
import {
  particleVertexShader,
  particleFragmentShader,
  surfaceVertexShader,
  surfaceFragmentShader,
} from './particleShaders';
import styles from './Scene.module.css';

type Pointer = { x: number; y: number; hover: number };

function ParticleCloud({
  shape,
  revision,
  dark,
  pointerRef,
  onAdvance,
  onDataUpdate,
}: {
  shape: ParticleShape;
  revision: number;
  dark: boolean;
  pointerRef: RefObject<Pointer>;
  onAdvance: () => void;
  onDataUpdate: () => void;
}) {
  const { size, gl, invalidate, get } = useThree();
  const elapsedRef = useRef(0);
  const morphRef = useRef(MORPH_DURATION);
  const modeClockRef = useRef(0);
  const dataClockRef = useRef(0);
  const graphRef = useRef(0);
  const gridMaterialRef = useRef<LineBasicMaterial>(null);
  const resources = useMemo(() => {
    const geometry = new BufferGeometry();
    const sphere = createShape('sphere');
    geometry.setAttribute('position', new BufferAttribute(sphere.slice(), 3));
    geometry.setAttribute(
      'targetPosition',
      new BufferAttribute(sphere.slice(), 3),
    );
    geometry.setAttribute(
      'seed',
      new BufferAttribute(
        Float32Array.from({ length: PARTICLE_COUNT }, (_, i) =>
          particleSeed(i, 3),
        ),
        1,
      ),
    );
    geometry.setAttribute('elevation', new BufferAttribute(surfaceValues(), 1));
    geometry.setAttribute(
      'targetElevation',
      new BufferAttribute(surfaceValues(), 1),
    );
    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uGraph: { value: 0 },
        uPixelRatio: { value: 1 },
        uPointer: { value: new Vector2(10, 10) },
        uHover: { value: 0 },
        uDark: { value: 0 },
      },
    });
    const grid = new BufferGeometry(),
      vertices: number[] = [];
    for (let x = -1.6; x <= 1.61; x += 0.4)
      vertices.push(
        ...projectSurface(x, -1.15, -1.6),
        ...projectSurface(x, -1.15, 1.6),
      );
    for (let z = -1.6; z <= 1.61; z += 0.4)
      vertices.push(
        ...projectSurface(-1.6, -1.15, z),
        ...projectSurface(1.6, -1.15, z),
      );
    for (const [x, z] of [
      [-1.6, -1.6],
      [1.6, -1.6],
      [1.6, 1.6],
      [-1.6, 1.6],
    ])
      vertices.push(
        ...projectSurface(x, -1.15, z),
        ...projectSurface(x, 1.15, z),
      );
    grid.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices), 3),
    );
    const surface = new BufferGeometry();
    surface.setAttribute(
      'position',
      new BufferAttribute(createShape('scatter'), 3),
    );
    surface.setAttribute(
      'targetPosition',
      new BufferAttribute(createShape('scatter'), 3),
    );
    const indices: number[] = [];
    const n = Math.ceil(Math.sqrt(PARTICLE_COUNT));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i % n < n - 1 && i + 1 < PARTICLE_COUNT) indices.push(i, i + 1);
      if (i + n < PARTICLE_COUNT) indices.push(i, i + n);
    }
    surface.setIndex(indices);
    const surfaceMaterial = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: surfaceVertexShader,
      fragmentShader: surfaceFragmentShader,
      uniforms: {
        uMorph: { value: 1 },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: new Color('#67935b') },
      },
    });
    return {
      geometry,
      material,
      grid,
      surface,
      surfaceMaterial,
      pointerTarget: new Vector2(),
    };
  }, []);

  const resourcesRef = useRef(resources);
  useEffect(() => {
    const resources = resourcesRef.current;
    const ortho = get().camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width, size.height) / 5.25;
    ortho.updateProjectionMatrix();
    resources.material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    invalidate();
  }, [size, get, gl, invalidate]);

  useEffect(() => {
    const resources = resourcesRef.current;
    const from = resources.geometry.getAttribute('position') as BufferAttribute;
    const target = resources.geometry.getAttribute(
      'targetPosition',
    ) as BufferAttribute;
    const t = Math.min(morphRef.current / MORPH_DURATION, 1),
      blend = t * t * (3 - 2 * t);
    // Capturar la interpolación actual permite invertir una transición con otro clic.
    for (let i = 0; i < from.array.length; i++)
      from.array[i] += (target.array[i] - from.array[i]) * blend;
    const heightFrom = resources.geometry.getAttribute(
      'elevation',
    ) as BufferAttribute;
    const heightTarget = resources.geometry.getAttribute(
      'targetElevation',
    ) as BufferAttribute;
    for (let i = 0; i < heightFrom.array.length; i++)
      heightFrom.array[i] +=
        (heightTarget.array[i] - heightFrom.array[i]) * blend;
    heightTarget.set(surfaceValues(revision));
    heightFrom.needsUpdate = true;
    heightTarget.needsUpdate = true;
    const surfaceFrom = resources.surface.getAttribute(
      'position',
    ) as BufferAttribute;
    const surfaceTarget = resources.surface.getAttribute(
      'targetPosition',
    ) as BufferAttribute;
    for (let i = 0; i < surfaceFrom.array.length; i++)
      surfaceFrom.array[i] +=
        (surfaceTarget.array[i] - surfaceFrom.array[i]) * blend;
    surfaceTarget.set(createShape('scatter', revision));
    surfaceFrom.needsUpdate = true;
    surfaceTarget.needsUpdate = true;
    target.set(createShape(shape, revision));
    from.needsUpdate = true;
    target.needsUpdate = true;
    morphRef.current = 0;
    dataClockRef.current = 0;
    invalidate();
  }, [shape, revision, resources, invalidate]);

  useEffect(() => {
    modeClockRef.current = 0;
  }, [shape]);
  useEffect(() => {
    const resources = resourcesRef.current;
    resources.material.uniforms.uDark.value = dark ? 1 : 0;
    invalidate();
  }, [dark, resources, invalidate]);
  useEffect(
    () => () => {
      resources.geometry.dispose();
      resources.material.dispose();
      resources.grid.dispose();
      resources.surface.dispose();
      resources.surfaceMaterial.dispose();
    },
    [resources],
  );

  useFrame((_, frameDelta) => {
    const resources = resourcesRef.current;
    const dt = Math.min(frameDelta, 0.05);
    elapsedRef.current += dt;
    modeClockRef.current += dt;
    dataClockRef.current += dt;
    morphRef.current = Math.min(MORPH_DURATION, morphRef.current + dt);
    const uniforms = resources.material.uniforms;
    uniforms.uTime.value = elapsedRef.current;
    uniforms.uMorph.value = morphRef.current / MORPH_DURATION;
    graphRef.current +=
      ((shape === 'scatter' ? 1 : 0) - graphRef.current) *
      (1 - Math.exp(-dt * 3));
    uniforms.uGraph.value = graphRef.current;
    uniforms.uHover.value +=
      (pointerRef.current.hover - uniforms.uHover.value) *
      (1 - Math.exp(-dt * 7));
    const viewport = _.viewport;
    uniforms.uPointer.value.lerp(
      resources.pointerTarget.set(
        (pointerRef.current.x * viewport.width) / 2,
        (pointerRef.current.y * viewport.height) / 2,
      ),
      1 - Math.exp(-dt * 9),
    );
    resources.surfaceMaterial.uniforms.uMorph.value = uniforms.uMorph.value;
    resources.surfaceMaterial.uniforms.uTime.value = elapsedRef.current;
    resources.surfaceMaterial.uniforms.uOpacity.value =
      Math.pow(graphRef.current, 3) *
      (dark ? 0.18 : 0.11) *
      (1 - uniforms.uHover.value * 0.75);
    resources.surfaceMaterial.uniforms.uColor.value.set(
      dark ? '#c0cfa7' : '#467846',
    );
    if (gridMaterialRef.current)
      gridMaterialRef.current.opacity = graphRef.current * (dark ? 0.2 : 0.14);
    if (modeClockRef.current >= SHAPE_DURATION) {
      modeClockRef.current = 0;
      onAdvance();
    } else if (shape === 'scatter' && dataClockRef.current >= DATA_DURATION) {
      dataClockRef.current = 0;
      onDataUpdate();
    }
  });

  return (
    <>
      <points
        geometry={resources.geometry}
        material={resources.material}
        frustumCulled={false}
        dispose={null}
      />
      <lineSegments
        geometry={resources.surface}
        material={resources.surfaceMaterial}
        frustumCulled={false}
        dispose={null}
      />
      <lineSegments geometry={resources.grid} dispose={null}>
        <lineBasicMaterial
          ref={gridMaterialRef}
          color={dark ? '#b7c6b5' : '#456846'}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default function HeroScene({
  onUnavailable,
}: {
  onUnavailable: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, hover: 0 });
  const sequenceRef = useRef(0);
  const [shape, setShape] = useState<ParticleShape>('sphere');
  const [revision, setRevision] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      sync();
    });
    if (hostRef.current) observer.observe(hostRef.current);
    document.addEventListener('visibilitychange', sync);
    const themeObserver = new MutationObserver(() =>
      setDark(document.documentElement.dataset.theme === 'dark'),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const syncTheme = () =>
      setDark(document.documentElement.dataset.theme === 'dark');
    syncTheme();
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  function advance() {
    sequenceRef.current = (sequenceRef.current + 1) % SHAPE_SEQUENCE.length;
    setShape(SHAPE_SEQUENCE[sequenceRef.current]);
    setRevision(0);
  }
  function toggle() {
    sequenceRef.current = shape === 'scatter' ? 6 : 1;
    setShape(SHAPE_SEQUENCE[sequenceRef.current]);
    setRevision(0);
  }
  return (
    <div
      ref={hostRef}
      className={styles.liveScene}
      data-shape={shape}
      data-revision={revision}
      data-animation={visible ? 'running' : 'paused'}
      data-palette={dark ? 'dark' : 'light'}
    >
      <div
        className={styles.particleSurface}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch') return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointerRef.current = {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: 1 - ((event.clientY - rect.top) / rect.height) * 2,
            hover: 1,
          };
        }}
        onPointerLeave={() => {
          pointerRef.current.hover = 0;
        }}
      >
        <Canvas
          orthographic
          camera={{ position: [0, 0, 8], zoom: 65, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          frameloop={visible ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              'webglcontextlost',
              (event) => {
                event.preventDefault();
                onUnavailable();
              },
              { once: true },
            );
          }}
          fallback={<SceneFallback />}
        >
          <ParticleCloud
            shape={shape}
            revision={revision}
            dark={dark}
            pointerRef={pointerRef}
            onAdvance={advance}
            onDataUpdate={() => setRevision((value) => value + 1)}
          />
        </Canvas>
        <button
          className={styles.sceneHitArea}
          aria-label={
            shape === 'scatter'
              ? 'Formar esfera irregular'
              : 'Transformar en mapa 3D'
          }
          onClick={toggle}
        />
      </div>
    </div>
  );
}
