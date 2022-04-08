import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-scheduler',
  templateUrl: './modal-scheduler.component.html',
  styleUrls: ['./modal-scheduler.component.scss'],
})
export class ModalSchedulerComponent implements OnInit {
  page = 1;

  constructor(private readonly modalController: ModalController) {}

  ngOnInit() {
    setTimeout(this.nextPage, 3.0 * 1000);
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
