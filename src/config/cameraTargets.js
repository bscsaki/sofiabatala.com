// laptop backup (confirmed good, symmetric, near-eye-level): position [1.704, 0.766, 1.323], target [1.710, 0.461, -0.377], roll 0, fov 35
const cameraTargets = {
  // position.x matches target.x so the straight-on view has zero yaw and the
  // desk/window horizontals project perfectly level
  overview:  { position: [1.699, 2.418, 4.725], target: [1.699, 1.6, -0.055],   roll: 0 },
  laptop:    { position: [1.704, 0.966, 1.323], target: [1.710, 0.461, -0.377], roll: 0, fov: 35 },
  notebook:  { position: [0.28, 1.05, 0.62], target: [0.06, 0.07, -0.05],      roll: 0, fov: 45 },
  frame:     { position: [2.538, 1.135, 1.582], target: [3.345, 0.357, 0.036], roll: 0 },
  lamp:      { position: [1.699, 2.418, 4.725], target: [1.699, 1.6, -0.055],  roll: 0 },
}

export default cameraTargets
