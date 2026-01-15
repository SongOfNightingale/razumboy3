import { Component, OnInit } from '@angular/core';
import { UserAnswerService } from '../../services/user-answer.service';

interface Answer {
  id: number;
  text: string;
  time: string;
  team: string;
  is_correct: boolean;
  points: number;
  questionNumber: number;
  question: number;
  checked: boolean;
}

@Component({
  selector: 'app-game-user-answers',
  templateUrl: './game-user-answers.component.html',
  styleUrl: './game-user-answers.component.css'
})
export class GameUserAnswersComponent implements OnInit {
  allAnswers: Answer[] = [];
  filteredAnswers: Answer[] = [];
  teamList: string[] = [];
  selectedTeam: string = '';
  gameId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(
    private userAnswerService: UserAnswerService
  ) { }

  ngOnInit(): void {
    this.gameId = localStorage.getItem('gameId') || '';
    if (this.gameId) {
      this.loadAllAnswers();
    }
  }

  loadAllAnswers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userAnswerService.get_all_game_answers(this.gameId).subscribe(
      (response: any) => {
        if (response.message) {
          this.errorMessage = response.message;
          this.allAnswers = [];
        } else {
          this.allAnswers = response;
          this.extractTeamList();
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load answers';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  extractTeamList(): void {
    this.teamList = [...new Set(this.allAnswers.map(answer => answer.team))].sort();
    this.selectedTeam = '';
    this.filteredAnswers = [];
  }

  onTeamSelected(): void {
    if (this.selectedTeam) {
      this.filteredAnswers = this.allAnswers.filter(answer => answer.team === this.selectedTeam);
    } else {
      this.filteredAnswers = [];
    }
  }
}