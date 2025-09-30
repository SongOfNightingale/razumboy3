import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.component.html',
  styleUrl: './update-game.component.css'
})
export class UpdateGameComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectedName: string = '';

  gameId: string = "";

  subscription: any;

  language: string = '';
  gamesMessage: string = '';

  constructor(private sharedService: SharedService, private fileUploadService: FileUploadService, private gameService: GameService, private router: Router, private dialog: MatDialog) {
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.selectedName = data.name;
      //this.file_link = data.image_link;
      this.gameId = data.id;
    });
  }

  handleLogoChange(event: any): void {
    // // Handle logo change, if needed
    // this.selectedLogo = event.target.files[0];
    // if (this.selectedLogo) {
    //   this.fileUploadService.uploadFile(this.selectedLogo).subscribe((response: any) => {
    //     this.file_link = response.file_link;
    //   });
    // }
  }

  browseLogo(): void {
    // Perform browse functionality, if needed
  }

  updateGame(): void {
    if (this.selectedName != "") {
      this.gameService.update_game(this.gameId, this.selectedName).subscribe(response => {
        this.subscription.unsubscribe();
        this.router.navigate(['/games']);
      });
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Отсутствует имя игры или ссылка на лого',
        },
      });
    }
  }

}
