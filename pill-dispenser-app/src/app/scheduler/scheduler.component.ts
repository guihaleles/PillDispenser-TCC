import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService } from '../bluetooth/bluetooth.service';
import { MessageService } from '../bluetooth/message.service';
import { ModalSchedulerComponent } from '../modal-scheduler/modal-scheduler.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  slots = [1, 2, 3, 4, 5, 6, 7];
  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly msgService: MessageService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  async openingConfigProcess(slot: number) {
    const modal = await this.modalController.create({
      component: ModalSchedulerComponent,
      swipeToClose: true,
    });

    return await modal.present();
  }

  dateTimeChange(date: string, slot: number) {
    const msg = this.msgService.getSendTimeSettingMsg(date, slot);
    console.log(msg);
  }
}
