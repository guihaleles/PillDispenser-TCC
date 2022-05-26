import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService, RXBUFFERSIZE } from '../services/bluetooth.service';
import { CODE_ACTION_MAP } from '../services/codeMap.entity';

@Component({
  selector: 'app-modal-scheduler',
  templateUrl: './modal-scheduler.component.html',
  styleUrls: ['./modal-scheduler.component.scss'],
})
export class ModalSchedulerComponent implements OnInit {
  page = 0;
  @Input() slot: number;

  constructor(
    private readonly modalController: ModalController,
    private readonly bluetoothService: BluetoothService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // setTimeout(this.nextPage, 3.0 * 1000);
    this.bluetoothService.command$.subscribe((command) => {
      this.receiveCommand(command);
    });
  }

  receiveCommand(command: Uint8Array) {
    const commandType = command[RXBUFFERSIZE - 1];
    const slot = command[RXBUFFERSIZE - 2];
    if (slot == this.slot)
      switch (commandType) {
        case CODE_ACTION_MAP.startInsertionProcess:
          this.bluetoothService.toast('modal recebi pag1');
          this.page = 1;
          this._cdr.detectChanges();
          break;
        case CODE_ACTION_MAP.waitingForInsertion:
          this.bluetoothService.toast('modal recebi pag2');
          this.page = 2;
          this._cdr.detectChanges();
          break;
        case CODE_ACTION_MAP.pillInserted:
          this.bluetoothService.toast('modal recebi pag3');
          this.page = 3;
          this._cdr.detectChanges();
          break;
        default:
          break;
      }
  }

  nextPage = () => {
    this.page++;
    if (this.page < 3) {
      setTimeout(this.nextPage, 3.0 * 1000);
    }
  };

  cancel() {
    this.page = 10;
    setTimeout(this.close, 3.0 * 1000);
  }

  close = () => {
    this.modalController.dismiss();
  };
}
