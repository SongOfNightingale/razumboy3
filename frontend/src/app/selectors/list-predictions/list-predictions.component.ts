import { Component, Input, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-list-predictions',
  templateUrl: './list-predictions.component.html',
  styleUrl: './list-predictions.component.css'
})
export class ListPredictionsComponent {

  @Input() screenCommand: string = 'empty';
  gameId: any;

  userPredictions: any = [];
  timerInterval: any;

  language: string = '';
  teamMessage: string = '';

  constructor(private settingsService: SettingsService) {
    this.settingsService.get_numbers().subscribe((response3: any) => {
      this.language = response3[0].language;
      if (response3[0].language == 'uz') {
        this.teamMessage = 'Jamoa';
      }
      else {
        this.teamMessage = 'Команда';
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    clearInterval(this.timerInterval);
    this.showPredictions();
  }

  showPredictions() {
    var splitted = this.screenCommand.split(",");
    this.gameId = splitted[1];

    this.timerInterval = setInterval(() => {
      this.settingsService.get_special_cells(this.gameId).subscribe((response: any) => {
        this.userPredictions = response;
      });
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }
}
