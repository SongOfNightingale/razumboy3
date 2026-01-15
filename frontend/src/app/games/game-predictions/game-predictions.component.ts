import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';

interface Prediction {
  user_id: number;
  user_name: string;
  cell: string;
  cell_two: string
}

interface GameUser {
  id: number;
  username: string;
  role: string;
}

@Component({
  selector: 'app-game-predictions',
  templateUrl: './game-predictions.component.html',
  styleUrl: './game-predictions.component.css'
})
export class GamePredictionsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['user_name', 'cell'];
  dataSource = new MatTableDataSource<Prediction>([]);
  gameId: string = '';
  refreshInterval: any;
  predictions: Prediction[] = [];

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private settingsService: SettingsService, private userService: UserService) {
    this.gameId = localStorage.getItem('gameId') || '';
  }

  ngOnInit(): void {
    this.loadPredictions();
    this.refreshInterval = setInterval(() => {
      this.loadPredictions();
    }, 1000);
  }

  loadPredictions(): void {
    this.userService.get_all_game_users().subscribe(
      (allUsers: any) => {
        this.settingsService.get_special_cells(this.gameId).subscribe(
          (response: any) => {
            const predictionsMap = new Map<number, string>();
            const predictionsMap2 = new Map<number, string>();

            if (response.message !== 'No cell') {
              response.forEach((pred: Prediction) => {
                predictionsMap.set(pred.user_id, pred.cell);
                predictionsMap2.set(pred.user_id, pred.cell_two);
              });
            }

            this.predictions = allUsers.map((user: GameUser) => ({
              user_id: user.id,
              user_name: user.username,
              cell: predictionsMap.get(user.id) || '',
              cell_two: predictionsMap2.get(user.id) || ''
            }));

            this.dataSource.data = this.predictions;
          },
          (error) => {
            console.error('Error loading predictions:', error);
          }
        );
      });
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}