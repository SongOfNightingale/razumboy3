import { Component } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';
import { SettingsService } from '../../services/settings.service';

interface Cell {
  row: number;
  col: number;
  occupiedBy?: string | null; // shipId
  isHighlighted?: boolean;
  isLocked?: boolean;
}

interface Ship {
  id: string;
  name: string;
  size: number;
  direction: 'horizontal' | 'vertical';
  placed: boolean;
  cells?: { row: number; col: number }[];
  icon?: string; // only for additional ships
}

@Component({
  selector: 'app-create-battlefield',
  templateUrl: './create-battlefield.component.html',
  styleUrl: './create-battlefield.component.css'
})
export class CreateBattlefieldComponent {

  grid: Cell[][] = [];
  columnLabels: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  rowLabels: number[] = [];

  columnNumber: number = 17;
  rowNumber: number = 17;
  ships6: number = 1;
  ships5: number = 2;
  ships4: number = 3;
  ships3: number = 4;
  ships2: number = 5;
  ships1: number = 6;
  shipSurprise: number = 1;
  shipDoubleBarrel: number = 1;
  shipReverse: number = 1;
  shipMove5: number = 1;
  shipMove3: number = 1;
  shipKaraoke: number = 1;
  shipCastling: number = 1;
  shipBonus5: number = 1;
  shipBonus3: number = 1;
  shipBonus1: number = 1;
  shipPenalty5: number = 1;
  shipPenalty3: number = 1;
  shipPenalty1: number = 1;
  shipSong: number = 1;
  shipSonar: number = 1;
  shipEvenBonus: number = 1;
  shipOddBonus: number = 1;
  shipSpecialTour: number = 1;
  shipJackpot: number = 1;
  shipTax: number = 1;

  ships: Ship[] = [];
  selectedShip: Ship | null = null;
  locked: boolean = false;

  gameId: any;

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private battlefieldService: BattlefieldService, private settingsService: SettingsService) {
    this.settingsService.get_numbers().subscribe((data: any) => {
      this.columnNumber = parseInt(data[0].fieldColumns);
      this.rowNumber = parseInt(data[0].fieldRows);
      this.ships6 = parseInt(data[0].ships6);
      this.ships5 = parseInt(data[0].ships5);
      this.ships4 = parseInt(data[0].ships4);
      this.ships3 = parseInt(data[0].ships3);
      this.ships2 = parseInt(data[0].ships2);
      this.ships1 = parseInt(data[0].ships1);
      this.shipSurprise = parseInt(data[0].shipSurprise);
      this.shipDoubleBarrel = parseInt(data[0].shipDoubleBarrel);
      this.shipReverse = parseInt(data[0].shipReverse);
      this.shipMove5 = parseInt(data[0].shipMove5);
      this.shipMove3 = parseInt(data[0].shipMove3);
      this.shipKaraoke = parseInt(data[0].shipKaraoke);
      this.shipCastling = parseInt(data[0].shipCastling);
      this.shipBonus5 = parseInt(data[0].shipBonus5);
      this.shipBonus3 = parseInt(data[0].shipBonus3);
      this.shipBonus1 = parseInt(data[0].shipBonus1);
      this.shipPenalty5 = parseInt(data[0].shipPenalty5);
      this.shipPenalty3 = parseInt(data[0].shipPenalty3);
      this.shipPenalty1 = parseInt(data[0].shipPenalty1);
      this.shipSong = parseInt(data[0].shipSong);
      this.shipSonar = parseInt(data[0].shipSonar);
      this.shipEvenBonus = parseInt(data[0].shipEvenBonus);
      this.shipOddBonus = parseInt(data[0].shipOddBonus);
      this.shipSpecialTour = parseInt(data[0].shipSpecialTour);
      this.shipJackpot = parseInt(data[0].shipJackpot);
      this.shipTax = parseInt(data[0].shipTax);
      this.rowLabels = Array.from({ length: this.rowNumber }, (_, i) => i + 1);
      for (let i = 0; i < 26 - this.columnNumber; i++) {
        this.columnLabels.pop();
      }
      this.initGrid();
      this.initShips();

      this.gameId = localStorage.getItem("gameId");

      this.loadShipsFromBackend(this.gameId);
    });
  }

  loadShipsFromBackend(gameId: any) {
    this.battlefieldService.loadFleetLayout(gameId).subscribe({
      next: (savedShips: any) => {
        const colLabels = this.columnLabels;

        // Clear grid and ship state
        this.grid.forEach(row => row.forEach(cell => {
          cell.occupiedBy = null;
          cell.isLocked = false;
        }));
        this.ships.forEach(s => {
          s.placed = false;
          s.cells = [];
        });

        let shipData = savedShips.ships_data;
        shipData.forEach((saved: any) => {
          const ship = this.ships.find(s => s.id === saved.id);
          if (!ship) return;

          ship.placed = true;
          ship.direction = saved.direction;
          ship.cells = saved.cells.map((cellObj: any) => {
            const coord = cellObj.coord; // e.g. "A1"
            const colLetter = coord[0];
            const rowNumber = parseInt(coord.slice(1), 10);
            const col = colLabels.indexOf(colLetter);
            const row = rowNumber - 1;
            return { row, col };
          });

          // Fill grid cells
          if (ship.cells) {
            ship.cells.forEach(cell => {
              const gridCell = this.grid[cell.row][cell.col];
              gridCell.occupiedBy = ship.id;
              gridCell.isLocked = true;
            });
          }
        });

        this.locked = true;
      },
      error: err => {
        console.error('Failed to load fleet:', err);
        alert('Error loading fleet layout.');
      }
    });
  }

  initGrid() {
    this.grid = Array.from({ length: this.rowNumber }, (_, row) =>
      Array.from({ length: this.columnNumber }, (_, col) => ({
        row,
        col,
      }))
    );
  }

  initShips() {
    const fleetCounts = [
      { count: this.ships6, size: 6 },
      { count: this.ships5, size: 5 },
      { count: this.ships4, size: 4 },
      { count: this.ships3, size: 3 },
      { count: this.ships2, size: 2 },
      { count: this.ships1, size: 1 }
    ];

    const shipNames = [
      'Профурсетка',
      'Бешбармак',
      'Свингер',
      'Сэндвич',
      'Твикс',
      'Чёрная дыра'
    ];

    // Find the largest ship size that exists
    let largestShipIndex = -1;
    for (let i = 0; i < fleetCounts.length; i++) {
      if (fleetCounts[i].count > 0) {
        largestShipIndex = i;
        break;
      }
    }

    let id = 1;
    fleetCounts.forEach((type, index) => {
      for (let i = 0; i < type.count; i++) {
        // Use "Профурсетка" for the largest ship, then proceed with other names
        const shipName = index === largestShipIndex ? 'Профурсетка' : shipNames[index];
        this.ships.push({
          id: `ship-${id++}`,
          name: shipName,
          size: type.size,
          direction: 'horizontal',
          placed: false
        });
      }
    });

    const additionalShipConfigs = [
      { name: 'Сюрприз', icon: 'assets/Сюрприз.png', count: this.shipSurprise },
      { name: 'Двустволка', icon: 'assets/двустволка.png', count: this.shipDoubleBarrel },
      { name: 'Реверс', icon: 'assets/реверс.png', count: this.shipReverse },
      { name: 'Переход +5', icon: 'assets/5.png', count: this.shipMove5 },
      { name: 'Переход +3', icon: 'assets/3.png', count: this.shipMove3 },
      { name: 'Караоке', icon: 'assets/Микрофон.png', count: this.shipKaraoke },
      { name: 'Рокировка', icon: 'assets/2.png', count: this.shipCastling },
      { name: 'Бонус +5', icon: 'assets/бонус +5.png', count: this.shipBonus5 },
      { name: 'Бонус +3', icon: 'assets/+3.png', count: this.shipBonus3 },
      { name: 'Бонус +1', icon: 'assets/+1.png', count: this.shipBonus1 },
      { name: 'Штраф -5', icon: 'assets/минус.png', count: this.shipPenalty5 },
      { name: 'Штраф -3', icon: 'assets/минус 3.png', count: this.shipPenalty3 },
      { name: 'Штраф -1', icon: 'assets/минус 1.png', count: this.shipPenalty1 },
      { name: 'Песня', icon: 'assets/Песня.png', count: this.shipSong },
      { name: 'Эхолот', icon: 'assets/ЭХО.png', count: this.shipSonar },
      { name: 'Всем чётным командам по 5 баллов', icon: 'assets/четные.png', count: this.shipEvenBonus },
      { name: 'Всем нечётным командам по 5 баллов', icon: 'assets/нечетные.png', count: this.shipOddBonus },
      { name: 'Особый тур', icon: 'assets/особый.png', count: this.shipSpecialTour },
      { name: 'Джекпот', icon: 'assets/slot-machine.png', count: this.shipJackpot },
      { name: 'Налог', icon: 'assets/tax.png', count: this.shipTax }
    ];

    let additionalId = 1;
    additionalShipConfigs.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        this.ships.push({
          id: `additional-${additionalId++}`,
          name: config.name,
          size: 1,
          direction: 'horizontal',
          placed: false,
          icon: config.icon
        });
      }
    });
  }

  getShipById(id: string): Ship | undefined {
    return this.ships.find(s => s.id === id);
  }

  getCellLabel(col: number): string {
    return this.columnLabels[col] ?? '';
  }

  onCellClick(cell: Cell) {
    if (this.locked || !this.selectedShip) return;

    if (this.canPlaceShip(cell.row, cell.col, this.selectedShip)) {
      this.placeShip(cell.row, cell.col, this.selectedShip);
    }
  }

  canPlaceShip(row: number, col: number, ship: Ship): boolean {
    const coords: { row: number; col: number }[] = [];

    for (let i = 0; i < ship.size; i++) {
      const r = ship.direction === 'horizontal' ? row : row + i;
      const c = ship.direction === 'horizontal' ? col + i : col;

      if (r >= this.rowNumber || c >= this.columnNumber) return false;

      const cell = this.grid[r][c];
      if (cell.occupiedBy) return false;

      // Check adjacency
      if (ship.name != 'Эхолот') {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nr = r + dx, nc = c + dy;
            if (nr >= 0 && nr < this.rowNumber && nc >= 0 && nc < this.columnNumber) {
              const neighbor = this.grid[nr][nc];
              if (neighbor.occupiedBy) return false;
            }
          }
        }
      }

      coords.push({ row: r, col: c });
    }

    return true;
  }

  placeShip(row: number, col: number, ship: Ship) {
    const cells: { row: number; col: number }[] = [];

    for (let i = 0; i < ship.size; i++) {
      const r = ship.direction === 'horizontal' ? row : row + i;
      const c = ship.direction === 'horizontal' ? col + i : col;

      this.grid[r][c].occupiedBy = ship.id;
      cells.push({ row: r, col: c });
    }

    ship.placed = true;
    ship.cells = cells;
    this.selectedShip = null;
  }

  rotateShip(ship: Ship) {
    if (this.locked || !ship.placed || !ship.cells) return;

    const head = ship.cells[0];
    const newDir = ship.direction === 'horizontal' ? 'vertical' : 'horizontal';
    ship.direction = newDir;

    // Temporarily clear
    ship.cells.forEach(c => this.grid[c.row][c.col].occupiedBy = undefined);

    if (this.canPlaceShip(head.row, head.col, ship)) {
      this.placeShip(head.row, head.col, ship);
    } else {
      ship.direction = ship.direction === 'horizontal' ? 'vertical' : 'horizontal'; // revert
      // Repaint old position
      ship.cells.forEach(c => this.grid[c.row][c.col].occupiedBy = ship.id);
    }
  }

  selectShip(ship: Ship) {
    if (this.locked) return;
    this.selectedShip = ship;
  }

  randomizeShips() {
    if (this.locked) return;

    this.initGrid();
    this.ships.forEach(s => {
      s.placed = false;
      s.cells = [];
    });

    this.ships.forEach(ship => {
      for (let attempts = 0; attempts < 1000; attempts++) {
        ship.direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const r = Math.floor(Math.random() * this.rowNumber);
        const c = Math.floor(Math.random() * this.columnNumber);
        if (this.canPlaceShip(r, c, ship)) {
          this.placeShip(r, c, ship);
          break;
        }
      }
    });
  }

  lockShips() {
    this.locked = true;
    this.grid.forEach(row =>
      row.forEach(cell => (cell.isLocked = !!cell.occupiedBy))
    );

    const shipsData = this.getShipSaveData();

    this.battlefieldService.saveFleetLayout(this.gameId, shipsData).subscribe({
      next: () => alert('Fleet layout saved successfully!'),
      error: err => alert('Error saving fleet: ' + err.message)
    });
  }

  getShipSaveData(): {
    id: string;
    name: string;
    type: 'standard' | 'additional';
    size: number;
    direction: 'horizontal' | 'vertical';
    cells: { coord: string; status: string; revealed: boolean }[];
    icon: string;
  }[] {
    const colLabels = this.columnLabels;

    return this.ships
      .filter(ship => ship.placed && ship.cells?.length)
      .map(ship => ({
        id: ship.id,
        name: ship.name,
        type: ship.id.startsWith('additional-') ? 'additional' : 'standard',
        size: ship.size,
        direction: ship.direction,
        cells: ship.cells!.map(c => ({
          coord: `${colLabels[c.col]}${c.row + 1}`,
          status: 'hidden',      // default when locking ships
          revealed: false        // not revealed yet
        })),
        icon: ship.icon || 'fa-bolt'
      }));
  }

  resetShips() {
    this.locked = false;
    this.initGrid();
    this.ships.forEach(s => {
      s.placed = false;
      s.cells = [];
    });
  }
}
