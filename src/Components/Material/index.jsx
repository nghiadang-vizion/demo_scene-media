import React, { useEffect, useMemo, useRef } from "react";
import { BackSide } from "three";

import { CustomShader } from "./fadeMaterial";

const CrossFadeMaterial = ({
  texture1,
  texture2,
  mixFactor,
  opacity = 1.0,
  index,
}) => {
  const materialRef = useRef();
  const uniforms = useMemo(
    () => ({
      mixFactor: { type: "f", value: 0 },
      texture1: { type: "t", value: undefined },
      texture2: { type: "t", value: undefined },
      transparentOpacity: { type: "f", value: 1.0 },
    }),
    []
  );

  useEffect(() => {
    materialRef.current.uniforms.transparentOpacity.value = opacity;
  }, [opacity]);

  useEffect(() => {
    materialRef.current.uniforms.mixFactor.value = mixFactor;
  }, [mixFactor]);

  useEffect(() => {
    materialRef.current.uniforms.texture1.value = texture1;
    materialRef.current.uniforms.texture2.value = texture2;
    materialRef.current.needsUpdate = true;
  }, [texture1, texture2]);

  return (
    <shaderMaterial
      attach={`material-${index}`}
      ref={materialRef}
      uniforms={uniforms}
      fragmentShader={CustomShader.fragment}
      vertexShader={CustomShader.vertex}
      side={BackSide}
      transparent={true}
    />
  );
};

export default CrossFadeMaterial;
