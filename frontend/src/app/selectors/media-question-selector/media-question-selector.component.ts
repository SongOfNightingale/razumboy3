import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-media-question-selector',
  templateUrl: './media-question-selector.component.html',
  styleUrl: './media-question-selector.component.css'
})
export class MediaQuestionSelectorComponent implements OnChanges {

  question: string = '';
  @Input() screenCommand: string = 'empty';
  questionId: any;
  questionImageLink: string = '';
  questionAudioLink: string = '';
  questionVideoLink: string = '';
  questionType: string = '';

  contentImage: boolean = false;
  contentAudio: boolean = false;
  contentVideo: boolean = false;
  onlyAudio: boolean = false;

  gameId: any;

  questionAnswers: any[] = [];

  constructor(private questionService: QuestionsService) {
    //this.showQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    this.showQuestion();
  }

  showQuestion() {
    this.contentImage = false;
    this.contentAudio = false;
    this.contentVideo = false;
    this.onlyAudio = false;
    this.questionImageLink = '';
    this.questionAudioLink = '';
    this.questionVideoLink = '';
    //this.questionAnswers = [];

    var splitted = this.screenCommand.split(",");
    this.questionId = splitted[1];
    this.gameId = splitted[2];
    this.questionService.get_question(this.questionId).subscribe((response: any) => {
      this.question = response[0];
      this.question = this.question.replaceAll("\\n", "\n");
      this.questionType = response[4];
      if (response[1] != null && response[1] != '') {
        this.questionImageLink = response[1];
        this.contentImage = true;
      }
      else {
        this.questionImageLink = '';
        this.contentImage = false;
      }
      if (response[2] != null && response[2] != '') {
        this.questionAudioLink = response[2];
        this.contentAudio = true;
      }
      else {
        this.questionAudioLink = '';
        this.contentAudio = false;
      }
      if (response[3] != null && response[3] != '') {
        this.questionVideoLink = response[3];
        this.contentVideo = true;
      }
      else {
        this.questionVideoLink = '';
        this.contentVideo = false;
      }
      if (this.contentAudio && !this.contentImage && !this.contentVideo) {
        this.onlyAudio = true;
      }
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
