import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScoreService } from '../../services/score.service';
import { UserService } from '../../services/user.service';

interface Team {
  place: number;
  name: string;
  ship_kill_points: number;
  ship_hit_points: number;
  question_points: number;
  bonus_points: number;
  penalty_points: number;
  total: number;
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

  constructor(private scoreService: ScoreService, private userService: UserService) {
    this.gameId = localStorage.getItem("gameId");
    this.showTable();
  }

  showTable() {
    this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
      if (response["message"] == 'No answers') {
        this.userService.get_all_game_users().subscribe((response: any) => {
          const teamList: Team[] = response.map((user: any, index: number) => ({
            place: index + 1,
            name: user.username,
            ship_kill_points: 0,
            ship_hit_points: 0,
            question_points: 0,
            bonus_points: 0,
            penalty_points: 0,
            total: 0
          }));

          this.dataSource.data = teamList; // Important
        });
      }
      else {
        this.teams = response;
        console.log(this.teams);
        for (let i = 0; i < this.teams.length; i++) {
          this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
        }
        this.teams = [...this.teams].sort((a, b) => b.total - a.total);
        for (let i = 0; i < this.teams.length; i++) {
          this.teams[i].place = i + 1;
        }
        this.dataSource.data = this.teams;
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
