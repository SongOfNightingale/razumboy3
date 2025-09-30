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
  status?: 'hidden' | 'revealed-water' | 'revealed-ship' | 'hit-sunk' | 'revealed-unknown' | 'revealed-unknown';
  justRevealed: boolean;
  type: string;
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

  constructor(private fleetService: BattlefieldService, private userService: UserService, private commandService: CommandService) {
    this.userId = localStorage.getItem('userId');
    this.showBattlefield();
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
    this.fleetService.getQueue(this.gameId).subscribe((response: any) => {
      var currentId;
      console.log(response);
      for (let i = 0; i < response.length; i++) {
        if (response[i].current == i) {
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
          parsedCells: ship.cells.map((coord: string) => this.coordToCell(coord)),
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
        gridCell.revealed = ship.revealed_cells.includes(this.cellToCoord(cell.row, cell.col));
        gridCell.status = gridCell.revealed ? 'revealed-ship' : 'hidden';
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

  cellToCoord(row: number, col: number): string {
    return `${this.columnLabels[col]}${row + 1}`;
  }

  saveCell(cell: Cell) {
    this.savedCell = cell;
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
    //this.disabled = true;
    this.commandService.set_command(this.clickedRow.toString() + "," + this.clickedCol.toString(), 8).subscribe((response3: any) => {
    });
    /* if (cell.revealed) return;

    cell.revealed = true;


    if (cell.isShip && cell.shipId) {
      cell.status = 'revealed-ship';

      const ship = this.ships.find(s => s.id === cell.shipId);
      this.markShipCellRevealed(cell.shipId, cell.row, cell.col);

      if (ship?.type === 'additional') {
        cell.icon = ship.icon || 'fa-bolt'; // show icon immediately
      }

      // 🎯 Play missile and explosion on first hit
      cell.justRevealed = true;

      // Remove animation after it's done
      setTimeout(() => {
        cell.justRevealed = false;
      }, 800);

      if (ship?.name === 'Carrier') {
        const shipIsSunk = this.isShipSunk(ship.id);

        if (!shipIsSunk) {
          this.moveCarrierRemainingParts(ship);
        } else {
          this.markSunk(ship.id);
          this.revealSurroundingWater(ship.id);
        }
      } else if (ship?.name === 'Эхолот') {
        this.markSunk(ship.id);
        this.revealSpecialSurroundings(cell.row, cell.col);
      }
      else {
        if (this.isShipSunk(ship.id)) {
          this.markSunk(ship.id);
          this.revealSurroundingWater(ship.id);
        }
      }
      //this.updateScore(ship.type, ship.name, this.isShipSunk(ship.id));
    } else {
      cell.status = 'revealed-water';
      const coord = `${this.columnLabels[cell.col]}${cell.row + 1}`;
      this.revealedWater.add(coord);
      //this.moveHighlight(1, false);
    }

    // if (this.isShipSunk(cell.shipId)) {
    //   this.markSunk(cell.shipId);
    //   this.revealSurroundingWater(cell.shipId);
    // }
    // else {
    //   cell.status = 'revealed-water';
    //   const coord = `${this.columnLabels[cell.col]}${cell.row + 1}`;
    //   this.revealedWater.add(coord);
    // }
    this.saveUpdatedFleet();*/
  }

  markShipCellRevealed(shipId: string, row: number, col: number) {
    const ship = this.ships.find(s => s.id === shipId);
    const coord = this.cellToCoord(row, col);
    if (ship && !ship.revealed_cells.includes(coord)) {
      ship.revealed_cells.push(coord);
    }
  }

  isShipSunk(shipId: string): boolean {
    const ship = this.ships.find(s => s.id === shipId);
    if (!ship || !ship.parsedCells) return false;

    return ship.parsedCells.every((cell: any) => {
      const coord = this.cellToCoord(cell.row, cell.col);
      return ship.revealed_cells.includes(coord);
    });
  }

  moveCarrierRemainingParts(ship: any) {

    const remainingCells = ship.parsedCells.filter((cell: any) => {
      const coord = this.cellToCoord(cell.row, cell.col);
      return !ship.revealed_cells.includes(coord);
    });
    const remainingSize = remainingCells.length;
    if (remainingSize === 0) return;

    // Remove old positions of remaining parts from the grid
    // for (const cell of remainingCells) {
    //   this.grid[cell.row][cell.col].isShip = false;
    //   this.grid[cell.row][cell.col].shipId = undefined;
    //   this.grid[cell.row][cell.col].status = 'hidden';
    //   this.grid[cell.row][cell.col].icon = undefined;
    // }

    // Try to find a valid position for the remaining parts
    const directions: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * 15);
      const startCol = Math.floor(Math.random() * 15);

      const newCells: { row: number, col: number }[] = [];

      let valid = true;
      for (let i = 0; i < remainingSize; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;

        if (row >= 15 || col >= 15) {
          valid = false;
          break;
        }

        const cell = this.grid[row][col];
        if (cell.isShip) {
          valid = false;
          break;
        }

        // Check surrounding 8 cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (
              nr >= 0 && nr < 15 &&
              nc >= 0 && nc < 15 &&
              this.grid[nr][nc].isShip
            ) {
              valid = false;
            }
          }
        }

        newCells.push({ row, col });
      }

      if (valid) {
        // Update ship's parsedCells and string coords
        const revealedCells = ship.parsedCells.filter((cell: any) => {
          const coord = this.cellToCoord(cell.row, cell.col);
          return ship.revealed_cells.includes(coord);
        });

        for (const cell of remainingCells) {
          const gCell = this.grid[cell.row][cell.col];
          gCell.isShip = false;
          gCell.shipId = undefined;
          gCell.status = 'hidden';
          gCell.icon = undefined;
        }

        ship.parsedCells = [...revealedCells, ...newCells];

        ship.cells = ship.parsedCells.map((c: any) => this.cellToCoord(c.row, c.col));

        // Update grid
        for (const cell of newCells) {
          const gCell = this.grid[cell.row][cell.col];
          gCell.isShip = true;
          gCell.shipId = ship.id;
          gCell.revealed = false;
          gCell.status = 'hidden';
        }

        this.saveUpdatedFleet();
        return;
      }
    }

    console.warn("No valid new position found for escaping Carrier");
  }

  markSunk(shipId: string) {
    const ship = this.ships.find(s => s.id === shipId);
    if (!ship || !ship.parsedCells) return;

    // Skip animation/styling for additional ships
    if (ship.type === 'additional') return;

    for (const cell of ship.parsedCells) {
      const gridCell = this.grid[cell.row][cell.col];
      gridCell.status = 'hit-sunk';
    }
  }

  revealSurroundingWater(shipId: string) {
    const ship = this.ships.find(s => s.id === shipId);
    if (!ship || !ship.parsedCells) return;

    const directions = [-1, 0, 1];

    for (const cell of ship.parsedCells) {
      for (let dr of directions) {
        for (let dc of directions) {
          const r = cell.row + dr;
          const c = cell.col + dc;
          if (
            r >= 0 && r < 15 && c >= 0 && c < 15 &&
            !this.grid[r][c].isShip &&
            !this.grid[r][c].revealed
          ) {
            this.grid[r][c].revealed = true;
            this.grid[r][c].status = 'revealed-water';
            const coord = this.cellToCoord(r, c);
            this.revealedWater.add(coord);
          }
        }
      }
    }
  }

  revealSpecialSurroundings(row: number, col: number): void {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nr = row + dx;
        const nc = col + dy;

        if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15) {
          const neighborCell = this.grid[nr][nc];

          // Reveal only if hidden
          if (neighborCell.status === 'hidden') {
            if (!neighborCell.isShip) {
              // Water
              neighborCell.status = 'revealed-water';
            } else {
              // Occupied by some ship – reveal as "unknown ship" (special color)
              neighborCell.status = 'revealed-unknown';
            }
          }
        }
      }
    }
  }

  saveUpdatedFleet() {
    const serializedShips = this.ships.map(ship => ({
      id: ship.id,
      name: ship.name,
      type: ship.type,
      direction: ship.direction,
      size: ship.size,
      cells: ship.parsedCells.map((c: any) => this.cellToCoord(c.row, c.col)),
      revealed_cells: ship.revealed_cells,
      icon: ship.icon || 'fa-bolt'
    }));
    this.fleetService.updateFleetLayout(this.gameId, serializedShips, Array.from(this.revealedWater).join(',')).subscribe(response => {
      this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
      });
    });
  }
}
