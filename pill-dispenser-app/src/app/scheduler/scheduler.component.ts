import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService, RXBUFFERSIZE } from '../services/bluetooth.service';
import { MessageService } from '../services/message.service';
import { ModalSchedulerComponent } from '../modal-scheduler/modal-scheduler.component';
import { CODE_ACTION_MAP } from '../services/codeMap.entity';
import { StorageService } from '../services/storage.service';

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
export class SchedulerComponent implements OnInit {
  slotNumbers = [0, 1, 2, 3, 4, 5, 6];
  slots: Slot[] = [];
  configScheduler: string[] = [];
  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly msgService: MessageService,
    private readonly storageService: StorageService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.storageService.storageReady.subscribe((value) => {
      if (value == true) this.getConfig();
    });

    this.bluetoothService.command$.subscribe((command) => {
      this.receiveCommand(command);
    });
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

  receiveCommand(command: Uint8Array) {
    const commandType = command[RXBUFFERSIZE - 1];
    const slotNumber = command[RXBUFFERSIZE - 2];
    switch (commandType) {
      case CODE_ACTION_MAP.pillInserted:
        this.pillInserted(slotNumber);
        break;
    }
  }

  async openingConfigProcess(slot: Slot) {
    try {
      await this.startInsertionProcess(slot);
      const modal = await this.modalController.create({
        component: ModalSchedulerComponent,
        swipeToClose: true,
        componentProps: { slot: slot.slotNumber },
      });

      return await modal.present();
    } catch {
      this.bluetoothService.alert('Erro ao iniciar processo de inserção');
    }
  }

  public teste() {
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

  async startInsertionProcess(slot: Slot) {
    const msg = this.msgService.getStartInsertionProcess(slot.slotNumber);
    await this.bluetoothService.sendCommand(msg);
  }

  pillInserted(slotNumber: number) {
    try {
      const slot = this.slots.find((value) => {
        return value.slotNumber === slotNumber;
      });

      if (!slot) throw new Error();

      slot.inserted = true;
      this.storageService.set(slot.slotNumber.toString(), slot);
    } catch (error) {
      this.bluetoothService.toast('Erro ao salvar estado da pílula');
    }
  }
}
