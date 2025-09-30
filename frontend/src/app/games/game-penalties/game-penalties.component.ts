import { Component } from '@angular/core';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { ScoreService } from '../../services/score.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game-penalties',
  templateUrl: './game-penalties.component.html',
  styleUrl: './game-penalties.component.css'
})
export class GamePenaltiesComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectedUser: string = "";
  users = [{id: "1", username: "name"}];
  bonusPenaltyNumber: number = 0;
  gameId: any = "";

  subscription: any;

  constructor(private userService: UserService, private sharedService: SharedService, private scoreService: ScoreService, private router: Router, private dialog: MatDialog) {
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.gameId = localStorage.getItem('gameId');
      this.userService.get_all_game_users().subscribe((response: any) => {
        if (response.length > 0) {
          this.users = response;
        }
        else {
          this.users = [];
        }
      });
    });
  }

  savePenalty() {
    if (this.selectedUser != "" && this.bonusPenaltyNumber != 0) {
      this.scoreService.save_result(this.gameId, this.selectedUser, "0", "0", "0", "0", this.bonusPenaltyNumber.toString()).subscribe(response => {
        this.subscription.unsubscribe();
        this.router.navigate(['/games']);
      });
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Не выбран пользователь или не назначен бонус/наказание',
        },
      });
    }
  }
}
