import { UniformsUtils, ShaderMaterial } from 'three';

export const CustomShader = {
  vertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragment_colorized: `
    varying vec2 vUv;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float mixFactor;
    uniform float transparentOpacity;

    vec3 adjustBrightness(vec3 color, float value) {
      return color + value;
    }

    vec3 adjustContrast(vec3 color, float value) {
      return 0.5 + (1.0 + value) * (color - 0.5);
    }

    vec3 adjustExposure(vec3 color, float value) {
      return color * (1.0 + value);
    }

    vec3 adjustSaturation(vec3 color, float value) {
      // https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
      const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
      vec3 grayscale = vec3(dot(color, luminosityFactor));

      return mix(grayscale, color, 1.0 + value);
    }

    void main() {
      vec4 _texture1 = texture2D(texture1, vUv);
      vec4 _texture2 = texture2D(texture2, vUv);
      vec3 _color = vec3(_texture1.rgb * (1.0 - mixFactor) + _texture2.rgb * mixFactor);
      _color = adjustBrightness(_color, 0.18);
      _color = adjustExposure(_color, 0.1);
      _color = adjustContrast(_color, -0.05);
      _color = adjustSaturation(_color, -0.1);
      vec4 finalTexture = vec4(_color, transparentOpacity);
      gl_FragColor = finalTexture;
    }
  `,
  fragment: `
    varying vec2 vUv;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float mixFactor;
    uniform float transparentOpacity;

    void main() {
      vec4 _texture1 = texture2D(texture1, vUv);
      vec4 _texture2 = texture2D(texture2, vUv);
      vec3 _color = vec3(_texture1.rgb * (1.0 - mixFactor) + _texture2.rgb * mixFactor);
      vec4 finalTexture = vec4(_color, transparentOpacity);
      gl_FragColor = finalTexture;
    }
  `,
};

export default class FadeMaterial extends ShaderMaterial {
  constructor() {
    const uniforms = UniformsUtils.merge([
      {
        // custom uniforms:
        mixFactor: { type: 'f', value: 0 },
        texture1: { type: 't', value: undefined },
        texture2: { type: 't', value: undefined },
        transparentOpacity: { type: 'f', value: 1.0 },
      },
    ]);

    super({
      uniforms: uniforms,
      vertexShader: CustomShader.vertex,
      fragmentShader: CustomShader.fragment,
    });
  }

  get texture1() {
    return this.uniforms.texture1.value;
  }
  set texture1(v) {
    this.uniforms.texture1.value = v;
  }
  get texture2() {
    return this.uniforms.texture2.value;
  }
  set texture2(v) {
    this.uniforms.texture2.value = v;
  }
  get mixFactor() {
    return this.uniforms.mixFactor.value;
  }
  set mixFactor(v) {
    this.uniforms.mixFactor.value = v;
  }
  get transparentOpacity() {
    return this.uniforms.transparentOpacity.value;
  }
  set transparentOpacity(v) {
    this.uniforms.transparentOpacity.value = v;
  }
}
