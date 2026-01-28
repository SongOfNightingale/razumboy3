import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionsService } from '../../services/questions.service';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrl: './update-question.component.css'
})
export class UpdateQuestionComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectedText: string = '';

  selectedImage: any;
  selectedAudio: any;
  selectedVideo: any;
  image_link: string = '';
  audio_link: string = '';
  video_link: string = '';

  selectedImage2: any;
  image_link2: string = '';
  selectedAudio2: any;
  audio_link2: string = '';

  selectedComment: string = '';
  selectedType: string = '';
  questionTypes: any[] = [];
  selectedAnswer: string = '';
  answerOptions = [{ answer: '', checked: true, points: 0 }];

  questionId: string = '';
  answers: any[] = [];

  typeId: string = '';

  language: string = '';
  answerImageVideoMessage: string = '';
  answerMusicMessage: string = '';
  questionsMessage: string = '';

  checked = false;

  time_to_answer: string = '60';

  //subscription: any;

  constructor(private route: ActivatedRoute, private fileUploadService: FileUploadService, private router: Router, private dialog: MatDialog, private questionsService: QuestionsService) {
    this.questionsService.get_all_question_types().subscribe((response2: any) => {
      this.questionTypes = response2;
      //this.subscription = this.sharedService.getData().subscribe(data => {
      this.questionId = this.route.snapshot.queryParamMap.get('id') || '';
      this.questionsService.get_question(this.questionId).subscribe((response4: any) => {
        this.selectedText = response4[0];
        this.selectedComment = response4[5];
        this.selectedType = response4[4];
        this.image_link = response4[1];
        this.audio_link = response4[2];
        this.video_link = response4[3];
        this.time_to_answer = response4[7];
        for (let i = 0; i < this.questionTypes.length; i++) {
          if (this.questionTypes[i].name == this.selectedType) {
            this.typeId = this.questionTypes[i].id;
          }
        }
        this.questionsService.get_question_answers(this.questionId).subscribe((response3: any) => {
          this.answers = response3;
          if (this.answers[0].image_link) {
            this.image_link2 = this.answers[0].image_link;
          }
          if (this.answers[0].music_link) {
            this.audio_link2 = this.answers[0].music_link;
          }
          if (this.typeId == '1' && this.answers.length > 0) {
            this.selectedAnswer = this.answers[0].text;
          }
          else if ((this.typeId == '2' || this.typeId == '3') && this.answers.length > 0) {
            this.answerOptions = [];
            for (let i = 0; i < this.answers.length; i++) {
              this.answerOptions.push({ answer: this.answers[i].text, checked: Boolean(this.answers[i].is_correct), points: 0 })
            }
          }
          else if (this.typeId == '4' && this.answers.length > 0) {
            this.answerOptions = [];
            for (let i = 0; i < this.answers.length; i++) {
              this.answerOptions.push({ answer: this.answers[i].text, checked: Boolean(this.answers[i].is_correct), points: this.answers[i].points })
            }
          }
        });
      });
      //});
    });
  }

  changeTypeId() {
    for (let i = 0; i < this.questionTypes.length; i++) {
      if (this.questionTypes[i].name == this.selectedType) {
        this.typeId = this.questionTypes[i].id;
      }
    }
  }

  handleImageChange(event: any): void {
    // Handle logo change, if needed
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.fileUploadService.uploadFile(this.selectedImage).subscribe((response: any) => {
        this.image_link = response.file_link;
      });
    }
  }

  handleImageChange2(event: any): void {
    // Handle logo change, if needed
    this.selectedImage2 = event.target.files[0];
    if (this.selectedImage2) {
      this.fileUploadService.uploadFile(this.selectedImage2).subscribe((response: any) => {
        this.image_link2 = response.file_link;
      });
    }
  }

  handleAudioChange(event: any): void {
    // Handle logo change, if needed
    this.selectedAudio = event.target.files[0];
    if (this.selectedAudio) {
      this.fileUploadService.uploadFile(this.selectedAudio).subscribe((response: any) => {
        this.audio_link = response.file_link;
      });
    }
  }

  handleAudioChange2(event: any): void {
    // Handle logo change, if needed
    this.selectedAudio2 = event.target.files[0];
    if (this.selectedAudio2) {
      this.fileUploadService.uploadFile(this.selectedAudio2).subscribe((response: any) => {
        this.audio_link2 = response.file_link;
      });
    }
  }

  handleVideoChange(event: any): void {
    // Handle logo change, if needed
    this.selectedVideo = event.target.files[0];
    if (this.selectedVideo) {
      this.fileUploadService.uploadFile(this.selectedVideo).subscribe((response: any) => {
        this.video_link = response.file_link;
      });
    }
  }

  browseLogo(): void {
    // Perform browse functionality, if needed
  }

  addOption(): void {
    this.answerOptions.push({ answer: '', checked: false, points: 0 });
  }

  removeOption(index: any): void {
    this.answerOptions.splice(index, 1);
  }

  changeOption(index: any): void {
  }


  updateQuestion(): void {
    if (this.selectedText != '' && (this.selectedAnswer != '' || this.answerOptions.length > 1)) {
      this.questionsService.update_question(this.questionId, this.selectedText, this.image_link, this.audio_link, this.video_link, this.selectedComment, this.typeId, this.selectedAnswer, this.answerOptions, this.image_link2, this.audio_link2, this.checked, this.time_to_answer).subscribe((response: any) => {
        //this.subscription.unsubscribe();
        this.router.navigate(['/questions']);
      });
    }
    else {
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          content: 'Отсутствует текст вопроса, категория, комментарий или ответ',
        },
      });
    }
  }

  eraseMedia() {
    this.selectedImage = null;
    this.selectedAudio = null;
    this.selectedVideo = null;
    this.selectedImage2 = null;
    this.selectedAudio2 = null;

    this.image_link = '';
    this.audio_link = '';
    this.video_link = '';
    this.image_link2 = '';
    this.audio_link2 = '';
  }

  erase1() {
    this.selectedImage = null;
    this.image_link = '';
  }

  erase2() {
    this.selectedAudio = null;
    this.audio_link = '';
  }

  erase3() {
    this.selectedVideo = null;
    this.video_link = '';
  }

  erase4() {
    this.selectedImage2 = null;
    this.image_link2 = '';
  }

  erase5() {
    this.selectedAudio2 = null;
    this.audio_link2 = '';
  }
}
