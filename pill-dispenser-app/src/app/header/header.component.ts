import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BluetoothService } from '../services/bluetooth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();

  battery = 0;
  bluetoothStatus = 'Desconectado';
  bluetoothStatus$ = this.bluetoothService.deviceConnected$;

  constructor(
    private readonly bluetoothService: BluetoothService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.bluetoothService.deviceConnected$.subscribe((value) => {
      this.bluetoothStatus = value;
      this._cdr.detectChanges();
    });
  }

  openMenu() {
    this.toggleMenu.emit();
  }
}
