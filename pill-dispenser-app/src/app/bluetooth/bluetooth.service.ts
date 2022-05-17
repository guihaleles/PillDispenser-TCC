import { Byte } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  CODE_ACTION_MAP,
  DeviceActions,
  DeviceMessage,
} from './codeMap.entity';
import { MessageService } from './message.service';

interface Pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}

export enum DeviceConnectionState {
  disconnected = 'Desconectado',
  connecting = 'Conectando',
  connected = 'Conectado',
}

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  pairedList: Pairedlist[];
  deviceName = 'HC-06';
  deviceMessage$ = new Subject<string>();
  bluetoothServiceMsgs$ = new Subject<string>();
  deviceConnected$ = new BehaviorSubject<DeviceConnectionState>(
    DeviceConnectionState.disconnected
  );
  constructor(
    private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public alertController: AlertController,
    private readonly msgService: MessageService
  ) {
    this.checkBluetoothEnabled();
  }

  async alert(msg = 'Alert') {
    const alert = this.alertController.create({
      message: msg,
      buttons: ['Ok'],
    });
    (await alert).present();
    return (await alert).onDidDismiss();
  }

  async toast(msg = 'Toast') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  checkBluetoothEnabled() {
    this.deviceConnected$.next(DeviceConnectionState.disconnected);
    this.bluetoothSerial.isEnabled().then(
      (success) => {
        this.bluetoothServiceMsgs$.next(JSON.stringify(success));
        this.listPairedDevices();
      },
      async (err) => {
        await this.alert('Por favor Habilite o Bluetooth');
        await this.error(err, 'pairWithDeviceOnList');
        this.checkBluetoothEnabled();
      }
    );
  }

  listPairedDevices() {
    this.deviceConnected$.next(DeviceConnectionState.connecting);
    this.bluetoothSerial.list().then(
      (data: Pairedlist[]) => {
        this.pairWithDeviceOnList(data);
        this.bluetoothServiceMsgs$.next('Devices:' + JSON.stringify(data));
      },
      async (err) => {
        await this.alert('Por favor Habilite o Bluetooth');
        await this.error(err, 'pairWithDeviceOnList');
        this.checkBluetoothEnabled();
      }
    );
  }

  async pairWithDeviceOnList(pairedlist: Pairedlist[]) {
    const device = pairedlist.filter(
      (deviceItem) => deviceItem.name === this.deviceName
    )[0];
    this.toast(device.name);
    if (device) {
      this.bluetoothSerial.connect(device.address).subscribe(
        (connectSuccess) => {
          this.deviceConnected$.next(DeviceConnectionState.connected);
          this.bluetoothServiceMsgs$.next(
            'Device:' + JSON.stringify(device.name)
          );
          this.deviceConnected();
        },
        async (err) => {
          this.deviceConnected$.next(DeviceConnectionState.disconnected);
          await this.error(err, 'pairWithDeviceOnList');
          this.checkBluetoothEnabled();
        }
      );
    } else {
      await this.error(
        'Não pareado, device não encontrado',
        'pairWithDeviceOnList'
      );
      this.checkBluetoothEnabled();
    }
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe(' ').subscribe(
      (success: string) => {
        this.updateRtc();
        this.toast('Sucesso - Dispositivo conectado');
        this.bluetoothServiceMsgs$.next(JSON.stringify(success));
        this.deviceMessage$.next(success);
      },
      async (err) => {
        await this.error(err, 'deviceConnected');
        this.checkBluetoothEnabled();
      }
    );
  }

  parseDeviceMessage(msg: string) {
    const splitMessage = msg.split(':');

    if (splitMessage[0] && DeviceActions[splitMessage[0]]) {
    }
  }

  sendCommand(unit8Array: Byte[]) {
    const defaultData = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    this.bluetoothSerial.write(unit8Array).then(
      (success) => {
        this.bluetoothServiceMsgs$.next(
          'sendCommand success:' + JSON.stringify(success)
        );
      },
      async (err) => {
        await this.error(err, 'sendCommand');
      }
    );
  }

  sendCommandString(command: string = '') {
    this.bluetoothSerial.write(command).then(
      (success) => {
        this.bluetoothServiceMsgs$.next(
          'sendCommandString success:' + JSON.stringify(success)
        );
      },
      async (err) => {
        await this.error(err, 'sendCommandString');
      }
    );
  }

  async error(err: any, functionName: string) {
    const error = functionName + ' : ' + JSON.stringify(err);
    this.bluetoothServiceMsgs$.next(error);
    this.toast(error);
    await this.sleeper(5000);
  }

  sleeper(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(''), ms));
  }

  updateRtc() {
    const date = new Date(Date.now());
    const msg = this.msgService.getUpdateRTCMsg(date);
    this.sendCommand(msg);
  }
}
