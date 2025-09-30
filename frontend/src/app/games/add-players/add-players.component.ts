import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.component.html',
  styleUrl: './add-players.component.css'
})
export class AddPlayersComponent {
  users = [
    { id: '1', username: 'User1', role: 'player', is_active: '1' },
    // Add more users as needed
  ];

  sortKey: string = '';
  sortDirection: string = 'asc';

  usernameFilter: string = '';
  selectedAssign: string = '';

  filteredUsers = [
    { id: '1', username: 'User1', role: 'player', is_active: '1' },
    // Add more users as needed
  ];

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  language: string = '';
  gamesMessage: string = '';

  constructor(private userService: UserService) {
    this.userService.get_all_users().subscribe((response: any) => {
      this.users = response;
      for (let i = this.users.length - 1; i >= 0; i--) {
        if (this.users[i].role != "player") {
          this.users.splice(i, 1);
        }
      }
      this.filteredUsers = this.users;
      // this.uniqueAssigns = this.getUniqueAssigns();
    });
  }

  applyFilters(): void {
    // Apply filters based on the values of usernameFilter and selectedRole
    // You can implement custom logic here to filter the users array
    // For simplicity, let's assume you are filtering by username and role.
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.usernameFilter.toLowerCase()) &&
      (this.selectedAssign === '' || user.is_active == this.selectedAssign.toString())
    );
  }

  sort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
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

  addToGame(user: any, index: number) {
    this.userService.change_user_status(user.id, "1").subscribe(response => {
      this.filteredUsers[index].is_active = "1";
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id == this.filteredUsers[index].id) {
          this.users[i].is_active = "1";
        }
      }
    });
  }

  removeFromGame(user: any, index: number) {
    this.userService.change_user_status(user.id, "0").subscribe(response => {
      this.filteredUsers[index].is_active = "0";
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id == this.filteredUsers[index].id) {
          this.users[i].is_active = "0";
        }
      }
    });
  }
}
