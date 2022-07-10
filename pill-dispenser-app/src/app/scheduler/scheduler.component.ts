import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService, RXBUFFERSIZE } from '../services/bluetooth.service';
import { MessageService } from '../services/message.service';
import { ModalSchedulerComponent } from '../modal-scheduler/modal-scheduler.component';
import { CODE_ACTION_MAP } from '../services/codeMap.entity';
import { StorageService } from '../services/storage.service';
import { interval, Subscription } from 'rxjs';

export class Slot {
  slotNumber = 0;
  insertionProcess = false;
  inserted = false;
  removed = false;
  dateTime = '01-Jan-20 00:00:00';
  removedDateTime = '';
  medication = '';
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit, OnDestroy {
  slotNumbers = [1, 2, 3, 4, 5, 6, 7];
  slots: Slot[] = [];
  configScheduler: string[] = [];
  poolSub: Subscription;
  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly msgService: MessageService,
    private readonly storageService: StorageService,
    public modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.poolSub?.unsubscribe();
  }

  ngOnInit() {
    this.storageService.storageReady.subscribe((value) => {
      if (value === true) {
        this.getConfig();
      }
    });

    this.bluetoothService.command$.subscribe((command) => {
      this.receiveCommand(command);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });

    this.sendSlotFilledMsg();
  }

  getConfig() {
    this.slotNumbers.forEach(async (slotNumber) => {
      const slot = (await this.storageService.get(
        slotNumber.toString()
      )) as Slot;

      const newSlot = new Slot();
      newSlot.slotNumber = slotNumber;
      if (this.slots[slotNumber]) {
        this.slots[slotNumber] = slot || newSlot;
      } else {
        this.slots.push(slot || newSlot);
      }
    });
  }

  receiveCommand(command: number[]) {
    const commandType = command[RXBUFFERSIZE - 1];
    const slotNumber = command[RXBUFFERSIZE - 2];
    this.bluetoothService.toast(command.toString());
    switch (commandType) {
      case CODE_ACTION_MAP.getSlotsPillsInserted:
        this.bluetoothService.toast('pillInserted');
        this.pillInserted(command);
        break;
    }
    this.cdr.detectChanges();
  }

  async openingConfigProcess(slot: Slot) {
    try {
      const modal = await this.modalController.create({
        component: ModalSchedulerComponent,
        swipeToClose: true,
        componentProps: { slot: slot.slotNumber },
      });

      await modal.present();
      await this.sendSlotFilledMsg();
      return;
    } catch {
      this.bluetoothService.alert('Erro ao iniciar processo de inserção');
    }
  }

  public teste() {
    // eslint-disable-next-line no-debugger
    debugger;
  }

  async dateTimeChange(date: string, slot: Slot) {
    try {
      slot.dateTime = date;
      const slotNumber = slot.slotNumber;
      const msg = this.msgService.getSendTimeSettingMsg(date, slotNumber);
      await this.bluetoothService.sendCommand(msg);

      this.storageService.set(slot.slotNumber.toString(), slot);
    } catch (error) {
      this.bluetoothService.alert('Erro ao enviar novo horário ao dispensador');
    }
  }

  pillInserted(data: number[]) {
    try {
      const dataaux = data.forEach((value, slotNumber) => {
        const slotAux = this.slots[slotNumber];

        if (value === 0 && slotAux.inserted === true) {
          this.saveSlotHist(this.slots[slotNumber]);
        }

        slotAux.inserted = value > 0 ? true : false;
        this.storageService.set(slotAux.slotNumber.toString(), slotAux);
      });
    } catch (error) {
      this.bluetoothService.toast('Erro ao salvar estado da pílula');
    }
  }
  async saveSlotHist(slot: Slot) {
    const slots = (await this.storageService.get('historico')) as Slot[];
    if (slots) {
      slots.push(slot);
      this.storageService.set('historico', slots);
    } else {
      this.storageService.set('historico', [slot]);
    }
  }

  async sendSlotFilledMsg() {
    console.log('enviada');
    this.bluetoothService.command$.next([1, 0, 0, 0, 0, 0, 0, 16]);
    this.bluetoothService.command$.next([0, 0, 0, 0, 0, 0, 0, 16]);
    const msg = this.msgService.getSlotsPillsInsertedmsg();
    await this.bluetoothService.sendCommand(msg);
  }
}
