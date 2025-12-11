"use client";
import React, { useRef, useEffect } from "react";

const flowVertShader = `attribute vec2 a_position;void main() {gl_Position = vec4(a_position, 0.0, 1.0);}`;
const flowFragShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;

float f(in vec2 p) {
    return sin(p.x + sin(p.y + uTime * 0.2)) * sin(p.y * p.x * 0.1 + uTime * 0.2);
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
    float uScale = 5.0;
    p *= uScale;
    vec2 rz = vec2(0.0);
    for (int i = 0; i < 15; i++) {
        float t0 = f(p);
        float t1 = f(p + vec2(0.05, 0.0));
        vec2 g = vec2((t1 - t0), (f(p + vec2(0.0, 0.05)) - t0)) / 0.05;
        vec2 t = vec2(-g.y, g.x);
        p += 0.05 * t + g * 0.2;
        rz = g;
    }
    vec3 colorVec = vec3(rz * 0.5 + 0.5, 1.5);
    colorVec = (colorVec - 0.5) * 1.5 + 0.5; 
    gl_FragColor = vec4(colorVec, 1.0);
}
`;

export default function FlowShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compile = (type: number, src: string) => {
        const s = gl.createShader(type);
        if(!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    };

    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, flowVertShader);
    const fs = compile(gl.FRAGMENT_SHADER, flowFragShader);
    if (!program || !vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    const resLoc = gl.getUniformLocation(program, "uResolution");

    let id = 0;
    const render = (time: number) => {
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, time * 0.001);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        id = requestAnimationFrame(render);
    };
    render(0);
    return () => cancelAnimationFrame(id);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}