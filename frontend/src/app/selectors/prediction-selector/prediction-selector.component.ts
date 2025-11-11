import { Component, Input, SimpleChanges } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

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
  selector: 'app-prediction-selector',
  templateUrl: './prediction-selector.component.html',
  styleUrl: './prediction-selector.component.css'
})
export class PredictionSelectorComponent {
  @Input() screenCommand: string = 'empty';

  columnLabels = 'ABCDEFGHIKLMNOP'.split('');
  grid: Cell[][] = [];
  savedCell!: Cell;
  gameId: string = '';
  userId: any = '';
  answer: any;
  clickedRow: any = '0';
  clickedCol: any = '0';
  answerSent: boolean = false;

  answerMessage: string = 'Ваш вариант принят';

  constructor(private settingsService: SettingsService) {
    this.settingsService.get_numbers().subscribe((response: any) => {
      if (response[0].language == 'uz') {
        this.answerMessage = 'Sizning javobingiz qabul qilindi';
      }

      this.userId = localStorage.getItem('userId');
      this.showBattlefield();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    var splitted = this.screenCommand.split(",");
    if (splitted[1]) {
      this.gameId = splitted[1];
      localStorage.setItem('gameId', splitted[1]);
    }
  }

  showBattlefield() {
    this.initGrid();
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

  saveCell(cell: Cell) {
    this.clearSelection();

    this.savedCell = cell;
    cell.selected = true;

    this.answer = '';
    this.answer = this.getCellLabel(cell.row, cell.col);
  }

  clearSelection() {
    if (this.savedCell) {
      const prev = this.savedCell;
      if (this.grid[prev.row] && this.grid[prev.row][prev.col]) {
        this.grid[prev.row][prev.col].selected = false;
      }
    }
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
    this.settingsService.set_special_cell(this.userId, this.gameId, this.answer).subscribe((response2: any) => {
      this.answerSent = true;
    });
  }
}
