import { Component, OnInit } from '@angular/core';
import { BattlefieldService } from '../../services/battlefield.service';
import { UserService } from '../../services/user.service';
import { QuestionsService } from '../../services/questions.service';
import { CommandService } from '../../services/command.service';
import { UserAnswerService } from '../../services/user-answer.service';
import { ScoreService } from '../../services/score.service';
import { SettingsService } from '../../services/settings.service';

interface Cell {
  row: number;
  col: number;
  revealed: boolean;
  isShip: boolean;
  shipId?: string;
  icon?: string;
  status?: 'hidden' | 'revealed-water' | 'revealed-ship' | 'hit-sunk' | 'revealed-unknown';
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
  columnLabels = 'ABCDEFGHIKLMNOP'.split('');
  ships: any[] = [];
  revealedWater: Set<string> = new Set();
  gameId: any; // Replace with actual game ID

  missileSound = new Audio('/assets/missile.wav');
  explosionSound = new Audio('/assets/explosion.wav');
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

  double_barrel = false;

  screenCommand: string = '';
  clickedRow: any;
  clickedCol: any;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private fleetService: BattlefieldService, private userAnswerService: UserAnswerService, private userService: UserService, private questionService: QuestionsService, private commandService: CommandService, private scoreService: ScoreService, private settingsService: SettingsService) {
    setInterval(() => {
      this.commandService.get_command().subscribe((response: any) => {
        if (response[3]) {
          this.screenCommand = response[3];
          var splitted = this.screenCommand.split(",");
          this.clickedRow = splitted[0];
          this.clickedCol = splitted[1];
          if (this.wasCellClicked(this.clickedRow, this.clickedCol)) {

          }
          else {
            this.cellClicked(this.getCell(parseInt(this.clickedRow), parseInt(this.clickedCol)));
          }
        }
      });
    }, 1000);
  }

  wasCellClicked(row: number, col: number): boolean {
    const cell = this.getCell(row, col);
    if (!cell) {
      return false; // out of bounds
    }
    return cell.revealed; // true if already clicked
  }

  getCell(row: number, col: number) {
    if (row < 0 || row >= this.grid.length) {
    }
    if (col < 0 || col >= this.grid[row].length) {
    }
    return this.grid[row][col];
  }

  ngOnInit(): void {
    this.gameId = localStorage.getItem("gameId");
    this.initGrid();
    this.loadFleetData();
    this.originalList = [];
    this.originalListId = [];
    this.settingsService.get_numbers().subscribe(response3 => {
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
          console.log(response);
          this.highlightedIndex = response[0].current;
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
        });
      });
    });
  }

  seeUserAnswers(id: any, index: any) {
    // clearInterval(this.timerInterval);
    // clearInterval(this.timerInterval2);
    var type = '';
    localStorage.setItem("currentQuestionId", id);
    localStorage.setItem("questionNumber", index);
    // this.sharedService.setData(id);
    // this.router.navigate(['/game-answers']);
    window.open('/game-answers', '_blank');
  }

  startQuestion(question_number2: number) {
    this.timeInSeconds = this.gameQuestions[question_number2 - 1].time_to_answer;
    this.timeSend = this.timeInSeconds;
    clearInterval(this.timerInterval);
    clearInterval(this.timerInterval2);
    this.startInterval();
    this.startCurrentQuestion(question_number2);
  }

  startInterval() {
    if (this.timeLeft <= 0) {
      this.timeLeft = this.timeInSeconds;
    }
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
        this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
          this.commandService.set_command("logo", 4).subscribe((response3: any) => {

          });
        });
      }
    }, 1000);
  }

  startCurrentQuestion(questionNumber: any) {
    var isMedia = "";

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
        gridCell.revealed = ship.revealed_cells.includes(this.cellToCoord(cell.row, cell.col));
        gridCell.status = gridCell.revealed ? 'revealed-ship' : 'hidden';
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

    cell.revealed = true;


    if (cell.isShip && cell.shipId) {
      cell.status = 'revealed-ship';

      const ship = this.ships.find(s => s.id === cell.shipId);
      console.log(ship);
      this.markShipCellRevealed(cell.shipId, cell.row, cell.col);

      if (ship?.type === 'additional') {
        cell.icon = ship.icon || 'fa-bolt'; // show icon immediately
      }

      // 🎯 Play missile and explosion on first hit
      cell.justRevealed = true;
      this.missileSound.play();
      setTimeout(() => this.explosionSound.play(), 300);

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
          //this.revealSurroundingWater(ship.id);
        }
      } else if (ship?.name === 'Эхолот') {
        console.log("here");
        this.revealSpecialSurroundings(cell.row, cell.col);
        this.markSunk(ship.id);
      }
      else {
        if (this.isShipSunk(ship.id)) {
          this.markSunk(ship.id);
          //this.revealSurroundingWater(ship.id);
        }
      }
      this.updateScore(ship.type, ship.name, this.isShipSunk(ship.id));
    } else {
      cell.status = 'revealed-water';
      this.waterSplashSound.play();
      const coord = `${this.columnLabels[cell.col]}${cell.row + 1}`;
      this.revealedWater.add(coord);
      this.moveHighlight(1, false);
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
    this.saveUpdatedFleet();
  }

  revealSpecialSurroundings(row: number, col: number): void {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nr = row + dx;
        const nc = col + dy;
        console.log("here2")

        if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15) {
          const neighborCell = this.grid[nr][nc];

          // Reveal only if hidden
          if (neighborCell.status === 'hidden') {
            if (!neighborCell.isShip) {
              // Water
              neighborCell.status = 'revealed-water';
              neighborCell.revealed = true;
            } else {
              // Occupied by some ship – reveal as "unknown ship" (special color)
              neighborCell.status = 'revealed-unknown';
              neighborCell.revealed = true;
            }
          }
          console.log(this.grid);
        }
      }
    }
  }

  moveHighlight(step: number, check: boolean) {
    this.highlightedIndex = (this.highlightedIndex + step) % this.names.length;
    if (!check) {
      this.fleetService.save_current(this.gameId, this.highlightedIndex).subscribe(response => {

      });
    }
  } 

  updateScore(ship_type: string, ship_name: string, is_sunk: boolean) {
    console.log(ship_type);
    console.log(ship_name);
    if (ship_type == 'standard') {
      if (is_sunk) {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "5", "0", "0", "0").subscribe(response => {

        });
      }
      else {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "1", "0", "0", "0", "0").subscribe(response => {

        });
      }
    }
    else if (ship_type == 'additional') {
      if (ship_name == 'Сюрприз') {

      }
      else if (ship_name == 'Двустволка') {
        this.double_barrel = true;
      }
      else if (ship_name == 'Реверс') {
        this.reversedNames = [...this.names].reverse();
        this.reversedNamesId = [...this.namesId].reverse();
        this.highlightedIndex = Math.abs(this.highlightedIndex - this.names.length + 1);
        if (this.double_barrel) {
          this.double_barrel = false;
        }
        else {
          this.moveHighlight(1, true);
        }
        for (let i = 0; i < this.reversedNames.length; i++) {
          this.fleetService.saveQueue(this.gameId, this.reversedNames[i], i + 1, this.highlightedIndex).subscribe(response => {
            this.names = this.reversedNames;
            this.namesId = this.reversedNamesId;
            this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
            });
          });
        }
      }
      else if (ship_name == 'Переход +5') {
        this.moveHighlight(5, false);
      }
      else if (ship_name == 'Переход +3') {
        this.moveHighlight(3, false);
      }
      else if (ship_name == 'Караоке') {

      }
      else if (ship_name == 'Бонус +5') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "5", "0").subscribe(response => {

        });
      }
      else if (ship_name == 'Бонус +3') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "3", "0").subscribe(response => {

        });
      }
      else if (ship_name == 'Бонус +1') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "1", "0").subscribe(response => {

        });
      }
      else if (ship_name == 'Штраф -5') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "0", "-5").subscribe(response => {
          if (this.double_barrel) {
            this.double_barrel = false;
          }
          else {
            this.moveHighlight(1, false);
          }
        });
      }
      else if (ship_name == 'Штраф -3') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "0", "-3").subscribe(response => {
          if (this.double_barrel) {
            this.double_barrel = false;
          }
          else {
            this.moveHighlight(1, false);
          }
        });
      }
      else if (ship_name == 'Штраф -1') {
        this.scoreService.save_result(this.gameId, this.namesId[this.highlightedIndex], "0", "0", "0", "0", "-1").subscribe(response => {
          if (this.double_barrel) {
            this.double_barrel = false;
          }
          else {
            this.moveHighlight(1, false);
          }
        });
      }
      else if (ship_name == 'Песня') {

      }
      else if (ship_name == 'Всем чётным командам по 5 баллов') {
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }
            this.teams = [...this.teams].sort((a, b) => b.total - a.total);
            console.log(this.teams.length);
            for (let i = 1; i < this.teams.length; i += 2) {
              console.log(i);
              this.scoreService.save_result(this.gameId, this.teams[i].team_id, "0", "0", "0", "5", "0").subscribe(response2 => {

              });
            }
          }
        });
      }
      else if (ship_name == 'Всем нечётным командам по 5 баллов') {
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }
            this.teams = [...this.teams].sort((a, b) => b.total - a.total);
            console.log(this.teams.length);
            for (let i = 0; i < this.teams.length; i += 2) {
              console.log(i);
              this.scoreService.save_result(this.gameId, this.teams[i].team_id, "0", "0", "0", "5", "0").subscribe(response2 => {

              });
            }
          }
        });
      }
      else if (ship_name == 'Особый тур') {
      }
      else if (ship_name == 'Эхолот') {

      }
      else if (ship_name == 'Рокировка') {
        this.scoreService.get_current_results(this.gameId).subscribe((response: any) => {
          if (response["message"] == 'No answers') {

          }
          else {
            this.teams = response;
            for (let i = 0; i < this.teams.length; i++) {
              this.teams[i].total = this.teams[i].bonus_points + this.teams[i].penalty_points + this.teams[i].question_points + this.teams[i].ship_hit_points + this.teams[i].ship_kill_points;
            }
            this.teams = [...this.teams].sort((a, b) => b.total - a.total);
            for (let i = 0; i < this.teams.length; i++) {
              if (this.teams[i].name == this.names[this.highlightedIndex]) {
                if (i != 0) {
                  this.scoreService.update_result(this.gameId, this.teams[i].team_id, this.teams[i - 1].ship_hit_points.toString(), this.teams[i - 1].ship_kill_points.toString(), this.teams[i - 1].question_points.toString(), this.teams[i - 1].bonus_points.toString(), this.teams[i - 1].penalty_points.toString()).subscribe(response2 => {
                    this.scoreService.update_result(this.gameId, this.teams[i - 1].team_id, this.teams[i].ship_hit_points.toString(), this.teams[i].ship_kill_points.toString(), this.teams[i].question_points.toString(), this.teams[i].bonus_points.toString(), this.teams[i].penalty_points.toString()).subscribe(response2 => {

                    });
                  });
                }
              }
            }
          }
        });
      }
    }
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
      this.commandService.set_command("player_battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 1).subscribe((response3: any) => {
        this.commandService.set_command("score," + this.gameId, 3).subscribe((response3: any) => {
          this.commandService.set_command("battlefield," + this.gameId + "," + this.highlightedIndex + "," + Math.random(), 3).subscribe((response3: any) => {
          });
        });
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
    });
  }
}
