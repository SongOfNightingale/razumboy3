import { Component } from '@angular/core';
import { CommandService } from '../../services/command.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  screenCommand: string = 'empty';

  logoEnabled: boolean = false;
  questionEnabled: boolean = false;
  mediaQuestionEnabled: boolean = false;
  scoreEnabled: boolean = false;
  battlefieldEnabled: boolean = false;
  predictionEnabled: boolean = false;

  constructor(private commandService: CommandService) {
    setInterval(() => {
      this.commandService.get_command().subscribe((response: any) => {
        if (this.screenCommand == response[0]) {

        }
        else {
          this.screenCommand = response[0];
          if (this.screenCommand.startsWith("logo")) {
            this.logoEnabled = true;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.scoreEnabled = false;
            this.battlefieldEnabled = false;
            this.predictionEnabled = false;
          }
          else if (this.screenCommand.startsWith("question")) {
            this.logoEnabled = false;
            this.questionEnabled = true;
            this.mediaQuestionEnabled = false;
            this.scoreEnabled = false;
            this.battlefieldEnabled = false;
            this.predictionEnabled = false;
          }
          else if (this.screenCommand.startsWith("media")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = true;
            this.scoreEnabled = false;
            this.battlefieldEnabled = false;
            this.predictionEnabled = false;
          }
          else if (this.screenCommand.startsWith("score")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.scoreEnabled = true;
            this.battlefieldEnabled = false;
            this.predictionEnabled = false;
          }
          else if (this.screenCommand.startsWith("player_battlefield")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.scoreEnabled = false;
            this.battlefieldEnabled = true;
            this.predictionEnabled = false;
          }
          else if (this.screenCommand.startsWith("prediction")) {
            this.logoEnabled = false;
            this.questionEnabled = false;
            this.mediaQuestionEnabled = false;
            this.scoreEnabled = false;
            this.battlefieldEnabled = false;
            this.predictionEnabled = true;
          }
        }
      });
    }, 500);
  }
}
