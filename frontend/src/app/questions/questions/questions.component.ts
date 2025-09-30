import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';
import { SharedService } from '../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../utilities/dialog/dialog.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  questions = [
    { id: '1', text: 'Question 1', category: 'Неугадайка', type: 'Textarea', draw: '0', created: '2023-11-20 17:59:09', updated: '2023-12-19 21:53:34', used: '0' },
  ];

  sortKey: string = '';
  sortDirection: string = 'asc';

  questionFilter: string = '';
  selectedType: string = '';
  uniqueTypes: string[] = [];

  filteredQuestions = [
    { id: '1', text: 'Question 1', category: 'Неугадайка', type: 'Textarea', draw: '0', created: '2023-11-20 17:59:09', updated: '2023-12-19 21:53:34', used: '0' },
  ];

  language: string = '';
  questionsMessage: string = '';

  constructor(private router: Router, private questionsService: QuestionsService, private sharedService: SharedService, private dialog: MatDialog) {
    this.questionsService.get_all_questions().subscribe((response: any) => {
      this.questions = response;
      this.questions.reverse();
      this.filteredQuestions = this.questions;
      this.uniqueTypes = this.getUniqueTypes();
    });
  }

  getUniqueTypes(): string[] {
    const roles = this.questions.map(question => question.type);
    return [...new Set(roles)];
  }

  applyFilters(): void {
    // Apply filters based on the values of usernameFilter and selectedRole
    // You can implement custom logic here to filter the users array
    // For simplicity, let's assume you are filtering by username and role.
    this.filteredQuestions = this.questions.filter(question =>
      question.text.toLowerCase().includes(this.questionFilter.toLowerCase()) &&
      (this.selectedType === '' || question.type === this.selectedType)
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
      if (key != 'id') {
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
        const valueA = a[key as keyof typeof a];
        const valueB = b[key as keyof typeof b];

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

  editQuestion(id: any) {
    // Add logic to handle editing user
    // this.sharedService.setData(question);
    // window.open('/update-question', '_blank');
    const params = {
      id: id
    };

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/update-question'], { queryParams: params })
    );

    window.open(url, '_blank');

    //this.router.navigate(['/update-question', id]);
  }

  deleteQuestion(id: any) {
    // Add logic to handle deleting user
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: 'Вы уверены, что хотите удалить вопрос?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.questionsService.delete_question(id).subscribe(response => {
          window.location.reload();
        });
      } else {

      }
    });
  }
}
