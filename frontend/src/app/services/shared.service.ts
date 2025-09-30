import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public Data = new BehaviorSubject<any>([]);

  constructor() { }
  
  setData(data: any) {
     this.Data.next(data);
  }

  getData() {
     return this.Data.asObservable();
  }
}