import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { QuestionsService } from '../../services/questions.service';
import { UserAnswerService } from '../../services/user-answer.service';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-game-draw-answers',
  templateUrl: './game-draw-answers.component.html',
  styleUrl: './game-draw-answers.component.css'
})
export class GameDrawAnswersComponent {
  drawId: any;
  drawAnswer: any;

  userAnswers: any;
  gameId: any;
  gameName: any;

  timerInterval: any;

  subscription: any;

  isMedia = "question";

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router, private sharedService: SharedService, private questionService: QuestionsService, private userAnswerService: UserAnswerService, private commandService: CommandService) {
    this.gameId = localStorage.getItem("gameId");
    this.gameName = localStorage.getItem("gameName");
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.drawId = data;
      if (data.length == 0) {
        this.drawId = localStorage.getItem("currentDrawQuestionId");
      }
      this.questionService.get_question(this.drawId).subscribe((response3: any) => {
        if (response3[1] || response3[2] || response3[3]) {
          this.isMedia = "media_question";
        }
        this.questionService.get_question_answers(this.drawId).subscribe((response: any) => {
          this.drawAnswer = response[0].text;
          this.timerInterval = setInterval(() => {
            this.userAnswerService.get_user_answers(this.drawId, this.gameId).subscribe(response4 => {
              this.userAnswers = response4;
              //this.userAnswers.sort((a: any, b: any) => a.time.localeCompare(b.time));
            });
          }, 1000)
        });
      });
    });
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  showQuestion() {
    this.questionService.set_question_start_time(this.drawId, this.gameId).subscribe(response3 => {
      this.commandService.set_command(this.isMedia + "," + this.drawId + "," + this.gameId + ",60", 5).subscribe((response: any) => {
        this.commandService.set_command("user_answers," + this.drawId + "," + this.gameId, 2).subscribe((response4: any) => {

        });
      });
    });
  }

  showCorrectAnswer() {
    clearInterval(this.timerInterval);
    this.commandService.set_command("correct_answer," + this.drawId + "," + this.gameId, 3).subscribe((response: any) => {
      this.commandService.set_command("logo", 1).subscribe((response2: any) => {
      });
    });
  }

  showAnswers() {
    clearInterval(this.timerInterval);
    this.commandService.set_command("user_answers," + this.drawId + "," + this.gameId, 3).subscribe((response: any) => {
      this.commandService.set_command("logo", 2).subscribe((response2: any) => {
      });
    });
  }

  showBattlefield() {
    clearInterval(this.timerInterval);
    this.commandService.set_command("battlefield," + this.gameId, 3).subscribe((response: any) => {
      this.commandService.set_command("logo", 4).subscribe((response2: any) => {
        this.subscription.unsubscribe();
        this.router.navigate(['/show-battlefield']);
      });
    });
  }
}
