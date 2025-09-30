import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(private router: Router) {

  }

  menuItems: MenuItem[] = [
    {
      label: 'Команды',
      isOpen: false,
      children: [
        { label: 'Создать команду' },
        { label: 'Список команд' }
      ]
    },
    {
      label: 'Вопросы',
      isOpen: false,
      children: [
        { label: 'Создать вопросы' },
        { label: 'Список вопросов' },
      ]
    },
    {
      label: 'Игры',
      isOpen: false,
      children: [
        { label: 'Создать игру' },
        { label: 'Список игр' },
      ]
    },
    {
      label: 'Настройки'
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
    if (item.label == "Настройки") {
      this.router.navigate(['/settings']);
    }
  }

  clickItem(label: String) {
    if (label == "Создать команду") {
      this.router.navigate(['/create-user']);
    }
    else if (label == "Список команд") {
      this.router.navigate(['/users']);
    }
    else if (label == "Создать вопросы") {
      this.router.navigate(['/create-question']);
    }
    else if (label == "Список вопросов") {
      this.router.navigate(['/questions']);
    }
    else if (label == "Создать игру") {
      this.router.navigate(['/create-game']);
    }
    else if (label == "Список игр") {
      this.router.navigate(['/games']);
    }
  }
}
