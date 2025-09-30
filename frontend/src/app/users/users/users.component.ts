import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../services/shared.service';
import { SettingsService } from '../../services/settings.service';
import { DialogComponent } from '../../utilities/dialog/dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  users = [
    { id: '1', username: 'User1', role: 'Admin' },
    // Add more users as needed
  ];

  sortKey: string = '';
  sortDirection: string = 'asc';

  usernameFilter: string = '';
  selectedRole: string = '';
  uniqueRoles: string[] = [];

  filteredUsers = [
    { id: '1', username: 'User1', role: 'Admin' },
    // Add more users as needed
  ];

  language: string = '';
  userMessage: string = '';

  constructor(private router: Router, private userService: UserService, private sharedService: SharedService, private dialog: MatDialog, private settingsService: SettingsService) {
    this.userService.get_all_users().subscribe((response: any) => {
      this.users = response;
      this.filteredUsers = this.users;
      this.uniqueRoles = this.getUniqueRoles();
    });
  }

  getUniqueRoles(): string[] {
    const roles = this.users.map(user => user.role);
    return [...new Set(roles)];
  }

  applyFilters(): void {
    // Apply filters based on the values of usernameFilter and selectedRole
    // You can implement custom logic here to filter the users array
    // For simplicity, let's assume you are filtering by username and role.
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.usernameFilter.toLowerCase()) &&
      (this.selectedRole === '' || user.role === this.selectedRole)
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

    this.filteredUsers.sort((a, b) => {
      if (key != 'id') {
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
        const valueA = a[key as keyof typeof a];
        const valueB = b[key as keyof typeof b];

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

  editUser(user: any) {
    // Add logic to handle editing user
    this.sharedService.setData(user);
    this.router.navigate(['/update-user']);
  }

  deleteUser(username: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: 'Вы уверены, что хотите удалить пользователя?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.delete_user(username).subscribe(response => {
          window.location.reload();
        });
      } else {

      }
    });
  }

}
