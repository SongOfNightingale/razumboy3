import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrl: './add-questions.component.css'
})
export class AddQuestionsComponent {
  questions = [
    { id: '1', text: 'Category1', type: 'Стандарт', draw: '0', is_active: '0' },
  ];

  sortKey: string = '';
  sortDirection: string = 'asc';

  questionFilter: string = '';
  selectedType: string = '';
  selectedAssign: string = '';
  uniqueTypes: string[] = [];
  uniqueAssigns: string[] = [];

  filteredQuestions = [
    { id: '1', text: 'Category1', type: 'Стандарт', draw: '0', is_active: '0' },
  ];

  subscription: any;

  language: string = '';
  gamesMessage: string = '';

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router, private questionService: QuestionsService, private sharedService: SharedService) {
    this.questions = [];
    this.filteredQuestions = [];
    this.questionService.get_all_questions().subscribe((response: any) => {
      if (response["message"] == "No questions") {
        this.questions = [];
        this.filteredQuestions = [];
      }
      else {
        this.questions = response;
        this.filteredQuestions = this.questions;
        this.uniqueTypes = this.getUniqueRoles();
        this.uniqueAssigns = this.getUniqueAssigns();
      }
    });
  }

  getUniqueRoles(): string[] {
    const roles = this.questions.map(question => question.type);
    return [...new Set(roles)];
  }

  getUniqueAssigns(): string[] {
    const roles = this.questions.map(question => question.is_active);
    return [...new Set(roles)];
  }

  applyFilters(): void {
    // Apply filters based on the values of usernameFilter and selectedRole
    // You can implement custom logic here to filter the users array
    // For simplicity, let's assume you are filtering by username and role.
    this.filteredQuestions = this.questions.filter(question =>
      question.text.toLowerCase().includes(this.questionFilter.toLowerCase()) &&
      (this.selectedType === '' || question.type === this.selectedType) &&
      (this.selectedAssign === '' || question.is_active == this.selectedAssign.toString())
    );

    // Update the users array with the filtered results
    //this.users = filteredUsers;
  }

  sort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredQuestions.sort((a, b) => {
      if (key != 'id' && key != 'is_active') {
        const valueA = a[key as keyof typeof a].toLowerCase();
        const valueB = b[key as keyof typeof b].toLowerCase();
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }
      else {
        const valueA = a[key as keyof typeof a]
        const valueB = b[key as keyof typeof b]
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      }
    });
  }

  getSortIcon(key: string): string {
    return this.sortKey === key
      ? this.sortDirection === 'asc'
        ? 'fas fa-sort-up'
        : 'fas fa-sort-down'
      : '';
  }

  addToGame(question: any, index: number) {
    this.questionService.change_question_status(question.id, "", "1").subscribe(response => {
      this.filteredQuestions[index].is_active = "1";
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].id == this.filteredQuestions[index].id) {
          this.questions[i].is_active = "1";
        }
      }
    });
  }

  removeFromGame(question: any, index: number) {
    this.questionService.change_question_status(question.id, "", "0").subscribe(response => {
      this.filteredQuestions[index].is_active = "0";
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].id == this.filteredQuestions[index].id) {
          this.questions[i].is_active = "0";
        }
      }
    });
  }
}
