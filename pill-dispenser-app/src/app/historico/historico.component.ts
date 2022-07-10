import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BluetoothService, RXBUFFERSIZE } from '../services/bluetooth.service';
import { MessageService } from '../services/message.service';
import { CODE_ACTION_MAP } from '../services/codeMap.entity';
import { StorageService } from '../services/storage.service';
import { Slot } from '../scheduler/scheduler.component';

export class Historico {
  dateTime = '01-Jul-22 08:45:00';
  dispensed = 'Não';
  pillRemoved = 'Não';
  medication = '';
}

const mock: Historico[] = [];

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
})
export class HistoricoComponent implements OnInit {
  historicos: Historico[] = mock;
  configHistorico: string[] = [];
  constructor(
    private readonly bluetoothService: BluetoothService,
    private readonly msgService: MessageService,
    private readonly storageService: StorageService,
    public modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.historicos = [];
    this.getConfig();
  }

  async getConfig() {
    const slots = (await this.storageService.get('historico')) as Slot[];

    if (slots) {
      slots.forEach((slot) => {
        const historico: Historico = {
          dateTime: slot.dateTime,
          dispensed: 'Sim',
          pillRemoved: 'Sim',
          medication: slot.medication,
        };

        this.historicos.push(historico);
      });
    }
  }
}
