import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScoreService } from '../../services/score.service';
import { UserService } from '../../services/user.service';
import { SettingsService } from '../../services/settings.service';

interface Team {
  place: number;
  name: string;
  team_id?: string;
  ship_kill_points: number;
  ship_hit_points: number;
  question_points: number;
  bonus_points: number;
  penalty_points: number;
  total: number;
  is_special: boolean;
}

@Component({
  selector: 'app-score-selector',
  templateUrl: './score-selector.component.html',
  styleUrl: './score-selector.component.css'
})
export class ScoreSelectorComponent {

  @Input() screenCommand: string = 'empty';

  displayedColumns: string[] = ['place', 'name', 'pointA', 'pointB', 'pointC', 'pointD', 'pointE', 'total'];

  teams: Team[] = [];
  gameId: any;

  dataSource = new MatTableDataSource<Team>([]);

  constructor(private scoreService: ScoreService, private userService: UserService, private settingsService: SettingsService) {
    this.gameId = localStorage.getItem("gameId");
    this.showTable();
  }

  showTable() {
    this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
      if (response["message"] == 'No answers') {
        this.userService.get_all_game_users().subscribe((response2: any) => {
          const teamList: Team[] = response2.map((user: any, index: number) => ({
            place: 1,
            name: user.username,
            team_id: user.id,
            ship_kill_points: 0,
            ship_hit_points: 0,
            question_points: 0,
            bonus_points: 0,
            penalty_points: 0,
            total: 0,
            is_special: false
          }));

          this.dataSource.data = teamList; // Important
        });
      }
      else {
        this.settingsService.get_special_cells(this.gameId).subscribe((response2: any) => {
          var predictions = response2;
          this.teams = response;

          for (let i = 0; i < this.teams.length; i++) {
            this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            for (let j = 0; j < predictions.length; j++) {
              if (predictions[j].user_id == this.teams[i].team_id) {
                if (predictions[j].special == 1) {
                  this.teams[i].is_special = true;
                }
              }
            }
          }

          this.teams = [...this.teams].sort((a, b) => {
            if (b.total !== a.total) return b.total - a.total; // highest total first
            if (b.ship_kill_points !== a.ship_kill_points) return b.ship_kill_points - a.ship_kill_points;
            if (b.ship_hit_points !== a.ship_hit_points) return b.ship_hit_points - a.ship_hit_points;
            if (b.question_points !== a.question_points) return b.question_points - a.question_points;
            if (b.bonus_points !== a.bonus_points) return b.bonus_points - a.bonus_points;
            return b.penalty_points - a.penalty_points;
          });

          let currentPlace = 1;
          this.teams[0].place = currentPlace;

          for (let i = 1; i < this.teams.length; i++) {
            const prev = this.teams[i - 1];
            const curr = this.teams[i];

            if (
              curr.total === prev.total &&
              curr.ship_kill_points === prev.ship_kill_points &&
              curr.ship_hit_points === prev.ship_hit_points &&
              curr.question_points === prev.question_points &&
              curr.bonus_points === prev.bonus_points &&
              curr.penalty_points === prev.penalty_points
            ) {
              // identical score → same place
              curr.place = prev.place;
            } else {
              // new place = index + 1
              curr.place = i + 1;
            }
          }

          this.dataSource.data = this.teams;
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");
    this.gameId = splitted[1];
    this.showTable();
  }

}
