import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../services/score.service';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';

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
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.css'
})
export class GameTableComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  displayedColumns: string[] = ['place', 'name', 'pointA', 'pointB', 'pointC', 'pointD', 'pointE', 'total'];

  teams: Team[] = [];
  gameId: any;

  dataSource = new MatTableDataSource<Team>([]);

  constructor(private scoreService: ScoreService, private userService: UserService) {

  }

  ngOnInit(): void {
    // Placeholder for data from backend
    this.gameId = localStorage.getItem("gameId");
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
}
