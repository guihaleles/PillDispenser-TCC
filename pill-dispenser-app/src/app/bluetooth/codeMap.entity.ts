export enum DeviceActions {
  isAlive = 'isAlive',
  sendTimeSetting = 'sendTimeSetting',
  getConfigDispenserTime = 'getConfigDispenserTime',
  updateRtc = 'updateRtc',
}

export const CODE_ACTION_MAP: Record<DeviceActions, number> = {
  isAlive: 1,
  sendTimeSetting: 2,
  getConfigDispenserTime: 3,
  updateRtc: 4,
};

export interface DeviceMessage {
  action: DeviceActions;
  msg: string;
}
