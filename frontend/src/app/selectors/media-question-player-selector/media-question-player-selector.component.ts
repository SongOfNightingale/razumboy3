import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { UserAnswerService } from '../../services/user-answer.service';
import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-media-question-player-selector',
  templateUrl: './media-question-player-selector.component.html',
  styleUrl: './media-question-player-selector.component.css'
})
export class MediaQuestionPlayerSelectorComponent implements OnChanges {

  question: string = '';
  @Input() screenCommand: string = 'empty';
  questionId: any;
  gameId: any;
  userId: any;
  questionMediaLink = "";
  contentType: any;

  questionNumber: number = 0;

  answer: string = '';
  answerSent: boolean = false;
  answersArray: string[] = [];

  questionType: string = '';
  radioAnswers: any;
  checkboxAnswers: any;

  isDisabled: boolean = false;

  activeUsersNumber: number = 0;

  sendMessage: string = 'Отправить';
  answerMessage: string = 'Ваш ответ принят';

  constructor(private questionService: QuestionsService, private userAnswerService: UserAnswerService, private userService: UserService, private settingsService: SettingsService) {
    this.userId = localStorage.getItem('userId');
    this.settingsService.get_numbers().subscribe((response: any) => {
      if (response[0].language == 'uz') {
        this.sendMessage = 'Yuborish';
        this.answerMessage = 'Javobingiz qabul qilindi';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    this.showQuestion();
  }

  showQuestion() {
    this.questionMediaLink = "";
    this.isDisabled = false;
    this.questionType = '';
    this.answerSent = false;
    this.radioAnswers = [];
    this.checkboxAnswers = [];
    this.answer = '';
    this.contentType = '';
    this.answersArray = [];
    var splitted = this.screenCommand.split(",");
    this.questionId = splitted[1];
    this.gameId = splitted[2];
    if (parseInt(splitted[3]) == 0) {
      this.isDisabled = true;
    }
    this.userService.get_all_game_users().subscribe((response8: any) => {
      this.activeUsersNumber = response8.length;
      this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response6: any) => {
        for (let i = 0; i < response6.length; i++) {
          if (response6[i].team_id == this.userId) {
            this.answerSent = true;
          }
        }
        this.questionService.get_question(this.questionId).subscribe((response: any) => {
          this.question = response[0];
          this.question = this.question.replaceAll("\\n", "\n");
          this.questionType = response[4];
          if (response[1] != null && response[1] != "") {
            this.questionMediaLink = response[1];
            this.contentType = 'image';
          }
          else {
            this.contentType = '';
          }
          if (this.questionType == 'radio' || this.questionType == 'geolocation') {
            this.questionService.get_question_answers(this.questionId).subscribe((response3: any) => {
              this.radioAnswers = response3;
            });
          }
          else if (this.questionType == 'checkbox') {
            this.questionService.get_question_answers(this.questionId).subscribe((response3: any) => {
              this.checkboxAnswers = response3;
              for (let i = 0; i < this.checkboxAnswers.length; i++) {
                this.checkboxAnswers[i].checked = false;
              }
            });
          }
        });
      });
    });
  }

  onItemChange(text: any) {
    for (let i = 0; i < this.checkboxAnswers.length; i++) {
      if (this.checkboxAnswers[i].text == text) {
        this.checkboxAnswers[i].checked = !this.checkboxAnswers[i].checked;
        if (this.checkboxAnswers[i].checked) {
          this.answersArray.push(text);
        }
        else {
          var index = this.answersArray.indexOf(text);
          if (index != -1) {
            this.answersArray.splice(index, 1);
          }
        }
      }
    }
    this.sendProvisionalAnswer();
  }

  onRadioItemChange(option: any) {
    this.answer = option;
    this.sendProvisionalAnswer();
  }

  sendProvisionalAnswer() {
    var provisional_answer = '';
    if (this.questionType == 'checkbox') {
      for (let i = 0; i < this.answersArray.length; i++) {
        if (i == 0) {
          provisional_answer = this.answersArray[i];
        }
        else {
          provisional_answer = provisional_answer + ", " + this.answersArray[i];
        }
      }
    }
    else {
      provisional_answer = this.answer;
    }
    this.userAnswerService.set_provisional_answer(provisional_answer, this.gameId, this.questionId, this.userId).subscribe((response: any) => {

    });
  }

  sendAnswer() {
    if (this.questionType == 'checkbox') {
      for (let i = 0; i < this.answersArray.length; i++) {
        if (i == 0) {
          this.answer = this.answersArray[i];
        }
        else {
          this.answer = this.answer + ", " + this.answersArray[i];
        }
      }
    }
    this.userAnswerService.set_user_answer(this.answer, this.gameId, this.questionId, this.userId, "1").subscribe((response: any) => {
      this.answerSent = true;
    });
  }

}
