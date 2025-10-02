import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(public httpClient: HttpClient) { }

  get_current_results(game_id = "") {
    const get_url = environment.backend + "get_current_results";
    let parameters = new HttpParams().append('game_id', game_id)
    return this.httpClient.get(get_url, { params: parameters });
  }

  save_result(game_id = "", user_id = "", ship_hit_points = "", ship_kill_points = "", question_points = "", bonus_points = "", penalty_points = "") {
    const create_url = environment.backend + "save_result";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('user_id', user_id);
    parameters = parameters.append('ship_hit_points', ship_hit_points);
    parameters = parameters.append('ship_kill_points', ship_kill_points);
    parameters = parameters.append('question_points', question_points);
    parameters = parameters.append('bonus_points', bonus_points);
    parameters = parameters.append('penalty_points', penalty_points);
    return this.httpClient.put(create_url, {}, { params: parameters });
  }

  save_initial_result(game_id = "") {
    const create_url = environment.backend + "save_initial_result";
    return this.httpClient.post(create_url, { game_id });
  }

  update_result(game_id = "", user_id = "", ship_hit_points = "", ship_kill_points = "", question_points = "", bonus_points = "", penalty_points = "") {
    const create_url = environment.backend + "update_result";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('user_id', user_id);
    parameters = parameters.append('ship_hit_points', ship_hit_points);
    parameters = parameters.append('ship_kill_points', ship_kill_points);
    parameters = parameters.append('question_points', question_points);
    parameters = parameters.append('bonus_points', bonus_points);
    parameters = parameters.append('penalty_points', penalty_points);
    return this.httpClient.put(create_url, {}, { params: parameters });
  }
}
