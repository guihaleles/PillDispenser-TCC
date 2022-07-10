import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Slot } from '../scheduler/scheduler.component';
import { CODE_ACTION_MAP } from './codeMap.entity';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {
    this.getUpdateRTCMsg(new Date());
  }

  getIsAliveMessage() {
    const msg = [0, 0, 0, 0, 0, 0, 0, CODE_ACTION_MAP.isAlive];
    return msg;
  }

  getSendTimeSettingMsg(dateTime: string, slot: number) {
    const date = new Date(dateTime);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = parseInt(date.getFullYear().toString().slice(-2), 10);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const msg = [
      parseInt(day.toString(10), 16),
      parseInt(month.toString(10), 16),
      parseInt(year.toString(10), 16),
      parseInt(hours.toString(10), 16),
      parseInt(minutes.toString(10), 16),
      parseInt(seconds.toString(10), 16),
      slot,
      CODE_ACTION_MAP.sendTimeSetting,
    ];
    return msg;
  }

  getGetConfigDispenserTimeMsg(slot: number) {
    const msg = [
      0,
      0,
      0,
      0,
      0,
      0,
      slot,
      CODE_ACTION_MAP.getConfigDispenserTime,
    ];
    return msg;
  }

  getUpdateRTCMsg(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = parseInt(date.getFullYear().toString().slice(-2), 10);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const msg = [
      parseInt(day.toString(10), 16),
      parseInt(month.toString(10), 16),
      parseInt(year.toString(10), 16),
      parseInt(hours.toString(10), 16),
      parseInt(minutes.toString(10), 16),
      parseInt(seconds.toString(10), 16),
      0,
      CODE_ACTION_MAP.updateRtc,
    ];
    console.log(msg);

    return msg;
  }

  getStartInsertionProcess(slotNumber: number) {
    const msg = [
      0,
      0,
      0,
      0,
      0,
      0,
      slotNumber,
      CODE_ACTION_MAP.startInsertionProcess,
    ];
    return msg;
  }

  getFinishInsertionProcess(slotNumber: number) {
    const msg = [
      0,
      0,
      0,
      0,
      0,
      0,
      slotNumber,
      CODE_ACTION_MAP.finishInsetionProcess,
    ];
    return msg;
  }

  getSlotsPillsInsertedmsg() {
    const msg = [0, 0, 0, 0, 0, 0, 0, CODE_ACTION_MAP.getSlotsPillsInserted];
    return msg;
  }
}
