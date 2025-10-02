import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BattlefieldService {

  constructor(private http: HttpClient) { }

  saveFleetLayout(game: string, shipsData: any[]) {
    const create_url = environment.backend + "save_fleet_layout";
    return this.http.post(create_url, {
      game: game,
      ships_data: shipsData
    });
  }

  loadFleetLayout(game: any) {
    const get_url = environment.backend + "load_fleet_layout";
    return this.http.get<any[]>(get_url + `?game_id=${game}`);
  }

  updateFleetLayout(game: string, shipsData: any[], revealed_water: string) {
    const create_url = environment.backend + "update_fleet_layout";
    return this.http.post(create_url, {
      game: game,
      ships_data: shipsData,
      revealed_water: revealed_water
    });
  }

  saveQueue(gameId: number, reversedNames: string[], highlightedIndex: number) {
    const create_url = environment.backend + "save_queue";
    return this.http.post(create_url, {
      game_id: gameId,
      names: reversedNames,
      current: highlightedIndex
    });
  }


  save_current(game: any, current: any) {
    const create_url = environment.backend + "save_current";
    let parameters = new HttpParams().append('game_id', game);
    parameters = parameters.append('current', current);
    return this.http.get(create_url, { params: parameters });
  }

  getQueue(game: any) {
    const create_url = environment.backend + "get_queue";
    let parameters = new HttpParams().append('game_id', game);
    return this.http.get(create_url, { params: parameters });
  }
}
