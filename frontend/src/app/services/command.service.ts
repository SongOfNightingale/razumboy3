import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(public httpClient: HttpClient) { }

  set_command(command = "", number = 0){
    const update_url = environment.backend + "set_command";
    let parameters = new HttpParams().append('command', command)
    parameters = parameters.append('number', number);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }

  get_command(){
    const get_url = environment.backend + "get_command";
    return this.httpClient.get(get_url);
  }
}
