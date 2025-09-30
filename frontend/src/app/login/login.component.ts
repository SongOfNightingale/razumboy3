import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AcceptDialogComponent } from '../utilities/accept-dialog/accept-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  is_superuser: string = '';
  is_staff: string = '';
  userId: string = '';
  userName: string = '';

  constructor(private router: Router, private userService: UserService, private dialog: MatDialog) {

  }

  login() {
    this.userService.login(this.username, this.password).subscribe((response: any) => {
      if (response["message"] != "Invalid username or password") {
        this.is_superuser = response[0];
        this.is_staff = response[1];
        this.userId = response[2];
        this.userName = response[3];
        localStorage.setItem('userId', this.userId);
        localStorage.setItem('username', this.userName);
        if (this.is_superuser == '1' && this.is_staff == '1') {
          localStorage.setItem('role', 'admin');
          this.router.navigate(['/admin']);
        }
        else if (this.is_superuser == '0' && this.is_staff == '1') {
          localStorage.setItem('role', 'tv');
          this.router.navigate(['/tv']);
        }
        else if (this.is_superuser == '1' && this.is_staff == '0') {
          localStorage.setItem('role', 'host');
          this.router.navigate(['/host']);
        }
        else {
          localStorage.setItem('role', 'player');
          this.router.navigate(['/player']);
        }
      }
      else {
        const dialogRef = this.dialog.open(AcceptDialogComponent, {
          data: {
            content: 'Неправильное имя пользователя или пароль',
          },
        });
      }
    });
  }
}
