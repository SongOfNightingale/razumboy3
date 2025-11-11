import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { QuestionsService } from '../../services/questions.service';
import { UserAnswerService } from '../../services/user-answer.service';
import { CommandService } from '../../services/command.service';
import { ScoreService } from '../../services/score.service';
import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-game-answers',
  templateUrl: './game-answers.component.html',
  styleUrl: './game-answers.component.css'
})
export class GameAnswersComponent {

  questionId: any;
  questionType: any;
  question: string = '';
  questionAnswer: string = '';
  questionPoints: string = '';
  geolocationAnswer: string = '';

  userAnswers: any;
  gameId: any;
  userId: any;

  subscription: any;

  questionNumber: any;
  question_points: any;

  pointCorrect: string = '1';
  pointIncorrect: string = '0';

  questionAmount = 0;

  gameQuestions: any[] = [];

  isSpecial = false;
  isDisabled = true;
  jackpotNumber = 0;

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router, private sharedService: SharedService, private questionService: QuestionsService, private userAnswerService: UserAnswerService, private commandService: CommandService, private scoreService: ScoreService, private settingsService: SettingsService) {
    this.gameId = localStorage.getItem("gameId");
    this.userId = localStorage.getItem("userId");
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.questionId = data;
      if (data.length == 0) {
        this.questionId = localStorage.getItem("currentQuestionId");
      }
      this.questionNumber = localStorage.getItem("questionNumber");
      this.question_points = localStorage.getItem("questionPoints");
      if (this.question_points == 3) {
        this.pointCorrect = '3';
      }
      else if (this.question_points == 5) {
        this.pointCorrect = '5';
        this.pointIncorrect = '-5';
      }
      else if (this.question_points == -1) {
        this.isSpecial = true;
      }
      this.settingsService.get_numbers().subscribe((response4: any) => {
        this.jackpotNumber = response4[0].o_number;
        // console.log(response4[0]);
        // if (response4[0].special == this.questionNumber) {
        //   this.isDisabled = false;
        //   this.isSpecial = true;
        // }
        // else if (response4[0].special == 0) {
        //   this.isDisabled = false;
        // }
        // else if (response4[0].special != 0) {
        //   this.isDisabled = true;
        // }
        this.questionService.get_all_game_questions().subscribe((response3: any) => {
          this.questionAmount = response3.length;
          this.gameQuestions = response3;
          this.questionService.get_question_answers(this.questionId).subscribe((response: any) => {
            this.questionType = response[0].question_type_id;
            this.question = response[0].question;
            for (let i = 0; i < response.length; i++) {
              if (this.questionAnswer == '' && response[i].is_correct == '1') {
                this.questionAnswer = response[i].text;
                if (this.questionType.toString() == '4') {
                  this.questionPoints = response[i].points;
                  this.geolocationAnswer = this.questionAnswer + ' (' + this.questionPoints + ')';
                }
              }
              else if (response[i].is_correct == '1') {
                if (this.questionType.toString() == '4') {
                  this.questionPoints = this.questionPoints + ', ' + response[i].points;
                  this.geolocationAnswer = this.geolocationAnswer + ', ' + response[i].text + ' (' + response[i].points + ')';
                }
                else {
                  this.questionAnswer = this.questionAnswer + ', ' + response[i].text;
                }
              }
            }
            this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe(response2 => {
              this.userAnswers = response2;
              for (let i = 0; i < this.userAnswers.length; i++) {
                if (this.userAnswers[i].checked == null) {
                  this.userAnswers[i].checked = 0;
                }
                this.userAnswers[i].time = this.userAnswers[i].time.substring(3, this.userAnswers[i].time.length - 3);
                if (this.userAnswers[i].time.substring(0, 1) == '1') {
                  this.userAnswers[i].timeDigit = parseFloat(this.userAnswers[i].time.substring(2, this.userAnswers[i].time.length)) + 60;
                }
                else {
                  this.userAnswers[i].timeDigit = parseFloat(this.userAnswers[i].time.substring(2, this.userAnswers[i].time.length));
                }
                this.userAnswers[i].points = '0';
              }
              this.userAnswers.sort((a: any, b: any) => a.time - b.time);

              // check for duplicate answers
              for (let i = this.userAnswers.length - 1; i >= 0; i--) {
                for (let j = 0; j < i; j++) {
                  if (this.userAnswers[i].team == this.userAnswers[j].team) {
                    this.userAnswerService.delete_user_answer_by_id(this.userAnswers[i].id).subscribe(response5 => {
                      window.location.reload();
                    });
                  }
                }
              }

              for (let i = 0; i < this.userAnswers.length; i++) {
                if (this.questionType.toString() == '4') {
                  var splitted = this.questionAnswer.split(", ");
                  var splitted2 = this.questionPoints.split(", ");
                  var correct = false;
                  for (let j = 0; j < splitted.length; j++) {
                    if (this.userAnswers[i].text == splitted[j]) {
                      this.userAnswers[i].is_correct = '1';
                      this.userAnswers[i].points = splitted2[j];
                      correct = true;
                      this.markCorrect(this.userAnswers[i]);
                      break;
                    }
                  }
                  if (!correct) {
                    this.markIncorrect(this.userAnswers[i]);
                  }
                }
                else if (this.userAnswers[i].is_correct == '1') {
                  this.markCorrect(this.userAnswers[i]);
                }
                else if (this.userAnswers[i].text == this.questionAnswer) {
                  this.userAnswers[i].is_correct = '1';
                  this.markCorrect(this.userAnswers[i]);
                }
                else if (this.userAnswers[i].is_correct == null) {
                  this.userAnswers[i].is_correct = '0';
                  // this.userAnswerService.assign_answer_points(this.gameId, this.questionId, this.userAnswers[i].team, "0", this.pointIncorrect, this.roundNumber).subscribe(response => {
                  // });
                  this.markIncorrect(this.userAnswers[i]);
                }
                else if (this.userAnswers[i].is_correct == '0') {
                  // this.userAnswerService.assign_answer_points(this.gameId, this.questionId, this.userAnswers[i].team, "0", this.pointIncorrect, this.roundNumber).subscribe(response => {
                  // });
                  this.markIncorrect(this.userAnswers[i]);
                }
              }
              //this.userAnswers.sort((a: any, b: any) => a.time.localeCompare(b.time));
            });
          });
        });
      });
    });
  }

  showCorrectAnswer() {
    this.commandService.set_command("correct_answer," + this.questionId + "," + this.gameId, 3).subscribe((response: any) => {
      this.commandService.set_command("logo", 1).subscribe((response2: any) => {
      });
    });
  }

  showAnswers() {
    this.commandService.set_command("user_answers," + this.questionId + "," + this.gameId, 2).subscribe((response: any) => {
      // this.commandService.set_command("logo", 2).subscribe((response2: any) => {
      // });
    });
  }

  markIncorrect(answer: any) {
    console.log(answer);
    answer.is_correct = '0';
    answer.points = this.pointIncorrect;
    // var teamId = '';
    // var answerTime = answer.time;
    if (answer.time.substring(0, 1) == '1') {
      answer.timeDigit = parseFloat(answer.time.substring(2, answer.time.length)) + 60;
    }
    else {
      answer.timeDigit = parseFloat(answer.time.substring(2, answer.time.length));
    }



    for (let i = 0; i < this.userAnswers.length; i++) {
      if (answer.team == this.userAnswers[i].team) {
        this.userAnswers[i].points = this.pointIncorrect;
      }
    }

    var jackpotCount = 0;
    if (this.isSpecial) {
      this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response3: any) => {
        for (let i = 0; i < response3.length; i++) {
          for (let j = 0; j < this.userAnswers.length; j++) {
            if (response3[i].team_id == this.userAnswers[j].team_id) {
              if (response3[i].checked == null) {
                response3[i].checked = 0;
              }
              this.userAnswers[j].checked = response3[i].checked;
            }
          }
        }
        for (let i = 0; i < this.userAnswers.length; i++) {
          if (this.userAnswers[i].points > 0) {
            jackpotCount++;
          }
        }
        for (let i = 0; i < this.userAnswers.length; i++) {
          if (parseFloat(this.userAnswers[i].points) > 0) {
            const originalPoints = this.userAnswers[i].points;
            this.userAnswers[i].is_correct = '1';
            const computedPoints = Math.ceil(this.jackpotNumber / jackpotCount).toString();
            this.userAnswers[i].points = computedPoints;
            if (originalPoints != this.userAnswers[i].points) {
              const team = this.userAnswers[i].team;
              const team_id = this.userAnswers[i].team_id;
              const checked = this.userAnswers[i].checked;
              const tmpPoints = this.userAnswers[i].points;
              const added = (tmpPoints - checked).toString();
              this.scoreService.save_result(this.gameId, team_id, "0", "0", added, "0", "0").subscribe(response2 => {
                this.userAnswerService.assign_answer_points(this.gameId, this.questionId, team, "1", tmpPoints, tmpPoints).subscribe(response5 => {
                });
              });
            }
          }
          else {
            const team = this.userAnswers[i].team;
            const team_id = this.userAnswers[i].team_id;
            const checked = this.userAnswers[i].checked;
            const tmpPoints = this.userAnswers[i].points;
            this.userAnswers[i].is_correct = '0';
            const added = (tmpPoints - checked).toString();
            this.scoreService.save_result(this.gameId, team_id, "0", "0", added, "0", "0").subscribe(response2 => {
              this.userAnswerService.assign_answer_points(this.gameId, this.questionId, team, "0", tmpPoints, tmpPoints).subscribe(response5 => {

              });
            });
          }
        }
      });
    }
    else {
      this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response3: any) => {
        for (let i = 0; i < response3.length; i++) {
          if (response3[i].team_id == answer.team_id) {
            if (response3[i].checked == null) {
              response3[i].checked = 0;
            }
            answer.checked = response3[i].checked;
          }
        }
        this.scoreService.save_result(this.gameId, answer.team_id, "0", "0", (parseInt(this.pointIncorrect) - answer.checked).toString(), "0", "0").subscribe(response2 => {
          this.userAnswerService.assign_answer_points(this.gameId, this.questionId, answer.team, "0", this.pointIncorrect, this.pointIncorrect).subscribe(response => {
            answer.is_correct = '0';
            // this.userService.get_all_game_users().subscribe((response4: any) => {
            //   for (let i = 0; i < response4.length; i++) {
            //     if (response4[i].username == answer.team) {
            //       teamId = response4[i].id;
            //     }
            //   }
            // });
          });
        });
      });
    }
  }

  markCorrect(answer: any) {
    // var teamId = '';
    // var answerTime = answer.time;
    answer.is_correct = '1';
    answer.points = this.pointCorrect;
    console.log(answer);
    if (answer.time.substring(0, 1) == '1') {
      answer.timeDigit = parseFloat(answer.time.substring(2, answer.time.length)) + 60;
    }
    else {
      answer.timeDigit = parseFloat(answer.time.substring(2, answer.time.length));
    }

    if (this.questionType.toString() != '4') {
      for (let i = 0; i < this.userAnswers.length; i++) {
        if (answer.team == this.userAnswers[i].team) {
          this.userAnswers[i].points = this.pointCorrect;
        }
      }
    }
    else {
      for (let i = 0; i < this.userAnswers.length; i++) {
        if (answer.team == this.userAnswers[i].team) {
          this.pointCorrect = this.userAnswers[i].points;
        }
      }
    }

    var points = this.pointCorrect;

    var jackpotCount = 0;
    if (this.isSpecial) {

      this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response3: any) => {
        for (let i = 0; i < response3.length; i++) {
          for (let j = 0; j < this.userAnswers.length; j++) {
            if (response3[i].team_id == this.userAnswers[j].team_id) {
              if (response3[i].checked == null) {
                response3[i].checked = 0;
              }
              this.userAnswers[j].checked = response3[i].checked;
            }
          }
        }
        for (let i = 0; i < this.userAnswers.length; i++) {
          if (this.userAnswers[i].points > 0) {
            jackpotCount++;
          }
        }
        for (let i = 0; i < this.userAnswers.length; i++) {
          if (answer.team == this.userAnswers[i].team || parseFloat(this.userAnswers[i].points) > 0) {
            const originalPoints = this.userAnswers[i].points;
            this.userAnswers[i].is_correct = '1';
            const computedPoints = Math.ceil(this.jackpotNumber / jackpotCount).toString();
            this.userAnswers[i].points = computedPoints;

            if (this.userAnswers[i].team == answer.team) {
              const points = this.userAnswers[i].points;
              const added = (points - answer.checked).toString();
              const teamId = answer.team_id;
              const teamName = answer.team;
              this.scoreService.save_result(this.gameId, teamId, "0", "0", added, "0", "0").subscribe(response2 => {
                this.userAnswerService.assign_answer_points(this.gameId, this.questionId, teamName, "1", points, points).subscribe(response5 => {

                });
              });
            }
            else if (originalPoints != this.userAnswers[i].points) {
              const team = this.userAnswers[i].team;
              const team_id = this.userAnswers[i].team_id;
              const checked = this.userAnswers[i].checked;
              const tmpPoints = this.userAnswers[i].points;
              const added = (tmpPoints - checked).toString();
              this.scoreService.save_result(this.gameId, team_id, "0", "0", added, "0", "0").subscribe(response2 => {
                this.userAnswerService.assign_answer_points(this.gameId, this.questionId, team, "1", tmpPoints, tmpPoints).subscribe(response5 => {
                });
              });
            }
          }
          else {
            const team = this.userAnswers[i].team;
            const team_id = this.userAnswers[i].team_id;
            const checked = this.userAnswers[i].checked;
            const tmpPoints = this.userAnswers[i].points;
            this.userAnswers[i].is_correct = '0';
            const added = (tmpPoints - checked).toString();
            this.scoreService.save_result(this.gameId, team_id, "0", "0", added, "0", "0").subscribe(response2 => {
              this.userAnswerService.assign_answer_points(this.gameId, this.questionId, team, "0", tmpPoints, tmpPoints).subscribe(response5 => {

              });
            });
          }
        }
      });


    }
    else {
      this.userAnswerService.get_user_answers(this.questionId, this.gameId).subscribe((response3: any) => {
        for (let i = 0; i < response3.length; i++) {
          if (response3[i].team_id == answer.team_id) {
            if (response3[i].checked == null) {
              response3[i].checked = 0;
            }
            answer.checked = response3[i].checked;
          }
        }
        this.scoreService.save_result(this.gameId, answer.team_id, "0", "0", (parseInt(points) - answer.checked).toString(), "0", "0").subscribe(response2 => {
          this.userAnswerService.assign_answer_points(this.gameId, this.questionId, answer.team, "1", points, points).subscribe(response => {
            answer.is_correct = '1';
            // this.userService.get_all_game_users().subscribe((response4: any) => {
            //   for (let i = 0; i < response4.length; i++) {
            //     if (response4[i].username == answer.team) {
            //       teamId = response4[i].id;
            //     }
            //   }
            // });
          });
        });
      });
    }

  }

  previousQuestion() {
    for (let i = 0; i < this.gameQuestions.length; i++) {
      if (this.gameQuestions[i].id == this.questionId) {
        localStorage.setItem("currentQuestionId", this.gameQuestions[i - 1].id);
        localStorage.setItem("questionNumber", (parseInt(this.questionNumber) - 1).toString());
        window.location.reload();
      }
    }
  }

  nextQuestion() {
    for (let i = 0; i < this.gameQuestions.length; i++) {
      if (this.gameQuestions[i].id == this.questionId) {
        localStorage.setItem("currentQuestionId", this.gameQuestions[i + 1].id);
        localStorage.setItem("questionNumber", (parseInt(this.questionNumber) + 1).toString());
        window.location.reload();
      }
    }
  }
}
