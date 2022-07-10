import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storageReady = new BehaviorSubject<boolean>(false);
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.storageReady.next(true);
  }

  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public setU(value: any) {
    return this._storage?.set('historico', value);
  }
}
