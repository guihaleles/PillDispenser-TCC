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
  constructor(private readonly bluetoothService: BluetoothService) {}

  ngOnInit() {}

  initConectionTest() {
    this.bluetoothService.toast('Iniciando teste de conexão');
    this.bluetoothService.sendCommand(DeviceActions.isAlive);
    this.bluetoothService.deviceMessage$.subscribe((msg) => {
      this.deviceMessage = msg;
    });
  }
}
