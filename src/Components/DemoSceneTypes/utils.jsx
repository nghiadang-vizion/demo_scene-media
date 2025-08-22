export function setCamera(camera, position, fov) {
  camera.position.set(...position);
  if (fov !== undefined) {
    camera.fov = fov;
  }
  camera.updateProjectionMatrix();
}
