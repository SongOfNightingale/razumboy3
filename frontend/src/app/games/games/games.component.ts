import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { SharedService } from '../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';
import { DialogComponent } from '../../utilities/dialog/dialog.component';
import { CommandService } from '../../services/command.service';
import { UserService } from '../../services/user.service';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  games = [
    { id: '1', name: 'Category1', is_active: 'Yes', created: '2023-11-20 17:59:09', updated: '2023-12-19 21:53:34' },
  ];

  sortKey: string = '';
  sortDirection: string = 'asc';

  gameFilter: string = '';
  selectedType: string = '';
  uniqueTypes: string[] = [];

  isGameActive: boolean = false;

  filteredGames = [
    { id: '1', name: 'Category1', is_active: 'Yes', created: '2023-11-20 17:59:09', updated: '2023-12-19 21:53:34' },
  ];

  language: string = '';
  gamesMessage: string = '';

  constructor(private router: Router, private gameService: GameService, private sharedService: SharedService, private dialog: MatDialog, private commandService: CommandService, private scoreService: ScoreService) {
    this.gameService.get_all_games().subscribe((response: any) => {
      this.games = response;
      this.games.reverse();
      for (let i = 0; i < this.games.length; i++) {
        if (parseInt(this.games[i].is_active) == 1) {
          localStorage.setItem("gameId", this.games[i].id);
          localStorage.setItem("gameName", this.games[i].name);
        }
      }
      this.filteredGames = this.games;
      this.uniqueTypes = this.getUniqueRoles();
    });
  }

  getUniqueRoles(): string[] {
    const roles = this.games.map(game => game.is_active);
    return [...new Set(roles)];
  }

  applyFilters(): void {
    // Apply filters based on the values of usernameFilter and selectedRole
    // You can implement custom logic here to filter the users array
    // For simplicity, let's assume you are filtering by username and role.

    this.filteredGames = this.games.filter(game =>
      game.name.toLowerCase().includes(this.gameFilter.toLowerCase()) &&
      (this.selectedType === '' || game.is_active == this.selectedType)
    );
    // Update the users array with the filtered results
    //this.users = filteredUsers;
  }

  sort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredGames.sort((a, b) => {
      if (key != 'id' && key != 'is_active') {
        const valueA = a[key as keyof typeof a].toLowerCase();
        const valueB = b[key as keyof typeof b].toLowerCase();
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }
      else {
        const valueA = a[key as keyof typeof a]
        const valueB = b[key as keyof typeof b]
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }
    });
  }

  getSortIcon(key: string): string {
    return this.sortKey === key
      ? this.sortDirection === 'asc'
        ? 'fas fa-sort-up'
        : 'fas fa-sort-down'
      : '';
  }

  startGame(game: any) {
    this.gameService.get_all_games().subscribe((response4: any) => {
      for (let i = 0; i < response4.length; i++) {
        if (response4[i].is_active == 1) {
          if (response4[i].id != game.id) {
            this.isGameActive = true;
            const dialogRef = this.dialog.open(AcceptDialogComponent, {
              data: {
                content: 'Уже существует активная игра. Остановите её, чтобы начать следующую.',
              },
            });
          }
        }
      }
      if (!this.isGameActive) {
        this.gameService.start_game(game.id).subscribe((response: any) => {
          this.scoreService.save_initial_result(game.id).subscribe(response => {
            localStorage.setItem("gameId", game.id);
            localStorage.setItem("gameName", game.name);
            this.router.navigate(['/game-panel']);
          });
        });
      }
    });
  }

  gamePenalties(game: any) {
    this.sharedService.setData(game);
    this.router.navigate(['/game-penalties']);
  }

  gameQuestions(game: any) {
    this.sharedService.setData(game);
    this.router.navigate(['/add-questions']);
  }

  gameUsers(game: any) {
    this.sharedService.setData(game);
    this.router.navigate(['/add-players']);
  }

  cloneGame(game: any) {
    this.gameService.add_game(game.name).subscribe((response: any) => {
      this.gameService.get_all_games().subscribe((response2: any) => {
        this.games = response2;
        this.games.reverse();
        this.filteredGames = this.games;
      });
    });
  }

  stopGame(game: any) {
    this.gameService.end_game(game.id).subscribe((response: any) => {
      this.commandService.set_command("", 8).subscribe((response3: any) => {
        localStorage.setItem("gameId", "");
        localStorage.setItem("gameName", "");
        localStorage.setItem('index', "");
        localStorage.setItem('killed_ships', "");
        localStorage.setItem('played_questions', "");
        localStorage.setItem('question_types', "");
        localStorage.setItem('carrier_number', "");
        window.location.reload();
      });
    });
  }

  editGame(game: any) {
    this.sharedService.setData(game);
    this.router.navigate(['/update-game']);
  }

  deleteGame(game: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: 'Вы уверены, что хотите удалить игру?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (game.is_active == 1) {
          localStorage.setItem("gameId", "");
          localStorage.setItem("gameName", "");
        }
        this.gameService.delete_game(game.id).subscribe(response => {
          window.location.reload();
        });
      } else {

      }
    });
  }

}
