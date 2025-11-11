import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommandService } from '../../services/command.service';

interface MenuItem {
  label: string;
}

@Component({
  selector: 'app-sidebar-game',
  templateUrl: './sidebar-game.component.html',
  styleUrl: './sidebar-game.component.css'
})
export class SidebarGameComponent {

  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  logo_link = "-";
  gameId: any;

  constructor(private router: Router, private commandService: CommandService) {
    this.gameId = localStorage.getItem("gameId");
  }

  menuItems: MenuItem[] = [
    {
      label: 'Главная панель'
    },
    {
      label: 'Поле боя'
    },
    {
      label: 'Разыгровка'
    },
    {
      label: 'Таблица'
    },
    {
      label: 'Штрафы'
    },
    {
      label: 'Показать лого'
    },
    {
      label: 'Показать предсказание'
    },
    {
      label: 'Все игры'
    }
  ];

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (item.label == "Поле боя") {
      this.router.navigate(['/show-battlefield']);
    }
    else if (item.label == "Главная панель") {
      this.router.navigate(['/game-panel']);
    }
    else if (item.label == "Разыгровка") {
      this.router.navigate(['/choose-draw']);
    }
    else if (item.label == "Таблица") {
      this.router.navigate(['/game-table']);
    }
    else if (item.label == "Штрафы") {
      this.router.navigate(['/game-penalties']);
    }
    else if (item.label == "Показать лого") {
      this.commandService.set_command("logo," + this.gameId + "," + this.logo_link, 3).subscribe((response: any) => {
        this.commandService.set_command("logo," + this.gameId, 4).subscribe((response: any) => {

        });
      });
    }
    else if (item.label == "Показать предсказание") {
      this.commandService.set_command("prediction," + this.gameId, 1).subscribe((response: any) => {

      });
    }
    else if (item.label == "Все игры") {
      this.router.navigate(['/games']);
    }
  }

}
