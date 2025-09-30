import { Component } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.css'
})
export class CreateGameComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isChecked: boolean = false;
  selectedName: string = '';
  //selectedLogo: any;
  //file_link: string = '';

  constructor(private fileUploadService: FileUploadService, private gameService: GameService, private router: Router, private dialog: MatDialog) {
    
  }

  // handleLogoChange(event: any): void {
  //   // Handle logo change, if needed
  //   this.selectedLogo = event.target.files[0];
  //   if (this.selectedLogo) {
  //     this.fileUploadService.uploadFile(this.selectedLogo).subscribe((response: any) => {
  //       this.file_link = response.file_link;
  //     });
  //   }
  // }

  browseLogo(): void {
    // Perform browse functionality, if needed
  }

  saveGame(): void {
    if (this.selectedName != "") {
      this.gameService.add_game(this.selectedName).subscribe((response: any) => {
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
