import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { BattlefieldService } from '../../services/battlefield.service';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ScoreService } from '../../services/score.service';
import { SettingsService } from '../../services/settings.service';

interface Cell {
  row: number;
  col: number;
  revealed: boolean;
  isShip: boolean;
  shipId?: string;
  icon?: string;
  status?: 'hidden' | 'revealed-water' | 'revealed-ship' | 'hit-sunk' | 'revealed-unknown' | 'revealed-carrier' | 'carrier-sunk';
  justRevealed: boolean;
  type: string;
}

interface Team {
  place: number;
  name: string;
  ship_kill_points: number;
  ship_hit_points: number;
  question_points: number;
  bonus_points: number;
  penalty_points: number;
  total: number;
}

@Component({
  selector: 'app-battlefield-selector',
  templateUrl: './battlefield-selector.component.html',
  styleUrls: ['./battlefield-selector.component.css'],
  animations: [
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }), // Initial state
        animate('1000ms', style({ opacity: 1 })) // Final state
      ])
    ]),
    trigger('highlightAnimation', [
      state('true', style({
        backgroundColor: '#fff3e0',
        // borderColor: '#ff9800',
        transform: 'scale(1.05) translateY(-2px)',
        // boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)'
      })),
      state('false', style({
        backgroundColor: '*',
        borderColor: '*',
        transform: 'scale(1) translateY(0)',
        boxShadow: 'none'
      })),
      transition('false => true', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ transform: 'scale(1) translateY(0)', offset: 0 }),
          style({ transform: 'scale(1.1) translateY(-4px)', offset: 0.3 }),
          style({ transform: 'scale(1.05) translateY(-2px)', offset: 1 })
        ]))
      ]),
      transition('true => false', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})

export class BattlefieldSelectorComponent implements OnChanges {

  grid: Cell[][] = [];
  columnLabels = 'ABCDEFGHIJKLMNOPQ'.split('');
  ships: any[] = [];
  revealedWater: Set<string> = new Set();
  gameId: any; // Replace with actual game ID

  // Add this new property
  showAllCellsMode: boolean = false;
  gameplayRevealedCells: Set<string> = new Set();
  hasRevealedCell: boolean = false;
  private revealedCellTimer: any = null;

  missileSound = new Audio('/assets/missile.wav');
  explosionSound = new Audio('/assets/explosion.wav');
  splashSound = new Audio('/assets/water.mp3');

  originalList: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
  names: string[] = [];
  savedList: string[] = [];
  locked = true;
  highlightedIndex = 0;

  displayedColumns: string[] = ['place', 'name', 'pointA', 'pointB', 'pointC', 'pointD', 'pointE', 'total'];

  teams: Team[] = [];

  dataSource = new MatTableDataSource<Team>([]);

  cellMessage: string = '';
  actionMessage: string = '';
  changesMessage: string = '';
  swapMessage: string = '';

  nextMessage: string = 'Следующий ход'; // New input for customizable label
  placeMessage: string = 'Место'; // New input for customizable label
  teamMessage: string = 'Команда'; // New input for customizable label
  shipMessage: string = 'Корабли'; // New input for customizable label
  answerMessage: string = 'Ответы'; // New input for customizable label
  bonusMessage: string = 'Бонусы'; // New input for customizable label
  penaltyMessage: string = 'Штрафы'; // New input for customizable label
  totalMessage: string = 'Всего'; // New input for customizable label

  @Input() screenCommand: string = 'empty';

  // popup control
  showPopup: boolean = false;
  // private popupTimer: any = null;

  lastRevealedCell: { row: number; col: number } | null = null;
  namesLoaded: boolean = false;

  constructor(private fleetService: BattlefieldService, private userService: UserService, private scoreService: ScoreService, private settingsService: SettingsService) {
    this.settingsService.get_numbers().subscribe((response: any) => {
      if (response[0].language == 'uz') {
        this.nextMessage = 'Keyingi navbat';
        this.placeMessage = 'O\'rin';
        this.teamMessage = 'Jamoa';
        this.shipMessage = 'Kemalar';
        this.answerMessage = 'Javoblar';
        this.bonusMessage = 'Bonus';
        this.penaltyMessage = 'Jarimalar';
        this.totalMessage = 'Jami';
      }
      //this.showBattlefield();
      //this.showTable();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");

    if (splitted[1]) {
      this.gameId = splitted[1];
      localStorage.setItem('gameId', splitted[1]);
    }

    this.showAllCellsMode = splitted[0]?.includes('showAllCells') || false;

    if (splitted[2]) {
      this.highlightedIndex = parseInt(splitted[2]);
    }
    if (splitted[4]) {
      this.cellMessage = splitted[3];
      this.actionMessage = splitted[4];
      this.changesMessage = splitted[5];
    }
    else {
      this.cellMessage = '';
      this.actionMessage = '';
      this.changesMessage = '';
    }
    if (splitted[6]) {
      this.swapMessage = splitted[6];
    }
    else {
      this.swapMessage = '';
    }

    // show popup if any of the messages is not empty
    const anyMessage = Boolean(this.cellMessage || this.actionMessage || this.changesMessage);
    this.showPopup = anyMessage;
    // auto-hide popup after 4s (clear previous timer first)
    // if (this.popupTimer) {
    //   clearTimeout(this.popupTimer);
    //   this.popupTimer = null;
    // }
    // if (anyMessage) {
    //   this.popupTimer = setTimeout(() => { this.showPopup = false; this.popupTimer = null; }, 4000);
    // }

    this.showBattlefield();
    this.showTable();
  }

  showTable() {
    this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
      if (response["message"] == 'No answers') {
        this.userService.get_all_game_users().subscribe((response: any) => {
          const teamList: Team[] = response.map((user: any, index: number) => ({
            place: 1,
            name: user.username,
            ship_kill_points: 0,
            ship_hit_points: 0,
            question_points: 0,
            bonus_points: 0,
            penalty_points: 0,
            total: 0
          }));

          this.dataSource.data = teamList; // Important
        });
      }
      else {
        this.teams = response;

        for (let i = 0; i < this.teams.length; i++) {
          this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
        }

        this.teams = [...this.teams].sort((a, b) => {
          if (b.total !== a.total) return b.total - a.total; // highest total first
          if (b.ship_kill_points !== a.ship_kill_points) return b.ship_kill_points - a.ship_kill_points;
          if (b.ship_hit_points !== a.ship_hit_points) return b.ship_hit_points - a.ship_hit_points;
          if (b.question_points !== a.question_points) return b.question_points - a.question_points;
          if (b.bonus_points !== a.bonus_points) return b.bonus_points - a.bonus_points;
          return b.penalty_points - a.penalty_points;
        });

        let currentPlace = 1;
        this.teams[0].place = currentPlace;

        for (let i = 1; i < this.teams.length; i++) {
          const prev = this.teams[i - 1];
          const curr = this.teams[i];

          if (
            curr.total === prev.total &&
            curr.ship_kill_points === prev.ship_kill_points &&
            curr.ship_hit_points === prev.ship_hit_points &&
            curr.question_points === prev.question_points &&
            curr.bonus_points === prev.bonus_points &&
            curr.penalty_points === prev.penalty_points
          ) {
            // identical score → same place
            curr.place = prev.place;
          } else {
            // new place = index + 1
            curr.place = i + 1;
          }
        }

        this.dataSource.data = this.teams;
      }
    });
  }

  showBattlefield() {
    this.namesLoaded = false;
    this.initGrid();
    this.loadFleetData();
    this.originalList = [];
    this.names = [];
    this.lastRevealedCell = { row: -1, col: -1 };
    this.fleetService.getQueue(this.gameId).subscribe((response: any) => {
      if (response["message"] == "No order") {
        // Example: To load from service instead of hardcoded list
        this.userService.get_all_game_users().subscribe((data: any) => {
          if (this.names.length == 0) {
            for (let i = 0; i < data.length; i++) {
              this.originalList.push(data[i].username);
            }
            this.names = [...this.originalList];
          }
        });
      }
      else {
        response.sort((a: any, b: any) => a.order - b.order);
        //this.highlightedIndex = response[0].current;
        if (this.names.length == 0) {
          for (let i = 0; i < response.length; i++) {
            this.originalList.push(response[i].username);
          }
          this.names = [...this.originalList];
        }
      }
      if (this.actionMessage.startsWith("Порядок команд реверсирован") || this.actionMessage.startsWith("Revers")) {
        this.namesLoaded = true;
      }
    });
  }

  initGrid() {
    this.grid = [];
    for (let row = 0; row < 17; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < 17; col++) {
        rowCells.push({
          row,
          col,
          revealed: false,
          isShip: false,
          status: 'hidden',
          justRevealed: false,
          type: ''
        });
      }
      this.grid.push(rowCells);
    }
  }

  loadFleetData() {
    this.fleetService.loadFleetLayout(this.gameId).subscribe((data: any) => {
      this.ships = data.ships_data.map((ship: any) => {
        return {
          ...ship,
          parsedCells: ship.cells.map((c: any) => {
            const cell = this.coordToCell(c.coord);
            return {
              ...cell,
              status: c.status,
              revealed: c.revealed,
              justRevealed: c.justRevealed
            };
          }),
          revealed_cells: ship.revealed_cells || []
        };
      });
      this.revealedWater = new Set(
        (data.revealed_water || '').split(',').map((s: any) => s.trim()).filter(Boolean)
      );

      this.placeShipsOnGrid();
      this.applyRevealedWater();
      this.activateDimming();
    });
  }

  coordToCell(coord: string): { row: number; col: number } {
    const colLetter = coord[0];
    const rowPart = coord.slice(1);
    const col = this.columnLabels.indexOf(colLetter);
    const row = parseInt(rowPart, 10) - 1;
    return { row, col };
  }

  cellToCoord(row: number, col: number): string {
    return `${this.columnLabels[col]}${row + 1}`;
  }

  placeShipsOnGrid() {
    for (const ship of this.ships) {
      for (const cell of ship.parsedCells) {
        const gridCell = this.grid[cell.row][cell.col];
        gridCell.isShip = true;
        gridCell.shipId = ship.id;
        gridCell.revealed = cell.revealed;
        gridCell.status = cell.status;
        gridCell.type = ship.type;
        gridCell.justRevealed = cell.justRevealed;

        if (gridCell.justRevealed) {
          this.lastRevealedCell = { row: cell.row, col: cell.col };
        }

        // Track gameplay-revealed cells in showAllCells mode
        if (this.showAllCellsMode && cell.revealed) {
          const coord = this.cellToCoord(cell.row, cell.col);
          this.gameplayRevealedCells.add(coord);
        }

        if (ship.type === 'additional') {
          gridCell.icon = ship.icon || 'fa-bolt';
        }
      }
    }
  }

  activateDimming() {
    this.hasRevealedCell = true;

    // Clear any existing timer
    if (this.revealedCellTimer) {
      clearTimeout(this.revealedCellTimer);
    }

    // Remove dimming after 5 seconds
    this.revealedCellTimer = setTimeout(() => {
      this.hasRevealedCell = false;
      this.revealedCellTimer = null;
    }, 5000);
  }

  applyRevealedWater() {
    const waterRevealed = this.lastRevealedCell?.row == -1 && this.lastRevealedCell?.col == -1;
    this.revealedWater.forEach(coord => {
      const col = this.columnLabels.indexOf(coord[0]);
      const row = parseInt(coord.slice(1)) - 1;
      const cell = this.grid[row]?.[col];
      if (cell && !cell.isShip) {
        cell.revealed = true;
        cell.status = 'revealed-water';

        // Track in showAllCells mode
        if (this.showAllCellsMode) {
          this.gameplayRevealedCells.add(coord);
        }
      }
      if (waterRevealed) {
        this.lastRevealedCell = { row: row, col: col };
      }
    });
    this.revealedWater.forEach(coord => {
      const col = this.columnLabels.indexOf(coord[0]);
      const row = parseInt(coord.slice(1)) - 1;
      const cell = this.grid[row]?.[col];
      if (this.lastRevealedCell?.row === row && this.lastRevealedCell?.col === col) {
        cell.justRevealed = true;
      }
    });
  }

  isInSwap(team: Team): boolean {
    if (!this.swapMessage) return false;
    const names = this.swapMessage.split(';').map(s => s.trim()).filter(Boolean);
    return names.includes(team.name);
  }
}
