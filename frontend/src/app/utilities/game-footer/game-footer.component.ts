import { Component, Input, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-game-footer',
  templateUrl: './game-footer.component.html',
  styleUrl: './game-footer.component.css'
})
export class GameFooterComponent {

  gameId: string = '';
  questionId: any;

  isDraw: boolean = false;
  timeLeft: number = 0;
  timerInterval: any;
  @Input() screenCommand: string = 'empty';
  questionTime: number = 0;

  timeMessage: string = '';

  language: string = '';
  current_start_time: any;

  constructor(private questionsService: QuestionsService) {
    //this.showFooter();
  }

  showFooter() {
    var splitted = this.screenCommand.split(",");
    this.questionId = splitted[1];
    this.gameId = splitted[2];
    this.timeLeft = parseInt(splitted[3]);
    this.questionTime = this.timeLeft;
    this.timeMessage = 'Осталось ' + this.timeLeft.toString() + ' секунд';
    this.questionsService.get_question(this.questionId).subscribe((response: any) => {
        this.isDraw = response[6];
        this.startInterval();
      });
  }

  startInterval() {
    this.timerInterval = setInterval(() => {
      var currentTime = new Date();
      var timeInMilliseconds = currentTime.getTime();
      this.timeLeft = this.timeLeft - 1;
      // localStorage.setItem("timeLeft", this.timeLeft.toString());
      this.timeMessage = 'Осталось ' + this.timeLeft.toString() + ' секунд';
      if (this.timeLeft < 1) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  ngOnInit() {
    // var localTimeLeft = localStorage.getItem("timeLeft");
    // if (localTimeLeft) {
    //   if (parseInt(localTimeLeft) > 0) {
    //     this.timeLeft = parseInt(localTimeLeft) - 1;
    //   }
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    clearInterval(this.timerInterval);
    this.showFooter();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }
}
