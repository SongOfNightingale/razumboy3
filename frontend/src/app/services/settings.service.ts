import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(public httpClient: HttpClient) { }

  update_numbers(o_number = 0, language = "") {
    const update_url = environment.backend + "update_numbers";
    let parameters = new HttpParams().append('o_number', o_number);
    parameters = parameters.append('language', language);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }

  get_numbers() {
    const get_url = environment.backend + "get_numbers";
    return this.httpClient.get(get_url);
  }

  update_special(special = ""){
    const update_url = environment.backend + "update_special";
    let parameters = new HttpParams().append('special', special);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }
}
