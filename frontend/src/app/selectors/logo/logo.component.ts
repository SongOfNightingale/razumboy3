import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css'
})
export class LogoComponent {

  @Input() screenCommand: string = 'empty';

  isPlayer: boolean = false;
  teamName: string = '';

  //imagePath = "/assets/123.png";

  constructor() {
    var role = localStorage.getItem('role');
    if (role == 'player') {
      this.teamName = localStorage.getItem('username') || '';
      this.isPlayer = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.imagePath = "/assets/123.png";
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");
    if (splitted[1]) {
      localStorage.setItem('gameId', splitted[1]);
    }
    if (splitted[2]) {
      if (splitted[2] != "-") {
        //this.imagePath = splitted[2];
      }
    }
  }

}
