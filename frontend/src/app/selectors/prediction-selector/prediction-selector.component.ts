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

  columnLabels: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  grid: Cell[][] = [];
  savedCell!: Cell;
  gameId: string = '';
  userId: any = '';
  answer: any;
  clickedRow: any = '0';
  clickedCol: any = '0';
  answerSent: boolean = false;
  title: string = '';
  variant: number = 0;

  columnNumber: number = 17;
  rowNumber: number = 17;

  answerMessage: string = 'Ваш вариант принят';

  constructor(private settingsService: SettingsService) {
    this.settingsService.get_numbers().subscribe((response: any) => {
      if (response[0].language == 'uz') {
        this.answerMessage = 'Sizning javobingiz qabul qilindi';
      }
      this.columnNumber = parseInt(response[0].fieldColumns);
      this.rowNumber = parseInt(response[0].fieldRows);
      this.columnLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      for (let i = 0; i < 26 - this.columnNumber; i++) {
        this.columnLabels.pop();
      }
      this.userId = localStorage.getItem('userId');
      this.showBattlefield();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    this.answerSent = false;
    var splitted = this.screenCommand.split(",");
    if (splitted[2]) {
      this.gameId = splitted[2];
      localStorage.setItem('gameId', splitted[2]);
    }
    if (splitted[1] == '1') {
      this.title = 'Предскажите ячейку';
      this.variant = 1;
    }
    else if (splitted[1] == '2') {
      this.title = 'Поставьте мину';
      this.variant = 2;
    }
    this.settingsService.get_special_cells(this.gameId).subscribe((response: any) => {
      for (let i = 0; i < response.length; i++) {
        if (this.userId == response[i].user_id) {
          if (this.variant == 1 && response[i].cell) {
            this.answerSent = true;
          }
          else if (this.variant == 2 && response[i].cell_two) {
            this.answerSent = true;
          }
        }
      }
    });
  }

  showBattlefield() {
    this.initGrid();
  }

  initGrid() {
    this.grid = [];
    for (let row = 0; row < this.rowNumber; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < this.columnNumber; col++) {
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
    this.settingsService.set_special_cell(this.userId, this.gameId, this.answer, this.variant).subscribe((response2: any) => {
      this.answerSent = true;
    });
  }
}
