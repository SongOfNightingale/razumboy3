import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserAnswerService } from '../../services/user-answer.service';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-user-answer-selector',
  templateUrl: './user-answer-selector.component.html',
  styleUrl: './user-answer-selector.component.css'
})
export class UserAnswerSelectorComponent implements OnChanges {

  questionId: any;
  gameId: any;
  username: any;

  userAnswers: any = [];
  timerInterval: any;

  question: string = '';
  questionAnswer: string = '';
  geolocationAnswers: any = [];
  correctAnswers: any = [];

  questionType: string = '';

  teamMessage: string = '';
  answerMessage: string = '';
  timeMessage: string = '';

  @Input() screenCommand: string = '';

  constructor(private userAnswerService: UserAnswerService, private questionService: QuestionsService) {
    //this.showAnswers();
  }

  showAnswers() {
    this.username = localStorage.getItem("username");
    var splitted = this.screenCommand.split(",");
    this.questionId = splitted[1];
    this.gameId = splitted[2];
    this.question = '';
    this.questionType = '';
    this.questionAnswer = '';
    this.geolocationAnswers = [];
    this.correctAnswers = [];
    this.userAnswers = [];
    this.questionService.get_question_answers(this.questionId).subscribe((response3: any) => {
        for (let i = 0; i < response3.length; i++) {
          if (response3[i].is_correct == '1') {
            if (this.questionAnswer == '') {
              this.questionAnswer = response3[i].text;
            }
            else {
              this.questionAnswer = this.questionAnswer + ", " + response3[i].text;
            }
          }
        }
        if (this.username == 'host') {
          this.questionService.get_question(this.questionId).subscribe((response: any) => {
            this.question = response[0];
            this.questionType = response[4];
            if (this.questionType == 'geolocation') {
                for (let i = 0; i < response3.length; i++) {
                  var responsed = { answer: response3[i].text, points: response3[i].points };
                  this.geolocationAnswers.push(responsed);
                }
                this.geolocationAnswers = this.geolocationAnswers.sort((a: any, b: any) => (a.points > b.points ? -1 : 1));
                for (let i = 0; i < this.geolocationAnswers.length; i++) {
                  if (parseInt(this.geolocationAnswers[i].points) > 0) {
                    this.correctAnswers.push(this.geolocationAnswers[i].answer + " (" + this.geolocationAnswers[i].points + ")");
                  }
                }
                this.questionAnswer = '';
                for (let i = 0; i < this.correctAnswers.length; i++) {
                  this.questionAnswer = this.questionAnswer + this.correctAnswers[i] + ", ";
                }
                this.questionAnswer = this.questionAnswer.slice(0, -2);
              }
              this.question = this.question.replaceAll("\\n", "\n");
              this.timerInterval = setInterval(() => {
                this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe(response2 => {
                  this.userAnswers = response2;
                  if (this.userAnswers["message"] == "No answers") {
                    this.userAnswers = [];
                  }
                  //this.userAnswers.sort((a: any, b: any) => a.time.localeCompare(b.time));
                });
              }, 1000);
          });
        }
        else {
          clearInterval(this.timerInterval);
          this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response2: any) => {
            this.userAnswers = response2;
            if (this.userAnswers["message"] == "No answers") {
              this.userAnswers = [];
            }
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    clearInterval(this.timerInterval);
    this.showAnswers();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

}
