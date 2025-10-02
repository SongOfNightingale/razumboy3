import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserService } from '../../services/user.service';
import { BattlefieldService } from '../../services/battlefield.service';

@Component({
  selector: 'app-create-queue',
  templateUrl: './create-queue.component.html',
  styleUrl: './create-queue.component.css'
})
export class CreateQueueComponent {

  originalList: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
  names: string[] = [];
  savedList: string[] = [];
  locked = false;

  gameId: any;

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private userService: UserService, private battlefieldService: BattlefieldService) {

  }

  ngOnInit() {
    // Load initial list
    //this.names = [...this.originalList];
    this.gameId = localStorage.getItem("gameId");

    this.originalList = [];

    this.battlefieldService.getQueue(this.gameId).subscribe((response: any) => {
      if (response["message"] == "No order") {
        // Example: To load from service instead of hardcoded list
        this.userService.get_all_game_users().subscribe((data: any) => {
          for (let i = 0; i < data.length; i++) {
            this.originalList.push(data[i].username);
          }
          this.names = [...this.originalList];
        });
      }
      else {
        for (let i = 0; i < response.length; i++) {
          this.originalList.push(response[i].username);
        }
        this.names = [...this.originalList];
        this.locked = true;
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (!this.locked) {
      moveItemInArray(this.names, event.previousIndex, event.currentIndex);
    }
  }

  randomizeList() {
    if (!this.locked) {
      this.names = this.shuffle([...this.names]);
      this.savedList = [...this.names];
    }
  }

  saveList() {
    this.savedList = [...this.names];
    this.locked = true;

    this.battlefieldService.saveQueue(this.gameId, this.savedList, 0).subscribe(response => {

    });
  }

  resetList() {
    this.names = [...this.originalList];
    this.locked = false;
  }

  shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Later, instead of hardcoding `names`, you could fetch from a service:
  // this.myService.getNames().subscribe(data => this.names = data);
}
