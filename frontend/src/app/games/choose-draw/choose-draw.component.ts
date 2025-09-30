import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';
import { SharedService } from '../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-choose-draw',
  templateUrl: './choose-draw.component.html',
  styleUrl: './choose-draw.component.css'
})
export class ChooseDrawComponent {
  drawQuestions: any;
  selectedQuestion: any;

  gameName: any;

  language: string = '';
  drawMessage: string = '';
  submitMessage: string = '';

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router, private questionService: QuestionsService, private sharedService: SharedService, private dialog: MatDialog) {
    this.gameName = localStorage.getItem("gameName");
    this.questionService.get_all_draw_questions().subscribe(response => {
      this.drawQuestions = response;
    });
  }

  onItemChange(id: any) {
    this.selectedQuestion = id;
  }

  sendDrawQuestion() {
    if (this.selectedQuestion) {
      localStorage.setItem("currentDrawQuestionId", this.selectedQuestion);
      this.sharedService.setData(this.selectedQuestion);
      this.router.navigate(['game-draw-answers']);
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Вопрос не выбран',
        },
      });
    }
  }
}
