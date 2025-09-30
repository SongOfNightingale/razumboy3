import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-panel',
  templateUrl: './game-panel.component.html',
  styleUrl: './game-panel.component.css'
})
export class GamePanelComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router) {

  }

  createBattlefield() {
    this.router.navigate(['/create-battlefield']);
  }

  createQueue() {
    this.router.navigate(['/create-queue']);
  }

  startDraw() {
    this.router.navigate(['/choose-draw']);
  }

  showBattlefield() {
    this.router.navigate(['/show-battlefield']);
  }
}
