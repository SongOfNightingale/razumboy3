import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../../services/settings.service';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  name: string = '';
  password: string = '';
  oldName: string = '';

  subscription: any;

  language: string = '';
  userMessage: string = '';

  constructor(private sharedService: SharedService, private userService: UserService, private router: Router, private dialog: MatDialog, private settingsService: SettingsService) {
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.name = data.username;
      this.oldName = data.username;
    });
  }

  saveUser() {
    if (this.name != "" && this.password.length >= 6) {
      this.userService.update_user(this.name, this.oldName, this.password).subscribe((response: any) => {
        if (response["message"] == "The chosen name already exists. Please choose a new name.") {
          const dialogRef = this.dialog.open(AcceptDialogComponent, {
            data: {
              content: 'Пользователь с таким именем уже существует',
            },
          });
        }
        else {
          this.subscription.unsubscribe();
          this.router.navigate(['/users']);
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Имя пользователя отсутствуют или пароль слишком короткий (необходимо минимум 6 символов)',
        },
      });
    }
  }
}
