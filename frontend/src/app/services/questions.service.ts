import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(public httpClient: HttpClient) { }

  get_all_question_types() {
    const get_url = environment.backend + "get_all_question_types";
    return this.httpClient.get(get_url);
  }

  add_question(text = "", image_link = "", audio_link = "", video_link = "", comment = "", question_type_id = "", textAnswer = "", radioAnswer: any[], answer_image_link = "", answer_music_link = "", checked = false, time_to_answer = "") {
    const create_url = environment.backend + "add_question";
    let parameters = new HttpParams().set('question_text', text);
    parameters = parameters.append('image_link', image_link);
    parameters = parameters.append('audio_link', audio_link);
    parameters = parameters.append('video_link', video_link);
    parameters = parameters.append('question_comment', comment);
    parameters = parameters.append('question_type_id', question_type_id);
    parameters = parameters.append('answer_image_link', answer_image_link);
    parameters = parameters.append('answer_music_link', answer_music_link);
    parameters = parameters.append('time_to_answer', time_to_answer);
    let draw = 0;
    if (checked) { draw = 1; }
    parameters = parameters.append('checked', draw);
    if (question_type_id == "1") {
      parameters = parameters.append('answer', textAnswer);
      parameters = parameters.append('is_correct', "1");
    }
    else if (question_type_id == "2" || question_type_id == "3") {
      parameters = parameters.append('index', radioAnswer.length);
      for (let i = 0; i < radioAnswer.length; i++) {
        if (radioAnswer[i].checked) { radioAnswer[i].checked = 1 }
        else { radioAnswer[i].checked = 0 }
        parameters = parameters.append('answer' + i.toString(), radioAnswer[i].answer);
        parameters = parameters.append('is_correct' + i.toString(), radioAnswer[i].checked);
      }
    }
    else if (question_type_id == "4") {
      parameters = parameters.append('index', radioAnswer.length);
      for (let i = 0; i < radioAnswer.length; i++) {
        parameters = parameters.append('answer' + i.toString(), radioAnswer[i].answer);
        if (radioAnswer[i].points > 0) {
          parameters = parameters.append('is_correct' + i.toString(), 1);
        }
        else {
          parameters = parameters.append('is_correct' + i.toString(), 0);
        }
        parameters = parameters.append('points' + i.toString(), radioAnswer[i].points);
      }
    }
    return this.httpClient.post(create_url, {}, { params: parameters });
  }

  get_all_questions() {
    const get_url = environment.backend + "get_all_questions";
    return this.httpClient.get(get_url);
  }

  get_all_game_questions() {
    const get_url = environment.backend + "get_all_game_questions";
    return this.httpClient.get(get_url);
  }

  get_all_draw_questions() {
    const get_url = environment.backend + "get_all_draw_questions";
    return this.httpClient.get(get_url);
  }

  delete_question(id = "") {
    const delete_url = environment.backend + "delete_question";
    let parameters = new HttpParams().append('question_id', id);
    return this.httpClient.delete(delete_url, { params: parameters });
  }

  get_question(question_id = "") {
    const get_url = environment.backend + "get_question";
    let parameters = new HttpParams().append('question_id', question_id)
    return this.httpClient.get(get_url, { params: parameters });
  }

  get_question_answers(question_id = "") {
    const get_url = environment.backend + "get_question_answers";
    let parameters = new HttpParams().append('question_id', question_id)
    return this.httpClient.get(get_url, { params: parameters });
  }

  update_question(question_id = "", text = "", image_link = "", audio_link = "", video_link = "", comment = "", question_type_id = "", textAnswer = "", radioAnswer: any[], answer_image_link = "", answer_music_link = "", checked = false, time_to_answer = "") {
    const update_url = environment.backend + "update_question";
    let parameters = new HttpParams().set('question_text', text);
    parameters = parameters.append('question_id', question_id);
    parameters = parameters.append('image_link', image_link);
    parameters = parameters.append('audio_link', audio_link);
    parameters = parameters.append('video_link', video_link);
    parameters = parameters.append('question_comment', comment);
    parameters = parameters.append('question_type_id', question_type_id);
    parameters = parameters.append('answer_image_link', answer_image_link);
    parameters = parameters.append('answer_music_link', answer_music_link);
    parameters = parameters.append('time_to_answer', time_to_answer);
    let draw = 0;
    if (checked) { draw = 1; }
    parameters = parameters.append('checked', draw);
    if (question_type_id == "1") {
      parameters = parameters.append('answer', textAnswer);
      parameters = parameters.append('is_correct', "1");
    }
    else if (question_type_id == "2" || question_type_id == "3") {
      parameters = parameters.append('index', radioAnswer.length);
      for (let i = 0; i < radioAnswer.length; i++) {
        if (radioAnswer[i].checked) { radioAnswer[i].checked = 1 }
        else { radioAnswer[i].checked = 0 }
        parameters = parameters.append('answer' + i.toString(), radioAnswer[i].answer);
        parameters = parameters.append('is_correct' + i.toString(), radioAnswer[i].checked);
      }
    }
    else if (question_type_id == "4") {
      parameters = parameters.append('index', radioAnswer.length);
      for (let i = 0; i < radioAnswer.length; i++) {
        parameters = parameters.append('answer' + i.toString(), radioAnswer[i].answer);
        if (radioAnswer[i].points > 0) {
          parameters = parameters.append('is_correct' + i.toString(), 1);
        }
        else {
          parameters = parameters.append('is_correct' + i.toString(), 0);
        }
        parameters = parameters.append('points' + i.toString(), radioAnswer[i].points);
      }
    }
    return this.httpClient.put(update_url, {}, { params: parameters });
  }

  change_question_status(question_id = "", game_id = "", status = "") {
    const update_url = environment.backend + "change_question_status";
    let parameters = new HttpParams().append('question_id', question_id)
    parameters = parameters.append('game_id', game_id);
    parameters = parameters.append('status', status);
    return this.httpClient.put(update_url, {}, { params: parameters });
  }

  set_question_start_time(question_id = "", game_id = "") {
    const update_url = environment.backend + "set_question_start_time";
    let parameters = new HttpParams().set('question_id', question_id);
    parameters = parameters.append('game_id', game_id);
    return this.httpClient.put(update_url, {}, { params: parameters });
  }
}
