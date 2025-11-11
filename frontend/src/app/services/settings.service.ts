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

  get_special_cells(game_id = "") {
    const get_url = environment.backend + "get_special_cells";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(get_url, {params:parameters});
  }

  set_special_cell(user_id = "", game_id = "", special_cell = ""){
    const update_url = environment.backend + "set_special_cell";
    let parameters = new HttpParams().append('user_id', user_id);
    parameters = parameters.append('game_id', game_id);
    parameters = parameters.append('special_cell', special_cell);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }

  get_translation(word = "") {
    const get_url = environment.backend + "get_translation";
    let parameters = new HttpParams().append('word', word);
    return this.httpClient.get(get_url, {params:parameters});
  }
}
