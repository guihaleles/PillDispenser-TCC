import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../bluetooth/bluetooth.service';
import { DeviceActions } from '../bluetooth/codeMap.entity';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  deviceMessage = 'Init';
  deviceName = '';
  command: string = '';
  bluetoothServiceMsgs = [''];
  constructor(private readonly bluetoothService: BluetoothService) {}

  ngOnInit() {
    this.deviceName = this.bluetoothService.deviceName;
    this.bluetoothService.bluetoothServiceMsgs$.subscribe((msg) => {
      this.bluetoothServiceMsgs.push(msg);
    });
  }

  initConectionTest() {
    this.bluetoothService.toast('Iniciando teste de conexão');
    const defaultData = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    this.bluetoothService.sendCommand(defaultData);
    this.bluetoothService.deviceMessage$.subscribe((msg) => {
      this.deviceMessage = msg;
    });
  }

  changeDeviceToPairName() {
    this.bluetoothService.deviceName = this.deviceName;
  }

  sendCommand() {
    console.log('commando: ' + JSON.stringify(this.command));
    const commandParsed = this.command.split(' ');
    const data: number[] = [];
    commandParsed.forEach((commandData, index) => {
      data.push(parseInt(commandData));
    });

    this.bluetoothService.sendCommand(data);
  }
}
