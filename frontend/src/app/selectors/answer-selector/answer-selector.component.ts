import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-answer-selector',
  templateUrl: './answer-selector.component.html',
  styleUrl: './answer-selector.component.css'
})
export class AnswerSelectorComponent implements OnChanges {
  
  question: string = '';

  @Input() screenCommand: string = 'empty';

  gameId: any;
  questionId: any;
  questionType: string = '';
  correctAnswers: any = [];
  correctAnswer: string = '';
  geolocationAnswers: any = [];
  comment: string = '';
  answerImageLink: string = '';
  answerAudioLink: string = '';
  answerVideoLink: string = '';
  contentImage: boolean = false;
  contentAudio: boolean = false;
  contentVideo: boolean = false;

  isEnabled: boolean = false;

  constructor(private questionService: QuestionsService) {
    this.showAnswer();
  }

  showAnswer() {
    this.isEnabled = false;
    this.correctAnswers = [];
    this.geolocationAnswers = [];
    this.correctAnswer = '';
    this.answerImageLink = '';
    this.answerAudioLink = '';
    this.answerVideoLink = '';
    this.contentImage = false;
    this.contentAudio = false;
    this.contentVideo = false;
    this.comment = '';
    this.questionType = '';
    if (this.screenCommand != 'empty') {
      var splitted = this.screenCommand.split(",");
      this.questionId = splitted[1];
      this.gameId = splitted[2];
      this.questionService.get_question(this.questionId).subscribe((response: any) => {
          this.question = response[0];
          this.question = this.question.replaceAll("\\n", "\n");
          this.questionType = response[4];
          this.comment = response[5];
          this.questionService.get_question_answers(this.questionId).subscribe((response2: any) => {
              for (let i = 0; i < response2.length; i++) {
                if (response2[i].is_correct == "1") {
                  if (this.questionType != 'geolocation') {
                    this.correctAnswers.push(response2[i].text);
                  }
                  else {
                    var response = { answer: response2[i].text, points: response2[i].points };
                    this.geolocationAnswers.push(response);
                    //this.correctAnswers.push(response2[i].text + " (" + response2[i].points + ")");
                  }
                }
                if (i == 0) {
                  if (response2[i].image_link != null && response2[i].image_link != '') {
                    if (response2[i].image_link.endsWith("mp4") || response2[i].image_link.endsWith("mov")) {
                      this.answerVideoLink = response2[i].image_link;
                      this.answerImageLink = '';
                      this.contentVideo = true;
                      this.contentImage = false;
                    }
                    else {
                      this.answerImageLink = response2[i].image_link;
                      this.answerVideoLink = '';
                      this.contentImage = true;
                      this.contentVideo = false;
                    }
                  }
                  if (response2[i].music_link != null && response2[i].music_link != '') {
                    this.answerAudioLink = response2[i].music_link;
                    this.contentAudio = true;
                  }
                }
              }
              this.geolocationAnswers = this.geolocationAnswers.sort((a: any, b: any) => (a.points > b.points ? -1 : 1));
              for (let i = 0; i < this.geolocationAnswers.length; i++) {
                this.correctAnswers.push(this.geolocationAnswers[i].answer + " (" + this.geolocationAnswers[i].points + ")");
              }
              this.correctAnswer = '';
              if (this.correctAnswers.length == 1) {
                this.correctAnswer = this.correctAnswers[0];
              }
              else {
                for (let i = 0; i < this.correctAnswers.length; i++) {
                  this.correctAnswer = this.correctAnswer + this.correctAnswers[i] + ", ";
                }
                this.correctAnswer = this.correctAnswer.slice(0, -2);
              }
              // timer(3000).subscribe(() => (this.isEnabled = true));
              this.isEnabled = true;
            });        
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.screenCommand = changes['screenCommand'].currentValue;
    this.showAnswer();
  }
}
