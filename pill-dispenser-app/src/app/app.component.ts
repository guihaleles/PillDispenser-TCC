import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Agendador', url: '/scheduler', icon: 'time' },
    { title: 'Configurador', url: '/config', icon: 'settings' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(private menu: MenuController) {}

  toggleMenu() {
    this.menu.toggle('first');
  }
}
