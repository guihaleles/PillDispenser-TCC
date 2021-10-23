import { Component, OnInit } from '@angular/core';
import { BluetoothService } from '../bluetooth/bluetooth.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  slots = [1, 2, 3, 4, 5, 6, 7];
  constructor(private readonly bluetoothService: BluetoothService) {}

  ngOnInit() {}
}
