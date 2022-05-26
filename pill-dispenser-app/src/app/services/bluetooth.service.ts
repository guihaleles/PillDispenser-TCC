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

interface BlDevice {
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

export const RXBUFFERSIZE = 8;

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  pairedList: BlDevice[];
  deviceName = 'HC-06';
  deviceMessage$ = new Subject<string>();
  command$ = new Subject<Uint8Array>();
  bluetoothServiceMsgs$ = new Subject<string>();
  bluetoothServiceMsgs: string[] = [];
  deviceConnected$ = new BehaviorSubject<DeviceConnectionState>(
    DeviceConnectionState.disconnected
  );
  constructor(
    private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public alertController: AlertController,
    private readonly msgService: MessageService
  ) {
    this.startBluetoothConnection();

    this.bluetoothServiceMsgs$.subscribe((data) => {
      this.bluetoothServiceMsgs.push(data);
    });
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

  async startBluetoothConnection() {
    this.deviceConnected$.next(DeviceConnectionState.disconnected);
    try {
      const isEnabled = await this.bluetoothSerial.isEnabled();
      const pairedList: BlDevice[] = await this.bluetoothSerial.list();

      const device = pairedList.filter(
        (deviceItem) => deviceItem.name === this.deviceName
      )[0];

      if (device) {
        this.connectToDevice(device);
      } else {
        await this.error(
          'Não pareado, device não encontrado',
          'pairWithDeviceOnList'
        );
        this.startBluetoothConnection();
      }
    } catch (error) {
      await this.toast('Por favor Habilite o Bluetooth');
      await this.error(error, 'pairWithDeviceOnList');
      this.startBluetoothConnection();
    }
  }

  async connectToDevice(device: BlDevice) {
    this.bluetoothSerial.connect(device.address).subscribe(
      (connectSuccess) => {
        this.deviceConnected$.next(DeviceConnectionState.connected);
        this.bluetoothServiceMsgs$.next(
          'Device:' + JSON.stringify(device.name)
        );

        this.toast('Sucesso - Dispositivo conectado');
        this.updateRtc();
        this.subscribeToIncommingData();
      },
      async (err) => {
        this.deviceConnected$.next(DeviceConnectionState.disconnected);
        await this.error(err, 'pairWithDeviceOnList');
        this.startBluetoothConnection();
      }
    );
  }

  subscribeToIncommingData() {
    this.bluetoothSerial.subscribeRawData().subscribe(
      (success) => {
        if (success instanceof ArrayBuffer) {
          const data = new Uint8Array(success);
          this.bluetoothServiceMsgs$.next(data.toString());
          this.deviceMessage$.next(data.toString());
          this.receivedCommand(data);
          this.toast(data.toString());
        }
      },
      async (err) => {
        await this.error(err, 'deviceConnected');
        this.startBluetoothConnection();
      }
    );
  }

  receivedCommand(data: Uint8Array) {
    this.command$.next(data);
  }

  dispenserStarted() {}

  async sendCommand(unit8Array: number[]) {
    try {
      this.toast(unit8Array.toString());
      await this.bluetoothSerial.write(unit8Array);
      this.toast('messagem enviada');
    } catch (error) {
      this.toast('Erro ao enviar messagem');
    }
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

  async updateRtc() {
    const date = new Date(Date.now());
    const msg = this.msgService.getUpdateRTCMsg(date);
    this.sendCommand(msg);
  }
}
