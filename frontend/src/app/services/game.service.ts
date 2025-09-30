import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(public httpClient: HttpClient) { }

  add_game(game_name = "") {
    const create_url = environment.backend + "add_game";
    let parameters = new HttpParams().append('game_name', game_name);
    return this.httpClient.post(create_url, {}, { params: parameters });
  }

  get_all_games() {
    const get_url = environment.backend + "get_all_games";
    return this.httpClient.get(get_url);
  }

  start_game(game_id = "") {
    const update_url = environment.backend + "start_game";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(update_url, {params:parameters});
  }

  end_game(game_id = "") {
    const update_url = environment.backend + "end_game";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(update_url, {params:parameters});
  }

  delete_game(game_id = "") {
    const delete_url = environment.backend + "delete_game";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(delete_url, {params:parameters});
  }

  update_game(game_id = "", new_game_name = "") {
    const update_url = environment.backend + "update_game";
    let parameters = new HttpParams().append('game_id', game_id);
    parameters = parameters.append('new_game_name', new_game_name);
    return this.httpClient.get(update_url, {params:parameters});
  }
  
  clone_game(game_id = "") {
    const create_url = environment.backend + "clone_game";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(create_url, {params:parameters});
  }
}
