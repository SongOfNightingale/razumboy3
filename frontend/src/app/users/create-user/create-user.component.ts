import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  name: string = '';
  password: string = '';

  userTypes = ['player', 'tv', 'admin', 'host'];
  selectedType: string = '';

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog) { }

  saveUser() {
    if (this.name != "" && this.password.length >= 6 && this.selectedType != "") {
      this.userService.add_user(this.name, this.password, this.selectedType).subscribe((response: any) => {
        if (response["message"] == "User already exists") {
          const dialogRef = this.dialog.open(AcceptDialogComponent, {
            data: {
              content: 'Пользователь с таким именем уже существует',
            },
          });
        }
        else {
          this.router.navigate(['/users']);
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Имя или тип пользователя отсутствуют или пароль слишком короткий (необходимо минимум 6 символов)',
        },
      });
    }
  }
}
