import { Component } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';

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
  columnLabels: string[] = 'ABCDEFGHIJKLMNOPQ'.split('');
  rowLabels: number[] = Array.from({ length: 17 }, (_, i) => i + 1);

  ships: Ship[] = [];
  selectedShip: Ship | null = null;
  locked: boolean = false;

  gameId: any;

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private battlefieldService: BattlefieldService) {
    this.initGrid();
    this.initShips();

    this.gameId = localStorage.getItem("gameId");

    this.loadShipsFromBackend(this.gameId);
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
    this.grid = Array.from({ length: 17 }, (_, row) =>
      Array.from({ length: 17 }, (_, col) => ({
        row,
        col,
      }))
    );
  }

  initShips() {
    const fleet = [
      { count: 1, size: 6, name: 'Профурсетка' },
      { count: 2, size: 5, name: 'Бешбармак' },
      { count: 3, size: 4, name: 'Свингер' },
      { count: 4, size: 3, name: 'Сэндвич' },
      { count: 5, size: 2, name: 'Твикс' },
      { count: 6, size: 1, name: 'Чёрная дыра' }
    ];

    let id = 1;
    fleet.forEach(type => {
      for (let i = 0; i < type.count; i++) {
        this.ships.push({
          id: `ship-${id++}`,
          name: type.name,
          size: type.size,
          direction: 'horizontal',
          placed: false
        });
      }
    });

    const additionalShipData = [
      { name: 'Сюрприз', icon: 'assets/Сюрприз.png' },
      { name: 'Двустволка', icon: 'assets/двустволка.png' },
      { name: 'Реверс', icon: 'assets/реверс.png' },
      { name: 'Реверс', icon: 'assets/реверс.png' },
      { name: 'Переход +5', icon: 'assets/5.png' },
      { name: 'Переход +3', icon: 'assets/3.png' },
      { name: 'Караоке', icon: 'assets/Микрофон.png' },
      { name: 'Караоке', icon: 'assets/Микрофон.png' },
      { name: 'Рокировка', icon: 'assets/2.png' },
      { name: 'Рокировка', icon: 'assets/2.png' },
      { name: 'Бонус +5', icon: 'assets/бонус +5.png' },
      { name: 'Бонус +3', icon: 'assets/+3.png' },
      { name: 'Бонус +1', icon: 'assets/+1.png' },
      { name: 'Штраф -5', icon: 'assets/минус.png' },
      { name: 'Штраф -3', icon: 'assets/минус 3.png' },
      { name: 'Штраф -1', icon: 'assets/минус 1.png' },
      { name: 'Песня', icon: 'assets/Песня.png' },
      { name: 'Эхолот', icon: 'assets/ЭХО.png' },
      { name: 'Всем чётным командам по 5 баллов', icon: 'assets/четные.png' },
      { name: 'Всем нечётным командам по 5 баллов', icon: 'assets/нечетные.png' },
      { name: 'Особый тур', icon: 'assets/особый.png' },
      { name: 'Джекпот', icon: 'assets/slot-machine.png' },
      { name: 'Налог', icon: 'assets/tax.png' }
    ];

    additionalShipData.forEach((data, index) => {
      this.ships.push({
        id: `additional-${index + 1}`,
        name: data.name,
        size: 1,
        direction: 'horizontal',
        placed: false,
        icon: data.icon
      });
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

      if (r >= 17 || c >= 17) return false;

      const cell = this.grid[r][c];
      if (cell.occupiedBy) return false;

      // Check adjacency
      if (ship.name != 'Эхолот') {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nr = r + dx, nc = c + dy;
            if (nr >= 0 && nr < 17 && nc >= 0 && nc < 17) {
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
        const r = Math.floor(Math.random() * 17);
        const c = Math.floor(Math.random() * 17);
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
