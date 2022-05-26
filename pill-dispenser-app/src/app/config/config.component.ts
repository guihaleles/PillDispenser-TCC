import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';
import { DeviceActions } from '../services/codeMap.entity';
import { MessageService } from '../services/message.service';

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
  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly messageService: MessageService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.deviceName = this.bluetoothService.deviceName;
    this.bluetoothService.bluetoothServiceMsgs$.subscribe((msg) => {
      this.bluetoothServiceMsgs = Object.assign(
        this.bluetoothService.bluetoothServiceMsgs
      );
      this._cdr.detectChanges();
    });
  }

  initConectionTest() {
    this.bluetoothService.toast('Iniciando teste de conexão');
    const defaultData = this.messageService.getIsAliveMessage();
    this.bluetoothService.sendCommand(defaultData);
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
