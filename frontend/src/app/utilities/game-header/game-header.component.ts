import { Component, Input, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-game-header',
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css'
})
export class GameHeaderComponent {

  gameId: string = '';
  questionId: any;

  isDraw: boolean = false;
  isPlayer: boolean = false;
  isHost: boolean = false;

  timeLeft: number = 0;
  timerInterval: any;
  timeMessage: string = '';
  questionTime: number = 0;

  imagePath = '/assets/new_header_logo.png';

  @Input() screenCommand: string = 'empty';

  current_start_time: any;

  constructor(private questionsService: QuestionsService) {
    //this.showHeader();
  }

  showHeader() {
    var role = localStorage.getItem('role');
    if (role == 'player') {
      this.isPlayer = true;
      this.isHost = false;
    }
    else if (role == 'host') {
      this.isHost = true;
      this.isPlayer = false;
    }
    this.imagePath = '/assets/new_header_logo.png';
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
      // this.timeLeft = this.questionTime - Math.floor((timeInMilliseconds - this.current_start_time)/1000) + 1;
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
    this.showHeader();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }
}
