export enum DeviceActions {
  isAlive = 'isAlive',
}

export const CODE_ACTION_MAP: Record<DeviceActions, Uint8Array> = {
  isAlive: new Uint8Array([0, 0, 0, 1]),
};

export interface DeviceMessage {
  action: DeviceActions;
  msg: string;
}
