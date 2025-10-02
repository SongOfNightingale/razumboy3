import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ScoreService } from '../../services/score.service';

interface Cell {
  row: number;
  col: number;
  revealed: boolean;
  isShip: boolean;
  shipId?: string;
  icon?: string;
  status?: 'hidden' | 'revealed-water' | 'revealed-ship' | 'hit-sunk' | 'revealed-unknown' | 'revealed-carrier';
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
  styleUrl: './battlefield-selector.component.css'
})
export class BattlefieldSelectorComponent implements OnChanges {

  grid: Cell[][] = [];
  columnLabels = 'ABCDEFGHIKLMNOP'.split('');
  ships: any[] = [];
  revealedWater: Set<string> = new Set();
  gameId: any; // Replace with actual game ID

  missileSound = new Audio('/assets/missile.wav');
  explosionSound = new Audio('/assets/explosion.wav');

  originalList: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
  names: string[] = [];
  savedList: string[] = [];
  locked = true;
  highlightedIndex = 0;

  displayedColumns: string[] = ['place', 'name', 'pointA', 'pointB', 'pointC', 'pointD', 'pointE', 'total'];

  teams: Team[] = [];

  dataSource = new MatTableDataSource<Team>([]);

  @Input() screenCommand: string = 'empty';

  constructor(private fleetService: BattlefieldService, private userService: UserService, private scoreService: ScoreService) {
    this.showBattlefield();
    this.showTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");
    if (splitted[1]) {
      this.gameId = splitted[1];
      localStorage.setItem('gameId', splitted[1]);
    }
    if (splitted[2]) {
      this.highlightedIndex = parseInt(splitted[2]);
    }
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
    console.log("battlefield");
    this.initGrid();
    this.loadFleetData();
    this.originalList = [];
    this.names = [];
    this.fleetService.getQueue(this.gameId).subscribe((response: any) => {
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
        response.sort((a: any, b: any) => a.order - b.order);
        //this.highlightedIndex = response[0].current;
        console.log(this.highlightedIndex);
        for (let i = 0; i < response.length; i++) {
          this.originalList.push(response[i].username);
        }
        console.log(this.originalList);
        this.names = [...this.originalList];
      }
    });
  }

  initGrid() {
    this.grid = [];
    for (let row = 0; row < 15; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < 15; col++) {
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
              revealed: c.revealed
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
      // ship.cells = ship.cells.map((coord: any) => {
      //   const colLetter = coord[0];
      //   const rowNumber = parseInt(coord.slice(1), 10);
      //   const col = this.columnLabels.indexOf(colLetter);
      //   const row = rowNumber - 1;
      //   return { row, col };
      // });
      for (const cell of ship.parsedCells) {
        const gridCell = this.grid[cell.row][cell.col];
        gridCell.isShip = true;
        gridCell.shipId = ship.id;
        gridCell.revealed = cell.revealed;
        gridCell.status = cell.status;
        gridCell.type = ship.type;
        if (ship.type === 'additional') {
          gridCell.icon = ship.icon || 'fa-bolt';
        }
      }
    }
  }

  applyRevealedWater() {
    this.revealedWater.forEach(coord => {
      const col = this.columnLabels.indexOf(coord[0]);
      const row = parseInt(coord.slice(1)) - 1;
      const cell = this.grid[row]?.[col];
      if (cell && !cell.isShip) {
        cell.revealed = true;
        cell.status = 'revealed-water';
      }
    });
  }
}
