import { Component, Input, SimpleChanges } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';
import { UserService } from '../../services/user.service';
import { CommandService } from '../../services/command.service';

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
  selected?: boolean;
}


@Component({
  selector: 'app-player-battlefield-selector',
  templateUrl: './player-battlefield-selector.component.html',
  styleUrl: './player-battlefield-selector.component.css'
})
export class PlayerBattlefieldSelectorComponent {

  columnLabels = 'ABCDEFGHIKLMNOP'.split('');
  grid: Cell[][] = [];
  ships: any[] = [];
  revealedWater: Set<string> = new Set();

  savedCell!: Cell;

  gameId: any;
  userId: any;

  highlightedIndex: any;
  answer: any;
  disabled: boolean = false;

  clickedRow: any = '0';
  clickedCol: any = '0';

  //clicked = false;

  @Input() screenCommand: string = 'empty';

  lastRevealedCell: { row: number; col: number } | null = null;

  constructor(private fleetService: BattlefieldService, private userService: UserService, private commandService: CommandService) {
    this.userId = localStorage.getItem('userId');
    //this.showBattlefield();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");
    if (splitted[1]) {
      this.gameId = splitted[1];
      localStorage.setItem('gameId', splitted[1]);
    }
    if (splitted[2]) {
      this.highlightedIndex = splitted[2];
    }
    console.log(this.highlightedIndex);
    this.fleetService.getQueue(this.gameId).subscribe((response: any) => {
      var currentId;
      console.log(response);
      response.sort((a: any, b: any) => a.order - b.order);
      for (let i = 0; i < response.length; i++) {
        if (this.highlightedIndex == i) {
          currentId = response[i].id;
        }
      }
      console.log(currentId);
      console.log(this.userId);
      if (parseInt(currentId) != parseInt(this.userId)) {
        this.disabled = true;
      }
      else {
        this.disabled = false;
      }
      this.showBattlefield();
    });
  }

  showBattlefield() {
    this.lastRevealedCell = { row: -1, col: -1 };
    this.initGrid();
    this.loadFleetData();
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
          type: '',
          selected: false
        });
      }
      this.grid.push(rowCells);
    }
  }

  clearSelection() {
    if (this.savedCell) {
      const prev = this.savedCell;
      if (this.grid[prev.row] && this.grid[prev.row][prev.col]) {
        this.grid[prev.row][prev.col].selected = false;
      }
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
    });
  }

  coordToCell(coord: string): { row: number; col: number } {
    const colLetter = coord[0];
    const rowPart = coord.slice(1);
    const col = this.columnLabels.indexOf(colLetter);
    const row = parseInt(rowPart, 10) - 1;
    return { row, col };
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

        if (ship.type === 'additional') {
          gridCell.icon = ship.icon || 'fa-bolt';
        }
      }
    }
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

  cellToCoord(row: number, col: number): string {
    return `${this.columnLabels[col]}${row + 1}`;
  }

  saveCell(cell: Cell) {
    this.clearSelection();

    this.savedCell = cell;
    cell.selected = true;

    this.answer = '';
    this.answer = this.getCellLabel(cell.row, cell.col);
  }

  getCellLabel(row: number, col: number): string {
    this.clickedRow = row;
    this.clickedCol = col;
    const letter = this.columnLabels[col];
    const number = row + 1; // rows start from 1 in labels
    return `${letter}${number}`;
  }

  cellClicked(cell: Cell) {
    this.clearSelection();
    this.disabled = true;

    this.commandService.set_command(this.clickedRow.toString() + "," + this.clickedCol.toString() + "," + Math.random(), 8).subscribe((response3: any) => {
    });
  }
}
