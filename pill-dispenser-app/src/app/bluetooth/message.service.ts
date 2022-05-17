import { Injectable } from '@angular/core';
import { CODE_ACTION_MAP } from './codeMap.entity';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {
    this.getSendTimeSettingMsg('2022-05-17T19:30:25.478-03:00', 2);
  }

  getIsAliveMessage() {
    const msg = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01];
    return msg;
  }

  getSendTimeSettingMsg(dateTime: string, slot: number) {
    const date = new Date(dateTime);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const msg = [
      day,
      month,
      year,
      hours,
      minutes,
      seconds,
      slot,
      CODE_ACTION_MAP.sendTimeSetting,
    ];

    console.log(msg);
    return msg;
  }

  getGetConfigDispenserTimeMsg() {
    const msg = [
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      CODE_ACTION_MAP.getConfigDispenserTime,
    ];
    return msg;
  }

  getUpdateRTCMsg(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const msg = [
      day,
      month,
      year,
      hours,
      minutes,
      seconds,
      0x00,
      CODE_ACTION_MAP.updateRtc,
    ];

    return msg;
  }
}
