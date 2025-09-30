import { Component } from '@angular/core';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrl: './host.component.css'
})
export class HostComponent {

  screenCommand: string = 'empty';

  logoEnabled: boolean = false;
  questionEnabled: boolean = false;
  mediaQuestionEnabled: boolean = false;
  answerEnabled: boolean = false;
  userAnswerEnabled: boolean = false;
  scoreEnabled: boolean = false;

  constructor(private commandService: CommandService) {
    setInterval(() => {
      this.commandService.get_command().subscribe((response: any) => {
        if (this.screenCommand == response[2]) {

        }
        else {
          this.screenCommand = response[2];
          if (this.screenCommand.startsWith("logo")) {
            this.logoEnabled = true;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.answerEnabled = false;
            this.userAnswerEnabled = false;
            this.scoreEnabled = false;
          }
          else if (this.screenCommand.startsWith("question")) {
            this.logoEnabled = false;
            this.questionEnabled = true;
            this.mediaQuestionEnabled = false;
            this.answerEnabled = false;
            this.userAnswerEnabled = false;
            this.scoreEnabled = false;
          }
          else if (this.screenCommand.startsWith("media")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = true;
            this.answerEnabled = false;
            this.userAnswerEnabled = false;
            this.scoreEnabled = false;
          }
          else if (this.screenCommand.startsWith("correct")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.answerEnabled = true;
            this.userAnswerEnabled = false;
            this.scoreEnabled = false;
          }
          else if (this.screenCommand.startsWith("user")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.answerEnabled = false;
            this.userAnswerEnabled = true;
            this.scoreEnabled = false;
          }
          else if (this.screenCommand.startsWith("score")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.answerEnabled = false;
            this.userAnswerEnabled = false;
            this.scoreEnabled = true;
          }
        }
      });
    }, 1000);
  }

}
