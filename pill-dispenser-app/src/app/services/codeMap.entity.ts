export enum DeviceActions {
  isAlive = 'isAlive',
  sendTimeSetting = 'sendTimeSetting',
  getConfigDispenserTime = 'getConfigDispenserTime',
  updateRtc = 'updateRtc',
  getRtc = 'getRtc',
  startDispenserRotationProcess = 'startDispenserRotationProcess',
  startInsertionProcess = 'startInsertionProcess',
  finishInsetionProcess = 'finishInsetionProcess',
  getSlotsPillsInserted = 'getSlotsPillsInserted',
}

export const CODE_ACTION_MAP: Record<DeviceActions, number> = {
  isAlive: 1,
  sendTimeSetting: 2,
  getConfigDispenserTime: 3,
  updateRtc: 4,
  getRtc: 5,
  startDispenserRotationProcess: 6,
  startInsertionProcess: 11,
  finishInsetionProcess: 12,
  getSlotsPillsInserted: 16,
};

export interface DeviceMessage {
  action: DeviceActions;
  msg: string;
}
