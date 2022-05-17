import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ConfigComponent } from './config/config.component';
import { ModalSchedulerComponent } from './modal-scheduler/modal-scheduler.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SchedulerComponent,
    ConfigComponent,
    ModalSchedulerComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    BluetoothSerial,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
