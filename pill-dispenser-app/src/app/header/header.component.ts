import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();

  battery = 0;
  bluetoothStatus = 'Desconectado';

  constructor() {}

  ngOnInit() {}

  openMenu() {
    this.toggleMenu.emit();
  }
}
