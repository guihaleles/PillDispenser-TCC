export enum DeviceActions {
  isAlive = 'isAlive',
  sendTimeSetting = 'sendTimeSetting',
  openingTimeSetting = 'openingTimeSetting',
  batteryLevel = 'batteryLevel',
}

export const CODE_ACTION_MAP: Record<DeviceActions, number> = {
  isAlive: 1,
  sendTimeSetting: 2,
  openingTimeSetting: 3,
  batteryLevel: 4,
};

export interface DeviceMessage {
  action: DeviceActions;
  msg: string;
}
