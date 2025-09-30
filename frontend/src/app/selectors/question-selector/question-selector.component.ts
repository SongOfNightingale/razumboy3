import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrl: './question-selector.component.css'
})
export class QuestionSelectorComponent implements OnChanges {

  question: string = '';
  @Input() screenCommand: string = 'empty';
  questionId: any;
  gameId: any;

  questionAnswers: any[] = [];
  questionType: string = '';

  constructor(private questionService: QuestionsService) {
    //this.showQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    this.showQuestion();
  }

  showQuestion() {
    //this.questionAnswers = [];

    var splitted = this.screenCommand.split(",");
    this.questionId = splitted[1];
    this.gameId = splitted[2];
    this.questionService.get_question(this.questionId).subscribe((response: any) => {
      this.question = response[0];
      this.question = this.question.replaceAll("\\n", "\n");
      this.questionType = response[4];
      if (this.questionType == 'radio' || this.questionType == 'checkbox' || this.questionType == 'geolocation') {
        this.questionService.get_question_answers(this.questionId).subscribe((response3: any) => {
          this.questionAnswers = response3;
        });
      }
      else {
        this.questionAnswers = [];
      }
    });
  }

}
