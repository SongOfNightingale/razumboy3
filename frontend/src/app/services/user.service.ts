import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public httpClient: HttpClient) { }

  login(username = "", password = ""){
    const create_url = environment.backend + "login";
    let parameters = new HttpParams().set('username', username);
    parameters = parameters.append('password', password);
    return this.httpClient.post(create_url, {}, {params:parameters});
  }

  add_user(username = "", password = "", role = ""){
    const create_url = environment.backend + "add_user";
    let parameters = new HttpParams().set('username', username);
    parameters = parameters.append('password', password);
    parameters = parameters.append('role', role);
    return this.httpClient.post(create_url, {}, {params:parameters});
  }

  get_all_users(){
    const get_url = environment.backend + "get_all_users";
    return this.httpClient.get(get_url);
  }

  delete_user(username = ""){
    const delete_url = environment.backend + "delete_user";
    let parameters = new HttpParams().append('username', username);
    return this.httpClient.delete(delete_url, {params:parameters});
  }

  update_user(new_username = "", old_username = "", password = ""){
    const update_url = environment.backend + "update_user";
    let parameters = new HttpParams().append('new_username', new_username)
    parameters = parameters.append('old_username', old_username);
    parameters = parameters.append('password', password);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }

  get_all_game_users(){
    const get_url = environment.backend + "get_all_game_users";
    return this.httpClient.get(get_url);
  }

  change_user_status(user_id = "", is_active = ""){
    const update_url = environment.backend + "change_user_status";
    let parameters = new HttpParams().append('user_id', user_id)
    parameters = parameters.append('is_active', is_active);
    return this.httpClient.put(update_url, {}, {params:parameters});
  }
}
