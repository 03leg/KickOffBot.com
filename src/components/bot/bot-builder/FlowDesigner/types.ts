export interface PositionDescription {
  x: number;
  y: number;
}

export interface TransformDescription extends PositionDescription {
  scale: number;
}
