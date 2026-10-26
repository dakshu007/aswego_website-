import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";

/**
 * Hero scene: the hero photo re-rendered as a shader plane (cover-fit to match the
 * <img> exactly) with a pointer ripple and scroll-velocity stretch/RGB split, plus a
 * field of dust particles that drift like roost and scatter away from the pointer.
 */

const photoVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const photoFrag = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uVel;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  vec2 cover(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uImg.x / uImg.y;
    vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;

    // Pointer ripple
    vec2 d = (uv - uMouse) * vec2(aspect, 1.0);
    float dist = length(d);
    float wave = sin(dist * 38.0 - uTime * 5.0) * exp(-dist * 7.0) * uHover;
    uv += (d / max(dist, 1e-4)) * wave * 0.010;

    // Scroll velocity: vertical stretch around the centre + gentle heat haze
    uv.y += (uv.y - 0.5) * abs(uVel) * 0.06;
    uv.x += sin(uv.y * 24.0 + uTime * 1.6) * 0.0012 * (0.4 + abs(uVel) * 4.0);

    vec2 c = cover(uv);
    vec2 split = vec2(0.0, uVel * 0.010 + wave * 0.004);
    float r = texture2D(uTex, c + split).r;
    float g = texture2D(uTex, c).g;
    float b = texture2D(uTex, c - split).b;
    vec3 col = vec3(r, g, b);

    // Film grain
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.045;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const dustVert = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uScale;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_PointSize = aSize * uScale;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const dustFrag = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.0, length(p)) * vAlpha;
    gl_FragColor = vec4(0.93, 0.78, 0.62, a);
  }
`;

export function mountHero(container: HTMLElement, img: HTMLImageElement) {
  const small = window.innerWidth < 768;
  const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const photo = new ShaderMaterial({
    vertexShader: photoVert,
    fragmentShader: photoFrag,
    uniforms: {
      uTex: { value: null },
      uRes: { value: new Vector2(1, 1) },
      uImg: { value: new Vector2(img.naturalWidth || 16, img.naturalHeight || 10) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uVel: { value: 0 },
    },
  });
  scene.add(new Mesh(new PlaneGeometry(2, 2), photo));

  // Dust
  const count = small ? 320 : 900;
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 2);
  const size = new Float32Array(count);
  const alpha = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = Math.random() * 2.4 - 1.2;
    pos[i * 3 + 1] = Math.random() * 1.6 - 1.0;
    vel[i * 2] = 0.0006 + Math.random() * 0.0016;
    vel[i * 2 + 1] = 0.0002 + Math.random() * 0.0007;
    size[i] = 1 + Math.random() * Math.random() * 7;
    alpha[i] = 0.12 + Math.random() * 0.5;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute("position", new BufferAttribute(pos, 3));
  dustGeo.setAttribute("aSize", new BufferAttribute(size, 1));
  dustGeo.setAttribute("aAlpha", new BufferAttribute(alpha, 1));
  const dust = new ShaderMaterial({
    vertexShader: dustVert,
    fragmentShader: dustFrag,
    uniforms: { uScale: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  scene.add(new Points(dustGeo, dust));

  const mouse = new Vector2(0.5, 0.5);
  const mouseNdc = new Vector2(10, 10);
  const mouseDelta = new Vector2();
  let hoverTarget = 0;

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    photo.uniforms.uRes.value.set(width, height);
    dust.uniforms.uScale.value = renderer.getPixelRatio() * Math.max(0.7, height / 900);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const onMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    mouseDelta.set(x - mouse.x, y - mouse.y);
    mouse.set(x, y);
    mouseNdc.set(x * 2 - 1, y * 2 - 1);
    hoverTarget = 1;
  };
  const onLeave = () => {
    hoverTarget = 0;
    mouseNdc.set(10, 10);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  let inView = true;
  const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
  io.observe(container);

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!inView || document.hidden) return;
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    const u = photo.uniforms;
    u.uTime.value = now / 1000;
    u.uMouse.value.lerp(mouse, 0.12);
    u.uHover.value += (hoverTarget - u.uHover.value) * 0.05;
    hoverTarget *= 0.985;
    const v = window.__awgVelocity ?? 0;
    u.uVel.value += (v - u.uVel.value) * 0.15;

    const kick = Math.min(0.05, mouseDelta.length());
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = pos[ix];
      let y = pos[ix + 1];
      x += vel[i * 2] * dt * (1 + Math.abs(u.uVel.value) * 6);
      y += vel[i * 2 + 1] * dt;
      const dx = x - mouseNdc.x;
      const dy = y - mouseNdc.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.04) {
        const f = (0.04 - d2) * (0.6 + kick * 40);
        x += dx * f;
        y += dy * f;
      }
      if (x > 1.2) x = -1.2;
      if (y > 0.7) y = -1.0;
      pos[ix] = x;
      pos[ix + 1] = y;
    }
    mouseDelta.multiplyScalar(0.9);
    dustGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };

  const begin = () => {
    new TextureLoader().load(img.currentSrc || img.src, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      photo.uniforms.uTex.value = tex;
      photo.uniforms.uImg.value.set(tex.image.width, tex.image.height);
      raf = requestAnimationFrame((t) => {
        loop(t);
        container.classList.add("is-ready");
      });
    });
  };
  if (img.complete) begin();
  else img.addEventListener("load", begin, { once: true });

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    dustGeo.dispose();
    dust.dispose();
    photo.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
