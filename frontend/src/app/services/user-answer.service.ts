import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAnswerService {

  constructor(public httpClient: HttpClient) { }

  get_user_answers(questions_id = "", game_id = "") {
    const get_url = environment.backend + "get_user_answers";
    let parameters = new HttpParams().append('questions_id', questions_id);
    parameters = parameters.append('game_id', game_id);
    return this.httpClient.get(get_url, {params:parameters});
  }

  assign_answer_points(game_id="", question_id = "", team = "", is_correct = "", points = "", checked = ""){
    const update_url = environment.backend + "assign_answer_points";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('team', team);
    parameters = parameters.append('is_correct', is_correct);
    parameters = parameters.append('points', points);
    parameters = parameters.append('checked', checked);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }

  set_user_answer(text = "", game_id = "", question_id = "", user_id = "", sync = ""){
    const create_url = environment.backend + "set_user_answer";
    let parameters = new HttpParams().set('text', text);
    parameters = parameters.append('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('user_id', user_id);
    parameters = parameters.append('sync', sync);
    return this.httpClient.post(create_url, {}, {params:parameters});
  }

  set_provisional_answer(text = "", game_id = "", question_id = "", user_id = ""){
    const create_url = environment.backend + "set_provisional_answer";
    let parameters = new HttpParams().set('text', text);
    parameters = parameters.append('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('user_id', user_id);
    return this.httpClient.post(create_url, {}, {params:parameters});
  }

  get_provisional_answer(game_id = "", question_id = "", user_id = ""){
    const get_url = environment.backend + "get_provisional_answer";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('user_id', user_id);
    return this.httpClient.get(get_url, {params:parameters});
  }

  get_all_game_answers(game_id = "") {
    const get_url = environment.backend + "get_all_game_answers";
    let parameters = new HttpParams().append('game_id', game_id);
    return this.httpClient.get(get_url, {params:parameters});
  }

  delete_user_answer(game_id = "", question_id = "", user_id = ""){
    const delete_url = environment.backend + "delete_user_answer";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('user_id', user_id);
    return this.httpClient.post(delete_url, {}, {params:parameters});
  }

  delete_user_answer_by_id(answer_id = ""){
    const delete_url = environment.backend + "delete_user_answer_by_id";
    let parameters = new HttpParams().set('answer_id', answer_id);
    return this.httpClient.post(delete_url, {}, {params:parameters});
  }

  zero_user_answer(game_id = "", question_id = "", user_id = ""){
    const update_url = environment.backend + "zero_user_answer";
    let parameters = new HttpParams().set('game_id', game_id);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('user_id', user_id);
    return this.httpClient.post(update_url, {}, {params:parameters});
  }
}
