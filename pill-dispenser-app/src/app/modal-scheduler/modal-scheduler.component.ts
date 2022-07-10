import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService, RXBUFFERSIZE } from '../services/bluetooth.service';
import { CODE_ACTION_MAP } from '../services/codeMap.entity';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-modal-scheduler',
  templateUrl: './modal-scheduler.component.html',
  styleUrls: ['./modal-scheduler.component.scss'],
})
export class ModalSchedulerComponent implements OnInit {
  @Input() slot: number;
  page = 0;
  command = 0;

  constructor(
    private readonly modalController: ModalController,
    private readonly bluetoothService: BluetoothService,
    private readonly msgService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // setTimeout(this.nextPage, 3.0 * 1000);
    this.bluetoothService.command$.subscribe((command) => {
      this.receiveCommand(command);
    });
  }

  receiveCommand(command: number[]) {
    const commandType = command[RXBUFFERSIZE - 1];
    this.command = commandType;
    const slot = command[RXBUFFERSIZE - 2];

    if (slot === this.slot) {
      switch (commandType) {
        case CODE_ACTION_MAP.startDispenserRotationProcess:
          this.page++;
          this.cdr.detectChanges();
          break;

        case CODE_ACTION_MAP.finishInsetionProcess:
          this.page++;
          this.cdr.detectChanges();
          break;
        default:
          break;
      }

      this.cdr.detectChanges();
    }
  }

  nextPage = () => {
    this.page++;
    if (this.page < 3) {
      setTimeout(this.nextPage, 3.0 * 1000);
    }
  };

  finish() {
    this.page = 3;
    this.finishInsertionProcess();
  }

  start() {
    this.startInsertionProcess();
    this.page = 1;
    setTimeout(() => {
      this.page = 2;
    }, 3.0 * 1000);
  }

  async startInsertionProcess() {
    const msg = this.msgService.getStartInsertionProcess(this.slot);
    await this.bluetoothService.sendCommand(msg);
  }

  async finishInsertionProcess() {
    const msg = this.msgService.getFinishInsertionProcess(this.slot);
    await this.bluetoothService.sendCommand(msg);
  }

  async sendSlotFilledMsg() {
    console.log('enviada');
    const msg = this.msgService.getSlotsPillsInsertedmsg();
    await this.bluetoothService.sendCommand(msg);
  }

  close = () => {
    this.sendSlotFilledMsg();
    this.modalController.dismiss();
  };
}
