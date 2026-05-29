/**
 * @param {number} value
 * @param {number} iMin
 * @param {number} iMax
 * @param {number} oMin
 * @param {number} oMax
 * @returns {number}
 */
function mapLinear(value, iMin, iMax, oMin, oMax) {
	value = (value - iMin) / (iMax - iMin);
	value = value * (oMax - oMin) + oMin;
	return value;
}

/**
 * @typedef {object} RendererState
 * @property {boolean} isError
 * @property {WebGLProgram} particleShader
 * @property {WebGLProgram} blurShader
 * @property {WebGLProgram} finalizeShader
 * @property {number} viewportSize
 * @property {number} inPositionLoc
 * @property {number} inPositionLocBlur
 * @property {number} inPositionLocFinalize
 * @property {WebGLUniformLocation} uScaledTimeLoc
 * @property {WebGLUniformLocation} uAmplitudeLoc
 * @property {WebGLUniformLocation} uSeedLoc
 * @property {WebGLUniformLocation} uDotCountLoc
 * @property {WebGLUniformLocation} uDotRadiusLoc
 * @property {WebGLUniformLocation} uDotRadiusPXLoc
 * @property {WebGLUniformLocation} uDotSpacingLoc
 * @property {WebGLUniformLocation} uDotOffsetLoc
 * @property {WebGLUniformLocation} uSphereRadiusLoc
 * @property {WebGLUniformLocation} uFeatherLoc
 * @property {WebGLUniformLocation} uNoiseFrequencyLoc
 * @property {WebGLUniformLocation} uNoiseAmplitudeLoc
 * @property {WebGLUniformLocation} uBlurRadiusLoc
 * @property {WebGLUniformLocation} uBlurDirectionLoc
 * @property {WebGLUniformLocation} uBlurInputTextureLoc
 * @property {WebGLUniformLocation} uOutputColorLoc
 * @property {WebGLUniformLocation} uBlurredTextureLoc
 * @property {WebGLUniformLocation} uOriginalTextureLoc
 * @property {WebGLBuffer} quadBuffer
 * @property {WebGLFramebuffer} particleFramebuffer
 * @property {WebGLTexture} particleTexture
 * @property {WebGLFramebuffer} blurXFramebuffer
 * @property {WebGLTexture} blurXTexture
 * @property {WebGLFramebuffer} blurYFramebuffer
 * @property {WebGLTexture} blurYTexture
 */

/**
 * @param {WebGL2RenderingContext} gl
 * @returns {RendererState}
 */
function rendererInit(gl) {
	if (!gl) {
		console.error("WebGL2 not supported");
		return { isError: true };
	}

	/**
	 * @param {number} type
	 * @param {string} source
	 * @param {string} name
	 * @returns {WebGLShader}
	 */
	const createShader = (type, source, name) => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
			const msg = `Error: Failed to compile ${name} shader`;
			const log = gl.getShaderInfoLog(shader);
			console.error(msg, log);
			return null;
		}

		return shader;
	};

	/**
	 * @param {WebGLShader} vertShader
	 * @param {WebGLShader} fragShader
	 * @param {string} name
	 * @returns {WebGLProgram}
	 */
	const createProgram = (vertShader, fragShader, name) => {
		const shader = gl.createProgram();
		gl.attachShader(shader, vertShader);
		gl.attachShader(shader, fragShader);
		gl.linkProgram(shader);

		if (!gl.getProgramParameter(shader, gl.LINK_STATUS) && !gl.isContextLost()) {
			const msg = `Error: Failed to link ${name} shader`;
			const log = gl.getProgramInfoLog(shader);
			console.error(msg, log);
			return null;
		}

		return shader;
	};

	/**
	 * @param {number} filter
	 * @returns {{ framebuffer: WebGLFramebuffer, texture: WebGLTexture }}
	 */
	const createFramebuffer = filter => {
		const framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

		return { framebuffer, texture };
	};

	const particleVertShader = createShader(gl.VERTEX_SHADER, PARTICLE_VERT_SHADER, "particle vertex");
	if (!particleVertShader) return { isError: true };
	const particleFragShader = createShader(gl.FRAGMENT_SHADER, PARTICLE_FRAG_SHADER, "particle fragment");
	if (!particleFragShader) return { isError: true };
	const particleShader = createProgram(particleVertShader, particleFragShader, "particle");
	if (!particleShader) return { isError: true };

	const inPositionLoc = gl.getAttribLocation(particleShader, "inPosition");
	const uScaledTimeLoc = gl.getUniformLocation(particleShader, "uScaledTime");
	const uAmplitudeLoc = gl.getUniformLocation(particleShader, "uAmplitude");
	const uSeedLoc = gl.getUniformLocation(particleShader, "uSeed");
	const uDotCountLoc = gl.getUniformLocation(particleShader, "uDotCount");
	const uDotRadiusLoc = gl.getUniformLocation(particleShader, "uDotRadius");
	const uDotRadiusPXLoc = gl.getUniformLocation(particleShader, "uDotRadiusPX");
	const uDotSpacingLoc = gl.getUniformLocation(particleShader, "uDotSpacing");
	const uDotOffsetLoc = gl.getUniformLocation(particleShader, "uDotOffset");
	const uSphereRadiusLoc = gl.getUniformLocation(particleShader, "uSphereRadius");
	const uFeatherLoc = gl.getUniformLocation(particleShader, "uFeather");
	const uNoiseFrequencyLoc = gl.getUniformLocation(particleShader, "uNoiseFrequency");
	const uNoiseAmplitudeLoc = gl.getUniformLocation(particleShader, "uNoiseAmplitude");

	const blurVertShader = createShader(gl.VERTEX_SHADER, BLUR_VERT_SHADER, "blur vertex");
	if (!blurVertShader) return { isError: true };
	const blurFragShader = createShader(gl.FRAGMENT_SHADER, BLUR_FRAG_SHADER, "blur fragment");
	if (!blurFragShader) return { isError: true };
	const blurShader = createProgram(blurVertShader, blurFragShader, "blur");
	if (!blurShader) return { isError: true };

	const inPositionLocBlur = gl.getAttribLocation(blurShader, "inPosition");
	const uBlurRadiusLoc = gl.getUniformLocation(blurShader, "uBlurRadius");
	const uBlurDirectionLoc = gl.getUniformLocation(blurShader, "uBlurDirection");
	const uBlurInputTextureLoc = gl.getUniformLocation(blurShader, "uInputTexture");

	const finalizeVertShader = createShader(gl.VERTEX_SHADER, FINALIZE_VERT_SHADER, "finalize vertex");
	if (!finalizeVertShader) return { isError: true };
	const finalizeFragShader = createShader(gl.FRAGMENT_SHADER, FINALIZE_FRAG_SHADER, "finalize fragment");
	if (!finalizeFragShader) return { isError: true };
	const finalizeShader = createProgram(finalizeVertShader, finalizeFragShader, "finalize");
	if (!finalizeShader) return { isError: true };

	const inPositionLocFinalize = gl.getAttribLocation(finalizeShader, "inPosition");
	const uOutputColorLoc = gl.getUniformLocation(finalizeShader, "uOutputColor");
	const uBlurredTextureLoc = gl.getUniformLocation(finalizeShader, "uBlurredTexture");
	const uOriginalTextureLoc = gl.getUniformLocation(finalizeShader, "uOriginalTexture");

	const { framebuffer: particleFramebuffer, texture: particleTexture } = createFramebuffer(gl.LINEAR);
	const { framebuffer: blurXFramebuffer, texture: blurXTexture } = createFramebuffer(gl.LINEAR);
	const { framebuffer: blurYFramebuffer, texture: blurYTexture } = createFramebuffer(gl.NEAREST);

	const quadBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        -1,  1,
         1,  1,
         1, -1
    ]), gl.STATIC_DRAW);

	gl.enable(gl.BLEND);
	gl.blendEquation(gl.MAX);

	return {
		isError: false,
		particleShader,
		blurShader,
		finalizeShader,
		viewportSize: 0,

		inPositionLoc,
		inPositionLocBlur,
		inPositionLocFinalize,

		uScaledTimeLoc,
		uAmplitudeLoc,
		uSeedLoc,
		uDotCountLoc,
		uDotRadiusLoc,
		uDotRadiusPXLoc,
		uDotSpacingLoc,
		uDotOffsetLoc,
		uSphereRadiusLoc,
		uFeatherLoc,
		uNoiseFrequencyLoc,
		uNoiseAmplitudeLoc,

		uBlurRadiusLoc,
		uBlurDirectionLoc,
		uBlurInputTextureLoc,

		uOutputColorLoc,
		uBlurredTextureLoc,
		uOriginalTextureLoc,

		quadBuffer,

		particleFramebuffer,
		particleTexture,
		blurXFramebuffer,
		blurXTexture,
		blurYFramebuffer,
		blurYTexture
	};
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {RendererState} state
 */
function rendererResize(gl, state) {
	if (state.isError || !gl) return null;

	state.viewportSize = Math.min(gl.canvas.width, gl.canvas.height);
	gl.viewport(0, 0, state.viewportSize, state.viewportSize);

	gl.bindTexture(gl.TEXTURE_2D, state.particleTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, state.viewportSize, state.viewportSize, 0, gl.RED, gl.UNSIGNED_BYTE, null);

	gl.bindTexture(gl.TEXTURE_2D, state.blurXTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, state.viewportSize, state.viewportSize, 0, gl.RED, gl.UNSIGNED_BYTE, null);

	gl.bindTexture(gl.TEXTURE_2D, state.blurYTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, state.viewportSize, state.viewportSize, 0, gl.RED, gl.UNSIGNED_BYTE, null);
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {RendererState} state
 * @param {[number, number, number]} color
 * @param {number} time
 * @param {number} amplitude
 */
function rendererRender(gl, state, color, time, amplitude, sphereSize, sphereSizeVariation, noiseAmplitude, noiseFrequency, dotCount, dotSize) {
	if (state.isError || !gl) return;

	// render particles
	gl.bindFramebuffer(gl.FRAMEBUFFER, state.particleFramebuffer);

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const uScaledTime = 0.0008 * time;
	const uAmplitude = amplitude;
	const uSeed = 1234;
	const uDotCount = dotCount;
	const uDotRadius = (dotSize * sphereSize) / uDotCount;
	const uDotRadiusPX = uDotRadius * 0.5 * state.viewportSize;
	const uDotSpacing = sphereSize / (uDotCount - 1);
	const uDotOffset = -sphereSize / 2;
	const uSphereRadius = mapLinear(uAmplitude, 0, 1, sphereSize * 0.6, sphereSize * (1.0 + sphereSizeVariation));
	const uFeather = Math.pow(uAmplitude + 3, 2) * (45 / 1568);
	const uNoiseFrequency = noiseFrequency / uDotCount;
	const uNoiseAmplitude = noiseAmplitude * sphereSize;

	gl.useProgram(state.particleShader);
	gl.uniform1f(state.uScaledTimeLoc, uScaledTime);
	gl.uniform1f(state.uAmplitudeLoc, uAmplitude);
	gl.uniform1i(state.uSeedLoc, uSeed);
	gl.uniform1i(state.uDotCountLoc, uDotCount);
	gl.uniform1f(state.uDotRadiusLoc, uDotRadius);
	gl.uniform1f(state.uDotRadiusPXLoc, uDotRadiusPX);
	gl.uniform1f(state.uDotSpacingLoc, uDotSpacing);
	gl.uniform1f(state.uDotOffsetLoc, uDotOffset);
	gl.uniform1f(state.uSphereRadiusLoc, uSphereRadius);
	gl.uniform1f(state.uFeatherLoc, uFeather);
	gl.uniform1f(state.uNoiseFrequencyLoc, uNoiseFrequency);
	gl.uniform1f(state.uNoiseAmplitudeLoc, uNoiseAmplitude);

	gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuffer);
	gl.enableVertexAttribArray(state.inPositionLoc);
	gl.vertexAttribPointer(state.inPositionLoc, 2, gl.FLOAT, false, 0, 0);

	gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, uDotCount * uDotCount);
	gl.bindTexture(gl.TEXTURE_2D, state.particleTexture);

	// blur in X direction
	gl.bindFramebuffer(gl.FRAMEBUFFER, state.blurXFramebuffer);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(state.blurShader);
	gl.uniform1f(state.uBlurRadiusLoc, 0.01 * state.viewportSize);
	gl.uniform2f(state.uBlurDirectionLoc, 1 / state.viewportSize, 0);
	gl.uniform1i(state.uBlurInputTextureLoc, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, state.particleTexture);

	gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuffer);
	gl.enableVertexAttribArray(state.inPositionLocBlur);
	gl.vertexAttribPointer(state.inPositionLocBlur, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	// blur in Y direction
	gl.bindFramebuffer(gl.FRAMEBUFFER, state.blurYFramebuffer);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.uniform2f(state.uBlurDirectionLoc, 0, 1 / state.viewportSize);
	gl.bindTexture(gl.TEXTURE_2D, state.blurXTexture);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// combine blurred and original
	gl.useProgram(state.finalizeShader);
	gl.uniform3f(state.uOutputColorLoc, ...color);
	gl.uniform1i(state.uBlurredTextureLoc, 0);
	gl.uniform1i(state.uOriginalTextureLoc, 1);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, state.blurYTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, state.particleTexture);

	gl.bindBuffer(gl.ARRAY_BUFFER, state.quadBuffer);
	gl.enableVertexAttribArray(state.inPositionLocFinalize);
	gl.vertexAttribPointer(state.inPositionLocFinalize, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
