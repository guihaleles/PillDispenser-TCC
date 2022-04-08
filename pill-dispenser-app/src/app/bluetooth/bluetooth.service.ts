import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  CODE_ACTION_MAP,
  DeviceActions,
  DeviceMessage,
} from './codeMap.entity';

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
  deviceName = '';
  deviceMessage$ = new Subject<string>();
  deviceConnected$ = new BehaviorSubject<DeviceConnectionState>(
    DeviceConnectionState.disconnected
  );
  constructor(
    private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public alertController: AlertController
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
        this.listPairedDevices();
      },
      (error) => {
        this.toast(error);
        this.alert('Por favor Habilite o Bluetooth').then(() => {
          this.checkBluetoothEnabled();
        });
      }
    );
  }

  listPairedDevices() {
    this.deviceConnected$.next(DeviceConnectionState.connecting);
    this.bluetoothSerial.list().then(
      (data: Pairedlist[]) => {
        this.pairWithDeviceOnList(data);
      },
      (err) => {
        this.toast(err);
        this.alert('Por favor Habilite o Bluetooth').then(() => {
          this.checkBluetoothEnabled();
        });
      }
    );
  }

  pairWithDeviceOnList(pairedlist: Pairedlist[]) {
    const device = pairedlist.filter(
      (deviceItem) =>
        deviceItem.name === 'HC-06' || 'NAUTO31' || this.deviceName
    )[0];
    this.toast(device.name);
    if (device) {
      this.bluetoothSerial.connect(device.address).subscribe(
        (connectSuccess) => {
          this.deviceConnected$.next(DeviceConnectionState.connected);
          this.deviceConnected();
        },
        (err) => {
          this.deviceConnected$.next(DeviceConnectionState.disconnected);
          this.toast(err);
        }
      );
    } else {
      this.toast('HC-06 não pareado').then(() => {
        this.checkBluetoothEnabled();
      });
    }
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(
      (success: string) => {
        this.toast(success);
        this.deviceMessage$.next(success);
      },
      (error) => {
        this.toast(error);
        this.checkBluetoothEnabled();
      }
    );
  }

  parseDeviceMessage(msg: string) {
    const splitMessage = msg.split(':');

    if (splitMessage[0] && DeviceActions[splitMessage[0]]) {
    }
  }

  sendCommand(deviceActions: DeviceActions) {
    const unit8Array = CODE_ACTION_MAP[deviceActions];
    this.bluetoothSerial.write(unit8Array).then(
      (success) => {
        // this.toast(success);
      },
      (error) => {
        this.toast(error);
      }
    );
  }
}
