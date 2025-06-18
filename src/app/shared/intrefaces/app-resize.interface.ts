export interface OffsetPosition {
  offsetHeight: number;
  offsetLeft: number;
  offsetTop: number;
  offsetWidth: number;
}

export interface OffsetParent {
  _offsetHeight: number;
  _offsetLeft: number;
  _offsetTop: number;
  _offsetWidth: number;
}

export interface ContainerPosition {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Mouse {
  x: number;
  y: number;
}

export interface MouseClick {
  x: number;
  y: number;
  left: number;
  top: number;
}

export const enum rzStatus {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}
