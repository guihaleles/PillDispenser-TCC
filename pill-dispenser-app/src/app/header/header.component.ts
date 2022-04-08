import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BluetoothService } from '../bluetooth/bluetooth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();

  battery = 0;
  bluetoothStatus = 'Desconectado';

  constructor(private readonly bluetoothService: BluetoothService) {}

  ngOnInit() {
    this.bluetoothService.deviceConnected$.subscribe((value) => {
      this.bluetoothStatus = value;
    });
  }

  openMenu() {
    this.toggleMenu.emit();
  }
}
