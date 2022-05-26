export enum DeviceActions {
  isAlive = 'isAlive',
  sendTimeSetting = 'sendTimeSetting',
  getConfigDispenserTime = 'getConfigDispenserTime',
  updateRtc = 'updateRtc',
  getRtc = 'getRtc',
  startDispenserRotationProcess = 'startDispenserRotationProcess',
  startInsertionProcess = 'startInsertionProcess',
  waitingForInsertion = 'waitingForInsertion',
  pillInserted = 'pillInserted',
  returningToHome = 'returningToHome',
}

export const CODE_ACTION_MAP: Record<DeviceActions, number> = {
  isAlive: 1,
  sendTimeSetting: 2,
  getConfigDispenserTime: 3,
  updateRtc: 4,
  getRtc: 5,
  startDispenserRotationProcess: 6,
  startInsertionProcess: 11,
  waitingForInsertion: 12,
  pillInserted: 13,
  returningToHome: 14,
};

export interface DeviceMessage {
  action: DeviceActions;
  msg: string;
}
