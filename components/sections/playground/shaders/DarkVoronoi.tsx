"use client";
import React, { useRef, useEffect } from "react";

const vertShader = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragShader = `#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
out vec4 fragColor;

// Voronoi Logic
#define ANIMATE

vec2 hash2( vec2 p ) {
    // texture based white noise
    return texture( iChannel0, (p+0.5)/256.0 ).xy;
}

vec3 voronoi( in vec2 x ) {
    vec2 ip = floor(x);
    vec2 fp = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ ) {
        vec2 g = vec2(float(i),float(j));
        vec2 o = hash2( ip + g );
        #ifdef ANIMATE
        o = 0.5 + 0.5*sin( iTime + 6.2831*o );
        #endif	
        vec2 r = g + o - fp;
        float d = dot(r,r);
        if( d<md ) {
            md = d;
            mr = r;
            mg = g;
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ ) {
        vec2 g = mg + vec2(float(i),float(j));
        vec2 o = hash2( ip + g );
        #ifdef ANIMATE
        o = 0.5 + 0.5*sin( iTime + 6.2831*o );
        #endif	
        vec2 r = g + o - fp;
        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }
    return vec3( md, mr );
}

void main() {
    vec2 p = gl_FragCoord.xy/iResolution.xx;
    vec3 c = voronoi( 8.0*p );

    // isolines
    vec3 col = c.x*(0.5 + 0.5*sin(64.0*c.x))*vec3(1.0);
    // borders	
    col = mix( vec3(1.0,0.6,0.0), col, smoothstep( 0.04, 0.07, c.x ) );
    // feature points
    float dd = length( c.yz );
    col = mix( vec3(1.0,0.6,0.1), col, smoothstep( 0.0, 0.12, dd) );
    col += vec3(1.0,0.6,0.1)*(1.0-smoothstep( 0.0, 0.04, dd));

    fragColor = vec4(col,1.0);
}
`;

export default function VoronoiShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use WebGL2 for easier GLSL ES 3.0 support
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // 1. Create Noise Texture for iChannel0
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const size = 256;
    const noiseData = new Uint8Array(size * size * 4);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 255;
    }
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, noiseData
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // 2. Shader Compilation
    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const program = gl.createProgram();
    const vs = createShader(gl.VERTEX_SHADER, vertShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragShader);
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 3. Buffer Setup
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // 4. Uniforms
    const uTime = gl.getUniformLocation(program, "iTime");
    const uRes = gl.getUniformLocation(program, "iResolution");
    const uChan0 = gl.getUniformLocation(program, "iChannel0");

    let id = 0;
    const startTime = Date.now();

    const render = () => {
      if (!canvas) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.useProgram(program);
      gl.uniform1f(uTime, (Date.now() - startTime) * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uChan0, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      id = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(id);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}