import { Component, OnDestroy, OnInit } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';
import { UserService } from '../../services/user.service';
import { QuestionsService } from '../../services/questions.service';
import { CommandService } from '../../services/command.service';
import { UserAnswerService } from '../../services/user-answer.service';
import { ScoreService } from '../../services/score.service';
import { SettingsService } from '../../services/settings.service';
import { Observable, forkJoin } from 'rxjs';

interface Cell {
  row: number;
  col: number;
  revealed: boolean;
  isShip: boolean;
  shipId?: string;
  icon?: string;
  status?: 'hidden' | 'revealed-water' | 'revealed-ship' | 'hit-sunk' | 'revealed-unknown' | 'revealed-carrier' | 'carrier-sunk';
  justRevealed: boolean;
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
  team_id: string;
}

@Component({
  selector: 'app-show-battlefield',
  templateUrl: './show-battlefield.component.html',
  styleUrl: './show-battlefield.component.css'
})
export class ShowBattlefieldComponent {

  grid: Cell[][] = [];
  columnLabels = 'ABCDEFGHIJKLMNOPQ'.split('');
  ships: any[] = [];
  revealedWater: Set<string> = new Set();
  gameId: any; // Replace with actual game ID

  missileSound = new Audio('/assets/missile.wav');
  explosionSound = new Audio('/assets/explosion.wav');
  killExplosionSound = new Audio('/assets/big_explosion.wav');
  waterSplashSound = new Audio('/assets/water.mp3');

  originalList: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
  originalListId: string[] = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
  names: string[] = [];
  reversedNames: string[] = [];
  savedList: string[] = [];
  locked = false;
  highlightedIndex = 0;
  namesId: string[] = [];
  reversedNamesId: string[] = [];
  selectedIndex = 0;

  activeUsers: any = [];
  activeUsersNumber: number = 0;
  gameQuestions: any = [];
  questionNumber: any = 0;
  question_number = 0;
  answeredUsers: number[] = [0, 0, 0, 0, 0, 0];
  userAnswers: any = [];

  teams: Team[] = [];

  timeInSeconds = 60;
  timeLeft = 0;
  timeSend = 0;
  current_start_time: any = 0;

  timerInterval: any;
  timerInterval2: any;

  isSidebarCollapsed = false;

  doubleBarrelActive: boolean = false;   // tracks if Двустволка was triggered
  doubleBarrelMoves: number = 0;
  doubleBarrelMoveHighlight: number = 0;

  screenCommand: string = '';
  clickedRow: any;
  clickedCol: any;

  predictions: any;

  lastAction: string = '';
  number_of_killed_ships: number = 0;
  playedQuestions: string = '';
  questionTypes: string = '';

  cellMessage: string = '';
  actionMessage: string = '';
  changesMessage: string = '';
  swapMessage: string = '';

  anotherLanguage: boolean = false;

  currentPlayingQuestionIndex: number = -1;

  carrierNumber: number = 0;

  timerInterval3: any;

  bonusPoints: number = 0;
  penaltyPoints: number = 0;

  // Question type mapping
  questionTypeOptions = [
    { label: 'Стандарт', value: 1 },
    { label: 'После убийства корабля', value: 3 },
    { label: 'Песня', value: 5 },
    { label: 'Особый тур', value: -1 }
  ];

  lastRevealedCell: { row: number; col: number } | null = null;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private fleetService: BattlefieldService, private userAnswerService: UserAnswerService, private userService: UserService, private questionService: QuestionsService, private commandService: CommandService, private scoreService: ScoreService, private settingsService: SettingsService) {

    this.timerInterval3 = setInterval(() => {
      this.commandService.get_command().subscribe((response: any) => {
        if (response[3]) {
          this.screenCommand = response[3];
          var splitted = this.screenCommand.split(",");
          this.clickedRow = splitted[0];
          this.clickedCol = splitted[1];
          if (this.wasCellClicked(parseInt(this.clickedRow), parseInt(this.clickedCol))) {
          }
          else {
            var cellClicked = this.getCell(parseInt(this.clickedRow), parseInt(this.clickedCol));
            if (cellClicked) {
              this.cellClicked(cellClicked);
            }
          }
        }
      });
    }, 1000);
  }

  onUserChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = parseInt(target.value);
    if (!isNaN(index)) {
      this.highlightedIndex = index;
      localStorage.setItem('index', this.highlightedIndex.toString());
      this.showBattlefield();
    }
  }

  wasCellClicked(row: number, col: number): boolean {
    const cell = this.getCell(row, col);
    if (!cell) {
      return false; // out of bounds
    }
    return cell.revealed; // true if already clicked
  }

  getCell(row: number, col: number): Cell | null {
    if (row < 0 || row >= this.grid.length) {
      return null;
    }
    if (col < 0 || col >= this.grid[row].length) {
      return null;
    }
    return this.grid[row][col];
  }

  ngOnInit(): void {
    this.gameId = localStorage.getItem("gameId");
    const storedIndex = localStorage.getItem('index');
    const storedNumber = localStorage.getItem('killed_ships');
    const storedPlayedQuestions = localStorage.getItem('played_questions');
    const storedQuestionTypes = localStorage.getItem('question_types');
    this.carrierNumber = localStorage.getItem('carrier_number') ? parseInt(localStorage.getItem('carrier_number')!) : 0;
    if (storedIndex !== null) {
      if (storedIndex == '') { this.highlightedIndex = 0; }
      else {
        this.highlightedIndex = parseInt(storedIndex);
      }
    }
    if (storedNumber !== null) {
      if (storedNumber == '') { this.number_of_killed_ships = 0; }
      else {
        this.number_of_killed_ships = parseInt(storedNumber);
      }
    }
    if (storedPlayedQuestions !== null) {
      if (storedPlayedQuestions == '') { this.playedQuestions = ''; }
      else {
        this.playedQuestions = storedPlayedQuestions;
      }
    }
    if (storedQuestionTypes !== null) {
      if (storedQuestionTypes == '') { this.questionTypes = ''; }
      else {
        this.questionTypes = storedQuestionTypes;
      }
    }
    this.initGrid();
    this.loadFleetData();
    this.originalList = [];
    this.originalListId = [];
    this.settingsService.get_special_cells(this.gameId).subscribe(response4 => {
      this.predictions = response4;
    });
    this.settingsService.get_numbers().subscribe((response3: any) => {
      if (response3[0].language == 'uz') {
        this.anotherLanguage = true;
      }
      else {
        this.anotherLanguage = false;
      }
      this.fleetService.getQueue(this.gameId).subscribe((response: any) => {
        if (response["message"] == "No order") {
          // Example: To load from service instead of hardcoded list
          this.userService.get_all_game_users().subscribe((data: any) => {
            this.activeUsers = data;
            this.activeUsersNumber = data.length;
            for (let i = 0; i < data.length; i++) {
              this.originalList.push(data[i].username);
              this.originalListId.push(data[i].id);
            }
            this.names = [...this.originalList];
            this.namesId = [...this.originalListId];
          });
        }
        else {
          response.sort((a: any, b: any) => a.order - b.order);
          //this.highlightedIndex = response[0].current;
          this.activeUsers = response;
          this.activeUsersNumber = response.length;
          for (let i = 0; i < response.length; i++) {
            this.originalList.push(response[i].username);
            this.originalListId.push(response[i].id);
          }
          this.names = [...this.originalList];
          this.namesId = [...this.originalListId];
          this.locked = true;
        }
        this.questionService.get_all_game_questions().subscribe((response2: any) => {
          this.gameQuestions = response2;
          var playedQuestionsArray = this.playedQuestions.split(',').map((q: string) => q.trim()).filter((q: string) => q !== '');
          if (this.questionTypes == '') {
            for (let i = 0; i < this.gameQuestions.length; i++) {
              this.questionTypes = this.questionTypes + '1,';
            }
          }
          var questionTypesArray = this.questionTypes.split(',').map((q: string) => q.trim()).filter((q: string) => q !== '');
          for (let i = 0; i < this.gameQuestions.length; i++) {
            if (playedQuestionsArray.includes(i.toString())) { this.gameQuestions[i].is_played = true; }
            else {
              this.gameQuestions[i].is_played = false;
            }
            this.gameQuestions[i].points = 1;
            this.gameQuestions[i].question_type = parseInt(questionTypesArray[i]);
          }
        });
      });
    });
  }

  onQuestionTypeChange(index: number, event: any) {
    const selectedValue = event.target.value;
    var questionTypesArray = this.questionTypes.split(',').map((q: string) => q.trim()).filter((q: string) => q !== '');
    questionTypesArray[index] = selectedValue;
    this.questionTypes = questionTypesArray.join(',') + ',';
    localStorage.setItem('question_types', this.questionTypes);
  }

  seeUserAnswers(id: any, index: any, points: any) {
    // clearInterval(this.timerInterval);
    // clearInterval(this.timerInterval2);
    var type = '';
    localStorage.setItem("currentQuestionId", id);
    localStorage.setItem("questionNumber", index);
    localStorage.setItem("questionPoints", points);
    // this.sharedService.setData(id);
    // this.router.navigate(['/game-answers']);
    window.open('/game-answers', '_blank');
  }

  startQuestion(question_number2: number) {
    this.currentPlayingQuestionIndex = question_number2 - 1;
    this.timeInSeconds = this.gameQuestions[question_number2 - 1].time_to_answer;
    this.timeSend = this.timeInSeconds;
    this.timeLeft = this.timeInSeconds;
    clearInterval(this.timerInterval);
    clearInterval(this.timerInterval2);
    this.startInterval();
    this.startCurrentQuestion(question_number2);
  }

  startInterval() {
    // if (this.timeLeft <= 0) {
    //   this.timeLeft = this.timeInSeconds;
    // }
    this.timerInterval2 = setInterval(() => {
      var currentTime = new Date();
      var timeInMilliseconds = currentTime.getTime();
      this.timeLeft = this.timeLeft - 1;
      //NEW
      if (this.timeLeft <= 0) {
        //END NEW
        clearInterval(this.timerInterval);
        clearInterval(this.timerInterval2);
        if (this.answeredUsers[this.questionNumber] < this.activeUsersNumber) {
          for (let i = 0; i < this.activeUsers.length; i++) {
            var answered = false;
            for (let j = 0; j < this.userAnswers.length; j++) {
              if (this.activeUsers[i].username == this.userAnswers[j].team) {
                answered = true;
              }
            }
            if (!answered) {
              var question = this.gameQuestions[this.questionNumber - 1];
              var numberQuestion = this.questionNumber;
              this.userAnswerService.get_provisional_answer(this.gameId, question.id, this.activeUsers[i].id).subscribe((response2: any) => {
                //NEW            
                if (response2["message"]) {
                  //END NEW
                  this.userAnswerService.set_user_answer("", this.gameId, question.id, this.activeUsers[i].id, this.timeInSeconds.toString()).subscribe(response => {
                  });
                }
                else {
                  this.userAnswerService.set_user_answer(response2[0].toString(), this.gameId, question.id, this.activeUsers[i].id, this.timeInSeconds.toString()).subscribe(response => {
                  });
                }
              });
            }
          }
        }
        //this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
        this.commandService.set_command("logo", 7).subscribe((response3: any) => {

        });
        //});
      }
    }, 1000);
  }

  startCurrentQuestion(questionNumber: any) {
    var isMedia = "";
    this.gameQuestions[questionNumber - 1].is_played = true;
    this.playedQuestions = this.playedQuestions + (questionNumber - 1) + ",";
    localStorage.setItem('played_questions', this.playedQuestions);
    var question = this.gameQuestions[questionNumber - 1];
    if (question.image_link || question.audio_link || question.video_link) { isMedia = "media_question"; }
    else { isMedia = "question"; }

    this.questionNumber = questionNumber;

    this.questionService.set_question_start_time(question.id, this.gameId).subscribe(response3 => {
      this.commandService.set_command(isMedia + "," + question.id + "," + this.gameId + "," + this.timeSend, 5).subscribe((response: any) => {
        this.commandService.set_command("user_answers," + question.id + "," + this.gameId + "," + this.timeSend, 2).subscribe((response2: any) => {
          this.timerInterval = setInterval(() => {
            this.userAnswerService.get_user_answers(question.id, this.gameId).subscribe((response4: any) => {
              this.userAnswers = response4;
              if (response4.length) {
                this.answeredUsers[questionNumber] = response4.length;
              }
              else {
                this.answeredUsers[questionNumber] = 0;
              }
              for (let i = 0; i < this.gameQuestions.length; i++) {
                if (this.gameQuestions[i].id == question.id) {
                  // if (this.answeredUsers) {
                  this.gameQuestions[i].answerNumber = this.answeredUsers[questionNumber];
                  //}
                }
              }
              if (this.answeredUsers[questionNumber] == this.activeUsersNumber) {
                clearInterval(this.timerInterval);
              }
              //this.userAnswers.sort((a: any, b: any) => a.time.localeCompare(b.time));
            });
          }, 500);
        });
      });
    });
  }

  pauseQuestions() {
    clearInterval(this.timerInterval);
    clearInterval(this.timerInterval2);
    var isMedia = "";
    this.timeSend = this.timeLeft;

    var question = this.gameQuestions[this.question_number - 1];
    if (question.image_link || question.audio_link || question.video_link) { isMedia = "media_question"; }
    else { isMedia = "question"; }

    this.commandService.set_command(isMedia + "," + question.id + "," + this.gameId + ",0", 1).subscribe((response: any) => {
    });
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.timerInterval2);
    clearInterval(this.timerInterval3);
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
          justRevealed: false
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
      for (const cell of ship.parsedCells) {
        const gridCell = this.grid[cell.row][cell.col];
        gridCell.isShip = true;
        gridCell.shipId = ship.id;
        gridCell.revealed = cell.revealed;
        gridCell.status = cell.status;
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

  cellClicked(cell: Cell) {
    if (cell.revealed) return;

    this.cellMessage = "";
    this.actionMessage = "";
    this.changesMessage = "";
    this.swapMessage = "";

    this.bonusPoints = 0;
    this.penaltyPoints = 0;

    cell.revealed = true;
    this.cellMessage = 'Открыта ячейка: ' + this.cellToCoord(cell.row, cell.col);
    this.lastRevealedCell = { row: cell.row, col: cell.col };

    if (this.doubleBarrelActive) {
      this.doubleBarrelMoves += 1;
    }

    this.checkPrediction2(cell);

    if (cell.isShip && cell.shipId) {
      cell.status = 'revealed-ship';
      var is_carrier = false;

      const ship = this.ships.find(s => s.id === cell.shipId);
      this.markShipCellRevealed(cell.shipId, cell.row, cell.col);

      if (ship?.type === 'additional') {
        cell.icon = ship.icon || 'fa-bolt'; // show icon immediately
      }

      // 🎯 Play missile and explosion on first hit
      cell.justRevealed = true;
      setTimeout(() => this.missileSound.play(), 300);
      const shipIsSunk1 = this.isShipSunk(ship.id);
      if (shipIsSunk1) {
        setTimeout(() => this.killExplosionSound.play(), 300);
      }
      else {
        setTimeout(() => this.explosionSound.play(), 300);
      }

      // Remove animation after it's done
      setTimeout(() => {
        cell.justRevealed = false;
      }, 800);

      if (!ship?.name.toString().startsWith("Штраф") && !ship?.name.toString().startsWith("Налог")) {
        this.checkPrediction(cell);
      }

      if (ship?.name === 'Профурсетка') {
        is_carrier = true;
        this.carrierNumber = this.carrierNumber + 1;
        localStorage.setItem('carrier_number', this.carrierNumber.toString());
        const shipIsSunk = this.isShipSunk(ship.id);

        if (!shipIsSunk) {
          this.moveCarrierRemainingParts(ship);
        } else {
          this.markSunk(ship.id);
          //this.revealSurroundingWater(ship.id);
        }
      } else if (ship?.name === 'Эхолот') {

        this.revealSpecialSurroundings(cell.row, cell.col);
        this.markSunk(ship.id);
      }
      else {
        if (this.isShipSunk(ship.id)) {
          this.markSunk(ship.id);
          //this.revealSurroundingWater(ship.id);
        }
      }
      this.updateScore(ship.type, ship.name, this.isShipSunk(ship.id), is_carrier);
    } else {
      cell.status = 'revealed-water';
      this.actionMessage = "Промах!";
      this.waterSplashSound.play();
      const coord = `${this.columnLabels[cell.col]}${cell.row + 1}`;
      this.revealedWater.add(coord);
      if (this.doubleBarrelActive) {
        if (this.doubleBarrelMoves >= 2) {
          this.doubleBarrelActive = false;
          if (this.doubleBarrelMoveHighlight > 1) {
            this.changesMessage = "Переход хода на: " + this.doubleBarrelMoveHighlight;
            if (this.anotherLanguage) {
              this.changesMessage = "Navbat: " + this.doubleBarrelMoveHighlight;
            }
            this.moveHighlight(this.doubleBarrelMoveHighlight, false);
          }
          else {
            this.changesMessage = "Переход хода на: 1";
            if (this.anotherLanguage) {
              this.changesMessage = "Navbat: 1";
            }
            this.moveHighlight(1, false);
          }
        }
        else {
          this.doubleBarrelMoveHighlight = 1;
          this.changesMessage = "Осталось выстрелов с Двустволки: 1";
        }
      }
      else {
        this.changesMessage = "Переход хода на: 1";
        if (this.anotherLanguage) {
          this.changesMessage = "Navbat: 1";
        }
        this.moveHighlight(1, false);
      }
      this.saveUpdatedFleet(false);
    }
  }

  checkPrediction(cell: Cell) {
    const cell_string = this.cellToCoord(cell.row, cell.col);
    for (let i = 0; i < this.predictions.length; i++) {
      if (this.predictions[i].cell === cell_string) {
        this.cellMessage += "; Команда " + this.predictions[i].user_name + " угадала ячейку и получает 10 очков!";
        if (this.names[this.highlightedIndex] == this.predictions[i].user_name) {
          this.bonusPoints += 10;
          this.scoreService.set_special(this.gameId, this.predictions[i].user_id).subscribe(response => {
          });
        }
        else {
          this.scoreService.save_bonus(this.gameId, this.predictions[i].user_id, "10").subscribe(response => {
          });
        }
      }
    }
  }

  checkPrediction2(cell: Cell) {
    const cell_string = this.cellToCoord(cell.row, cell.col);
    for (let i = 0; i < this.predictions.length; i++) {
      if (this.predictions[i].cell_two === cell_string) {
        this.cellMessage += "; Команда " + this.names[this.highlightedIndex] + " попала в мину " + this.predictions[i].user_name + " и получает штраф в 5 баллов!";
        this.penaltyPoints -= 5;
      }
    }
  }

  revealSpecialSurroundings(row: number, col: number): void {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nr = row + dx;
        const nc = col + dy;

        if (nr >= 0 && nr < 17 && nc >= 0 && nc < 17) {
          const neighborCell = this.grid[nr][nc];

          // Reveal only if hidden
          if (neighborCell.status === 'hidden') {
            if (!neighborCell.isShip) {
              // Water
              neighborCell.status = 'revealed-water';
              neighborCell.revealed = true;
              const coord = `${this.columnLabels[neighborCell.col]}${neighborCell.row + 1}`;
              this.revealedWater.add(coord);
            } else {
              // Occupied by some ship – reveal as "unknown ship" (special color)
              neighborCell.status = 'revealed-unknown';
              neighborCell.revealed = false;
            }
          }
        }
      }
    }
  }

  moveHighlight(step: number, check: boolean) {
    if (this.names?.length > 0) {
      this.highlightedIndex = (this.highlightedIndex + step) % this.names.length;
      localStorage.setItem('index', this.highlightedIndex.toString());
    }
    else {
      this.highlightedIndex = 0;
      localStorage.setItem('index', this.highlightedIndex.toString());
    }
    // this.fleetService.save_current(this.gameId, (this.highlightedIndex + step) % this.names.length).subscribe(response => {

    // });
  }

  updateScore(ship_type: string, ship_name: string, is_sunk: boolean, is_carrier: boolean) {
    if (ship_type == 'standard') {
      if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
      if (is_sunk) {
        if (is_carrier) {
          this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "10", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
            this.actionMessage = "Профурсетка потоплена!";
            this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 10 очков за потопление Профурсетки!";
            this.carrierNumber = 0;
            this.saveUpdatedFleet(true);
          });
        }
        else {
          this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "5", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
            this.actionMessage = ship_name + " потоплен(а)!";
            this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 5 очков за потопление!";
            this.saveUpdatedFleet(true);
          });
        }
      }
      else {
        if (is_carrier) {
          this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], this.carrierNumber.toString(), "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
            this.actionMessage = "Попадание в корабль!";
            this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает " + this.carrierNumber.toString() + " очко(в) за попадание!";
            this.saveUpdatedFleet(true);
          });
        }
        else {
          this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "1", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
            this.actionMessage = "Попадание в корабль!";
            this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 1 очко за попадание!";
            this.saveUpdatedFleet(true);
          });
        }
      }
    }
    else if (ship_type == 'additional') {
      if (ship_name == 'Сюрприз') {
        this.actionMessage = "Сюрприз!";
        if (this.anotherLanguage) {
          this.actionMessage = "Syurpriz";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Двустволка') {
        this.doubleBarrelActive = true;
        this.doubleBarrelMoves = 0;
        this.actionMessage = "Активирована двустволка!";
        if (this.anotherLanguage) {
          this.actionMessage = "Ikkitalik zarba!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " может сделать ещё два выстрела!";
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Реверс') {
        this.reversedNames = [...this.names].reverse();
        this.reversedNamesId = [...this.namesId].reverse();
        this.highlightedIndex = this.names.length - 1 - this.highlightedIndex;
        localStorage.setItem('index', this.highlightedIndex.toString());

        if (this.doubleBarrelActive) {
          if (this.doubleBarrelMoves >= 2) {
            this.doubleBarrelActive = false;
            if (this.doubleBarrelMoveHighlight > 1) {
              this.moveHighlight(this.doubleBarrelMoveHighlight, false);
            }
            else {
              this.moveHighlight(1, false);
            }
          }
          else {
            this.changesMessage = "Осталось выстрелов с Двустволки: 1";
            this.doubleBarrelMoveHighlight = 1;
          }
        } else {
          this.moveHighlight(1, false);
        }

        this.fleetService.saveQueue(this.gameId, this.reversedNames, this.highlightedIndex).subscribe(() => {
          this.names = this.reversedNames;
          this.namesId = this.reversedNamesId;
          this.actionMessage = "Порядок команд реверсирован!";
          if (this.anotherLanguage) {
            this.actionMessage = "Revers!";
          }
          this.saveUpdatedFleet(true);
        });
      }
      else if (ship_name == 'Переход +5') {
        if (this.doubleBarrelActive) {
          if (this.doubleBarrelMoves >= 2) {
            this.doubleBarrelActive = false;
            if (this.doubleBarrelMoveHighlight > 1) {
              this.moveHighlight(this.doubleBarrelMoveHighlight + 5, false);
            }
            else {
              this.moveHighlight(5, false);
            }
          }
          else {
            this.changesMessage = "Осталось выстрелов с Двустволки: 1";
            this.doubleBarrelMoveHighlight = 5;
          }
        } else {
          this.actionMessage = "Переход хода на: 5";
          if (this.anotherLanguage) {
            this.actionMessage = "Navbat: 5!";
          }
          this.moveHighlight(5, false);
        }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Переход +3') {
        if (this.doubleBarrelActive) {
          if (this.doubleBarrelMoves >= 2) {
            this.doubleBarrelActive = false;
            if (this.doubleBarrelMoveHighlight > 1) {
              this.moveHighlight(this.doubleBarrelMoveHighlight + 3, false);
            }
            else {
              this.moveHighlight(3, false);
            }
          }
          else {
            this.changesMessage = "Осталось выстрелов с Двустволки: 1";
            this.doubleBarrelMoveHighlight = 3;
          }
        } else {
          this.actionMessage = "Переход хода на: 3";
          if (this.anotherLanguage) {
            this.actionMessage = "Navbat: 3!";
          }
          this.moveHighlight(3, false);
        }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Караоке') {
        this.actionMessage = "Караоке!";
        if (this.anotherLanguage) {
          this.actionMessage = "Karaoke!";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Бонус +5') {
        this.actionMessage = "Бонус 5 очков!";
        if (this.anotherLanguage) {
          this.actionMessage = "Bonus: 5!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 5 бонусных очков!";
        this.bonusPoints += 5;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
          this.saveUpdatedFleet(true);
        });
      }
      else if (ship_name == 'Бонус +3') {
        this.actionMessage = "Бонус 3 очка!";
        if (this.anotherLanguage) {
          this.actionMessage = "Bonus: 3!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 3 бонусных очка!";
        this.bonusPoints += 3;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
          this.saveUpdatedFleet(true);
        });
      }
      else if (ship_name == 'Бонус +1') {
        this.actionMessage = "Бонус 1 балл!";
        if (this.anotherLanguage) {
          this.actionMessage = "Bonus: 1!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает 1 бонусный балл!";
        this.bonusPoints += 1;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
          this.saveUpdatedFleet(true);
        });
      }
      else if (ship_name == 'Штраф -5') {
        this.actionMessage = "Штраф 5 баллов!";
        if (this.anotherLanguage) {
          this.actionMessage = "Jarima: 5!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает штраф в 5 баллов!";
        this.penaltyPoints -= 5;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive) {
            if (this.doubleBarrelMoves >= 2) {
              this.doubleBarrelActive = false;
              if (this.doubleBarrelMoveHighlight > 1) {
                this.moveHighlight(this.doubleBarrelMoveHighlight, false);
                this.saveUpdatedFleet(false);
              }
              else {
                this.moveHighlight(1, false);
                this.saveUpdatedFleet(false);
              }
            }
            else {
              this.doubleBarrelMoveHighlight = 1;
            }
          }
          else {
            this.moveHighlight(1, false);
            this.saveUpdatedFleet(false);
          }
        });
      }
      else if (ship_name == 'Штраф -3') {
        this.actionMessage = "Штраф 3 балла!";
        if (this.anotherLanguage) {
          this.actionMessage = "Jarima: 3!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает штраф в 3 балла!";
        this.penaltyPoints -= 3;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive) {
            if (this.doubleBarrelMoves >= 2) {
              this.doubleBarrelActive = false;
              if (this.doubleBarrelMoveHighlight > 1) {
                this.moveHighlight(this.doubleBarrelMoveHighlight, false);
                this.saveUpdatedFleet(false);
              }
              else {
                this.moveHighlight(1, false);
                this.saveUpdatedFleet(false);
              }
            }
            else {
              this.doubleBarrelMoveHighlight = 1;
            }
          } else {
            this.moveHighlight(1, false);
            this.saveUpdatedFleet(false);
          }
        });
      }
      else if (ship_name == 'Штраф -1') {
        this.actionMessage = "Штраф 1 балл!";
        if (this.anotherLanguage) {
          this.actionMessage = "Jarima: 1!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает штраф в 1 балл!";
        this.penaltyPoints -= 1;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive) {
            if (this.doubleBarrelMoves >= 2) {
              this.doubleBarrelActive = false;
              if (this.doubleBarrelMoveHighlight > 1) {
                this.moveHighlight(this.doubleBarrelMoveHighlight, false);
                this.saveUpdatedFleet(false);
              }
              else {
                this.moveHighlight(1, false);
                this.saveUpdatedFleet(false);
              }
            }
            else {
              this.doubleBarrelMoveHighlight = 1;
            }
          } else {
            this.moveHighlight(1, false);
            this.saveUpdatedFleet(false);
          }
        });
      }
      else if (ship_name == 'Песня') {
        this.actionMessage = "Песня!";
        if (this.anotherLanguage) {
          this.actionMessage = "Qo'shiq!";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Всем чётным командам по 5 баллов') {
        this.actionMessage = "Всем чётным командам по 5 баллов!";
        if (this.anotherLanguage) {
          this.actionMessage = "Barcha juft jamoalarga 5 ball!";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }
            this.teams = [...this.teams].sort((a, b) => {
              if (b.total !== a.total) return b.total - a.total;
              if (b.ship_kill_points !== a.ship_kill_points) return b.ship_kill_points - a.ship_kill_points;
              if (b.ship_hit_points !== a.ship_hit_points) return b.ship_hit_points - a.ship_hit_points;
              if (b.question_points !== a.question_points) return b.question_points - a.question_points;
              if (b.bonus_points !== a.bonus_points) return b.bonus_points - a.bonus_points;
              return b.penalty_points - a.penalty_points; // less penalty = better
            });

            let place = 1;
            for (let i = 0; i < this.teams.length; i++) {
              if (i > 0 && (
                this.teams[i].total === this.teams[i - 1].total &&
                this.teams[i].ship_kill_points === this.teams[i - 1].ship_kill_points &&
                this.teams[i].ship_hit_points === this.teams[i - 1].ship_hit_points &&
                this.teams[i].question_points === this.teams[i - 1].question_points &&
                this.teams[i].bonus_points === this.teams[i - 1].bonus_points &&
                this.teams[i].penalty_points === this.teams[i - 1].penalty_points
              )) {
                // same stats → same place
                this.teams[i].place = this.teams[i - 1].place;
              } else {
                this.teams[i].place = place;
              }
              place++;
            }
            this.changesMessage = "Следующие команды получают по 5 баллов: ";
            let observables: Observable<any>[] = [];
            this.teams.forEach(team => {
              if (team.place % 2 === 0) {
                this.changesMessage += team.name + "; ";
                if (team.name == this.names[this.highlightedIndex]) {
                  this.bonusPoints += 5;
                  observables.push(this.scoreService.save_result(this.gameId, team.team_id, "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()));
                }
                else {
                  observables.push(this.scoreService.save_result(this.gameId, team.team_id, "0", "0", "0", "5", "0"));
                }
              }
            });
            forkJoin(observables).subscribe(results => {
              this.saveUpdatedFleet(true);
            });
          }
        });
      }
      else if (ship_name == 'Всем нечётным командам по 5 баллов') {
        this.actionMessage = "Всем нечётным командам по 5 баллов!";
        if (this.anotherLanguage) {
          this.actionMessage = "Barcha toq jamoalarga 5 ball!";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }
            this.teams = [...this.teams].sort((a, b) => {
              if (b.total !== a.total) return b.total - a.total;
              if (b.ship_kill_points !== a.ship_kill_points) return b.ship_kill_points - a.ship_kill_points;
              if (b.ship_hit_points !== a.ship_hit_points) return b.ship_hit_points - a.ship_hit_points;
              if (b.question_points !== a.question_points) return b.question_points - a.question_points;
              if (b.bonus_points !== a.bonus_points) return b.bonus_points - a.bonus_points;
              return b.penalty_points - a.penalty_points; // less penalty = better
            });

            let place = 1;
            for (let i = 0; i < this.teams.length; i++) {
              if (i > 0 && (
                this.teams[i].total === this.teams[i - 1].total &&
                this.teams[i].ship_kill_points === this.teams[i - 1].ship_kill_points &&
                this.teams[i].ship_hit_points === this.teams[i - 1].ship_hit_points &&
                this.teams[i].question_points === this.teams[i - 1].question_points &&
                this.teams[i].bonus_points === this.teams[i - 1].bonus_points &&
                this.teams[i].penalty_points === this.teams[i - 1].penalty_points
              )) {
                // same stats → same place
                this.teams[i].place = this.teams[i - 1].place;
              } else {
                this.teams[i].place = place;
              }
              place++;
            }
            this.changesMessage = "Следующие команды получают по 5 баллов: ";
            let observables: Observable<any>[] = [];
            this.teams.forEach(team => {
              if (team.place % 2 === 1) {
                this.changesMessage += team.name + "; ";
                if (team.name == this.names[this.highlightedIndex]) {
                  this.bonusPoints += 5;
                  observables.push(this.scoreService.save_result(this.gameId, team.team_id, "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()));
                }
                else {
                  observables.push(this.scoreService.save_result(this.gameId, team.team_id, "0", "0", "0", "5", "0"));
                }
              }
            });
            forkJoin(observables).subscribe(results => {
              this.saveUpdatedFleet(true);
            });
          }
        });
      }
      else if (ship_name == 'Особый тур') {
        this.actionMessage = "Особый тур!";
        if (this.anotherLanguage) {
          this.actionMessage = "Maxsus tur!";
        }
        this.changesMessage = "Разыгрывается 20 баллов";
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Эхолот') {
        this.actionMessage = "Эхолот!";
        if (this.anotherLanguage) {
          this.actionMessage = "Exolot!";
        }
        this.changesMessage = "Открыты все соседние ячейки вокруг попадания";
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.saveUpdatedFleet(true);
      }
      else if (ship_name == 'Налог') {
        this.actionMessage = "Налог!";
        if (this.anotherLanguage) {
          this.actionMessage = "Soliq!";
        }
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " теряет 10% от своих набранных очков!";
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              if (this.teams[i].name == this.names[this.highlightedIndex]) {
                const totalPoints = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
                const pointsToDeduct = Math.ceil(totalPoints * 0.1);
                this.penaltyPoints -= pointsToDeduct;
                this.scoreService.save_result(this.gameId, this.teams[i].team_id, "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
                  if (this.doubleBarrelActive) {
                    if (this.doubleBarrelMoves >= 2) {
                      this.doubleBarrelActive = false;
                      if (this.doubleBarrelMoveHighlight > 1) {
                        this.moveHighlight(this.doubleBarrelMoveHighlight, false);
                        this.saveUpdatedFleet(false);
                      }
                      else {
                        this.moveHighlight(1, false);
                        this.saveUpdatedFleet(false);
                      }
                    }
                    else {
                      this.doubleBarrelMoveHighlight = 1;
                    }
                  } else {
                    this.moveHighlight(1, false);
                    this.saveUpdatedFleet(false);
                  }
                });
              }
            }
          }
        });
      }
      else if (ship_name == 'Джекпот') {
        this.actionMessage = "Джекпот!";
        this.changesMessage = "Команда " + this.names[this.highlightedIndex] + " получает " + this.number_of_killed_ships.toString() + " очко(в) бонуса!";
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.bonusPoints += this.number_of_killed_ships;
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", this.bonusPoints.toString(), this.penaltyPoints.toString()).subscribe(response => {
          if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
          this.saveUpdatedFleet(true);
        });
      }
      else if (ship_name == 'Рокировка') {
        this.actionMessage = "Рокировка!";
        if (this.anotherLanguage) {
          this.actionMessage = "Rokirovka!";
        }
        if (this.doubleBarrelActive && this.doubleBarrelMoves >= 2) { this.doubleBarrelActive = false; }
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }

            this.teams = [...this.teams].sort((a, b) => {
              if (b.total !== a.total) return b.total - a.total;
              if (b.ship_kill_points !== a.ship_kill_points) return b.ship_kill_points - a.ship_kill_points;
              if (b.ship_hit_points !== a.ship_hit_points) return b.ship_hit_points - a.ship_hit_points;
              if (b.question_points !== a.question_points) return b.question_points - a.question_points;
              if (b.bonus_points !== a.bonus_points) return b.bonus_points - a.bonus_points;
              return b.penalty_points - a.penalty_points; // less penalty = better
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

            const selectedTeamName = this.names[this.highlightedIndex];
            const selectedIndex = this.teams.findIndex(t => t.name === selectedTeamName);

            if (selectedIndex > 0) {
              var placeChanged = -1;
              const selectedTeam = this.teams[selectedIndex];
              for (let i = selectedIndex - 1; i >= 0; i--) {
                if (this.teams[i].place < selectedTeam.place) {
                  placeChanged = i;
                  break;
                }
              }

              if (placeChanged >= 0) {

                const higherTeam = this.teams[placeChanged];

                const tiedTeams = this.teams.filter(t =>
                  t.total === higherTeam.total &&
                  t.ship_kill_points === higherTeam.ship_kill_points &&
                  t.ship_hit_points === higherTeam.ship_hit_points &&
                  t.question_points === higherTeam.question_points &&
                  t.bonus_points === higherTeam.bonus_points &&
                  t.penalty_points === higherTeam.penalty_points
                );

                if (tiedTeams.length > 0) {
                  if (tiedTeams.length > 1) {
                    this.changesMessage = `Команда ${selectedTeam.name} поменялась местами с командами: ${tiedTeams.map(t => t.name).join('; ')}`;
                  }
                  else {
                    this.changesMessage = `Команда ${selectedTeam.name} поменялась местами с командой: ${tiedTeams[0].name}`;
                  }
                  const swapped = [selectedTeam.name, ...tiedTeams.map(t => t.name)];
                  for (let i = 0; i < swapped.length; i++) {
                    this.swapMessage += swapped[i];
                    if (i < swapped.length - 1) {
                      this.swapMessage += ";";
                    }
                  }
                  const selectedResult = {
                    ship_hit_points: selectedTeam.ship_hit_points.toString(),
                    ship_kill_points: selectedTeam.ship_kill_points.toString(),
                    question_points: selectedTeam.question_points.toString(),
                    bonus_points: selectedTeam.bonus_points.toString(),
                    penalty_points: selectedTeam.penalty_points.toString()
                  };

                  const higherResult = {
                    ship_hit_points: higherTeam.ship_hit_points.toString(),
                    ship_kill_points: higherTeam.ship_kill_points.toString(),
                    question_points: higherTeam.question_points.toString(),
                    bonus_points: higherTeam.bonus_points.toString(),
                    penalty_points: higherTeam.penalty_points.toString()
                  };

                  this.scoreService.update_result(
                    this.gameId,
                    selectedTeam.team_id,
                    higherResult.ship_hit_points,
                    higherResult.ship_kill_points,
                    higherResult.question_points,
                    higherResult.bonus_points,
                    higherResult.penalty_points
                  ).subscribe(() => {
                    // update all tied higher teams with selected result
                    let observables: Observable<any>[] = [];
                    tiedTeams.forEach(team => {
                      observables.push(this.scoreService.update_result(
                        this.gameId,
                        team.team_id,
                        selectedResult.ship_hit_points,
                        selectedResult.ship_kill_points,
                        selectedResult.question_points,
                        selectedResult.bonus_points,
                        selectedResult.penalty_points
                      ));
                    });
                    forkJoin(observables).subscribe(results => {
                      this.saveUpdatedFleet(true);
                    });
                  });
                }
                else {
                  this.saveUpdatedFleet(true);
                }
              }
              else {
                this.saveUpdatedFleet(true);
              }
            }
            else {
              this.saveUpdatedFleet(true);
            }
          }
        });
      }
    }
  }

  moveCarrierRemainingParts(ship: any) {

    const remainingCells = ship.parsedCells.filter((cell: any) => {
      const coord = this.cellToCoord(cell.row, cell.col);
      return !ship.revealed_cells.includes(coord) && !this.revealedWater.has(coord);
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
    const maxAttempts = 289;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * 17);
      const startCol = Math.floor(Math.random() * 17);

      const newCells: { row: number, col: number }[] = [];

      let valid = true;
      for (let i = 0; i < remainingSize; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const col = direction === 'horizontal' ? startCol + i : startCol;

        if (row >= 17 || col >= 17) {
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
              nr >= 0 && nr < 17 &&
              nc >= 0 && nc < 17 &&
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

        this.saveUpdatedFleet(true);
        return;
      }
    }

    console.warn("No valid new position found for escaping Carrier");
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

  markSunk(shipId: string) {
    const ship = this.ships.find(s => s.id === shipId);
    if (!ship || !ship.parsedCells) return;

    // Skip animation/styling for additional ships
    if (ship.type === 'additional') return;

    if (ship?.type !== 'additional') {
      this.number_of_killed_ships = this.number_of_killed_ships + 1;
      localStorage.setItem('killed_ships', this.number_of_killed_ships.toString());
    }

    for (const cell of ship.parsedCells) {
      const gridCell = this.grid[cell.row][cell.col];
      if (ship.name == 'Профурсетка') {
        gridCell.status = 'carrier-sunk';
      }
      else {
        gridCell.status = 'hit-sunk';
      }
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
            r >= 0 && r < 17 && c >= 0 && c < 17 &&
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

  finishGame() {
    this.showTable();
  }

  showAllCells() {
    this.commandService.set_command("logo," + this.gameId, 1).subscribe((response3: any) => {
      this.commandService.set_command("battlefieldshowAllCells," + this.gameId, 3).subscribe((response3: any) => {
        
      });
    });
  }


  saveUpdatedFleet(isHit: boolean) {
    const lastRow = this.lastRevealedCell?.row;
    const lastCol = this.lastRevealedCell?.col;
    const serializedShips = this.ships.map(ship => ({
      id: ship.id,
      name: ship.name,
      type: ship.type,
      direction: ship.direction,
      size: ship.size,
      cells: ship.parsedCells.map((c: any) => {
        const gridCell = this.grid[c.row][c.col];
        if (c.row === lastRow && c.col === lastCol) {
          gridCell.justRevealed = true;
        }
        else {
          gridCell.justRevealed = false;
        }
        return {
          coord: this.cellToCoord(c.row, c.col),
          status: gridCell.status,
          revealed: gridCell.revealed,
          justRevealed: gridCell.justRevealed
        };
      }),
      revealed_cells: ship.revealed_cells,
      icon: ship.icon || 'fa-bolt'
    }));
    this.fleetService.updateFleetLayout(this.gameId, serializedShips, Array.from(this.revealedWater).join(',')).subscribe(response => {
      this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + this.cellMessage + "," + this.actionMessage + "," + this.changesMessage + "," + this.swapMessage + "," + Math.random(), 3).subscribe((response3: any) => {
        if (!isHit) {
          setTimeout(() => this.commandService.set_command("player_battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 1).subscribe(), 5000);
        }
      });
    });
  }

  showBattlefield() {
    this.commandService.set_command("player_battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 1).subscribe((response3: any) => {
      this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
      });
    });
  }

  showTable() {
    this.commandService.set_command("score," + this.gameId, 3).subscribe((response3: any) => {
      this.commandService.set_command("logo", 1).subscribe((response2: any) => {
      });
    });
  }
}
