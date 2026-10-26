import React, { useEffect, useRef } from "react";

export interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 5,
  colors = [
    [59, 130, 246], // Blue
    [139, 92, 246], // Violet
  ],
  containerClassName = "",
  dotSize = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    const startTime = performance.now();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const color1 = colors[0] || [59, 130, 246];
    const color2 = colors[1] || [139, 92, 246];

    // Try WebGL first for high-performance GPU particle rendering
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (gl) {
      const vsSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform float u_speed;
        uniform float u_dot_size;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec2 coord = gl_FragCoord.xy;
          float cellSize = u_dot_size * 3.4;
          vec2 cellId = floor(coord / cellSize);
          vec2 cellUv = fract(coord / cellSize);
          
          float inDot = step(cellUv.x, u_dot_size / cellSize) * step(cellUv.y, u_dot_size / cellSize);
          
          vec2 center = u_resolution / 2.0 / cellSize;
          float dist = distance(center, cellId);
          
          float rand = hash(cellId);
          float t = u_time * u_speed * 0.45;
          
          float wave = sin(dist * 0.28 - t * 2.4) * 0.5 + 0.5;
          float twinkle = sin(t * 3.2 + rand * 6.2831) * 0.5 + 0.5;
          
          float opacity = (0.2 + 0.7 * wave * twinkle) * inDot;
          
          // Soft radial falloff near edges
          vec2 uv = gl_FragCoord.xy / u_resolution;
          float edgeDist = distance(uv, vec2(0.5));
          float radialMask = smoothstep(0.72, 0.22, edgeDist);
          
          vec3 color = mix(u_color1, u_color2, rand) / 255.0;
          gl_FragColor = vec4(color, opacity * radialMask);
        }
      `;

      const createShader = (
        type: number,
        source: string
      ): WebGLShader | null => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      const program = gl.createProgram();

      if (vs && fs && program) {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const resolutionLocation = gl.getUniformLocation(
          program,
          "u_resolution"
        );
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const color1Location = gl.getUniformLocation(program, "u_color1");
        const color2Location = gl.getUniformLocation(program, "u_color2");
        const speedLocation = gl.getUniformLocation(program, "u_speed");
        const dotSizeLocation = gl.getUniformLocation(program, "u_dot_size");

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW
        );

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        const renderWebGL = (now: number) => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.useProgram(program);
          gl.enableVertexAttribArray(positionLocation);
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

          const elapsed = reduceMotion ? 0.5 : (now - startTime) / 1000;

          gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
          gl.uniform1f(timeLocation, elapsed);
          gl.uniform3f(color1Location, color1[0], color1[1], color1[2]);
          gl.uniform3f(color2Location, color2[0], color2[1], color2[2]);
          gl.uniform1f(speedLocation, animationSpeed);
          gl.uniform1f(dotSizeLocation, dotSize * dpr);

          gl.drawArrays(gl.TRIANGLES, 0, 6);

          if (!reduceMotion) {
            animId = requestAnimationFrame(renderWebGL);
          }
        };

        animId = requestAnimationFrame(renderWebGL);

        return () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", handleResize);
          gl.deleteProgram(program);
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          gl.deleteBuffer(positionBuffer);
        };
      }
    }

    // Fallback 2D Canvas Renderer
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render2D = (now: number) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const effectiveDotSize = dotSize * dpr;
      const cellSize = effectiveDotSize * 3.4;
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      const elapsed = reduceMotion ? 0.5 : (now - startTime) / 1000;
      const t = elapsed * animationSpeed * 0.45;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.hypot(centerX, centerY);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize;
          const y = r * cellSize;
          const dist = Math.hypot(x - centerX, y - centerY);

          const rand = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
          const fract = rand - Math.floor(rand);

          const wave = Math.sin((dist / cellSize) * 0.28 - t * 2.4) * 0.5 + 0.5;
          const twinkle = Math.sin(t * 3.2 + fract * Math.PI * 2) * 0.5 + 0.5;
          const radial = Math.max(0, 1 - dist / (maxDist * 0.85));

          const opacity = (0.2 + 0.7 * wave * twinkle) * radial;
          if (opacity <= 0.05) continue;

          const isColor1 = fract > 0.5;
          const activeColor = isColor1 ? color1 : color2;

          ctx.fillStyle = `rgba(${activeColor[0]}, ${activeColor[1]}, ${activeColor[2]}, ${opacity.toFixed(
            2
          )})`;
          ctx.fillRect(x, y, effectiveDotSize, effectiveDotSize);
        }
      }

      if (!reduceMotion) {
        animId = requestAnimationFrame(render2D);
      }
    };

    animId = requestAnimationFrame(render2D);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [animationSpeed, colors, dotSize]);

  return (
    <div
      className={`canvas-reveal-container ${containerClassName}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
export default CanvasRevealEffect;
