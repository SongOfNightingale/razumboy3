import { Component } from '@angular/core';
import { AcceptDialogComponent } from '../../utilities/accept-dialog/accept-dialog.component';
import { SettingsService } from '../../services/settings.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadService } from '../../services/file-upload.service';
import { QuestionsService } from '../../services/questions.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent {

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectedText: string[] = ["", "", "", "", ""];

  selectedImage: any[] = [];
  selectedAudio: any[] = [];
  selectedVideo: any[] = [];
  image_link: string[] = ["", "", "", "", ""];
  audio_link: string[] = ["", "", "", "", ""];
  video_link: string[] = ["", "", "", "", ""];

  selectedImage2: any[] = [];
  image_link2: string[] = ["", "", "", "", ""];
  selectedAudio2: any[] = [];
  audio_link2: string[] = ["", "", "", "", ""];

  selectedComment: string[] = ["", "", "", "", ""];
  selectedType: string[] = ["", "", "", "", ""];
  questionTypes: any[] = [];
  selectedAnswer: string[] = ["", "", "", "", ""];
  answerOptions = [[{ answer: '', checked: true, points: 0 }], [{ answer: '', checked: true, points: 0 }], [{ answer: '', checked: true, points: 0 }], [{ answer: '', checked: true, points: 0 }], [{ answer: '', checked: true, points: 0 }]];

  checked: boolean[] = [false, false, false, false, false];

  time_to_answer: string[] = ['60', '60', '60', '60', '60'];

  constructor(private snackBar: MatSnackBar, private fileUploadService: FileUploadService, private router: Router, private questionsService: QuestionsService, private dialog: MatDialog) {
    this.questionsService.get_all_question_types().subscribe((response2: any) => {
        this.questionTypes = response2;
      });
  }

  handleImageChange(event: any, index: number): void {
    // Handle logo change, if needed
    this.selectedImage[index] = event.target.files[0];
    if (this.selectedImage[index]) {
      this.fileUploadService.uploadFile(this.selectedImage[index]).subscribe((response: any) => {
        this.image_link[index] = response.file_link;
      });
    }
  }

  handleImageChange2(event: any, index: number): void {
    // Handle logo change, if needed
    this.selectedImage2[index] = event.target.files[0];
    if (this.selectedImage2[index]) {
      this.fileUploadService.uploadFile(this.selectedImage2[index]).subscribe((response: any) => {
        this.image_link2[index] = response.file_link;
      });
    }
  }

  handleAudioChange(event: any, index: number): void {
    // Handle logo change, if needed
    this.selectedAudio[index] = event.target.files[0];
    if (this.selectedAudio[index]) {
      this.fileUploadService.uploadFile(this.selectedAudio[index]).subscribe((response: any) => {
        this.audio_link[index] = response.file_link;
      });
    }
  }

  handleAudioChange2(event: any, index: number): void {
    // Handle logo change, if needed
    this.selectedAudio2[index] = event.target.files[0];
    if (this.selectedAudio2[index]) {
      this.fileUploadService.uploadFile(this.selectedAudio2[index]).subscribe((response: any) => {
        this.audio_link2[index] = response.file_link;
      });
    }
  }

  handleVideoChange(event: any, index: number): void {
    // Handle logo change, if needed
    this.selectedVideo[index] = event.target.files[0];
    if (this.selectedVideo[index]) {
      this.fileUploadService.uploadFile(this.selectedVideo[index]).subscribe((response: any) => {
        this.video_link[index] = response.file_link;
      });
    }
  }

  browseLogo(): void {
    // Perform browse functionality, if needed
  }

  addOption(index: number): void {
    this.answerOptions[index].push({ answer: '', checked: false, points: 0 });
  }

  removeOption(index: any, index2: number): void {
    this.answerOptions[index2].splice(index, 1);
  }

  changeOption(index: any): void {
  }

  saveQuestion(index: number): void {
    if (this.selectedText[index] != '' && (this.selectedAnswer[index] != '' || this.answerOptions[index].length > 1)) {
      this.questionsService.add_question(this.selectedText[index], this.image_link[index], this.audio_link[index], this.video_link[index], this.selectedComment[index], this.selectedType[index], this.selectedAnswer[index], this.answerOptions[index], this.image_link2[index], this.audio_link2[index], this.checked[index], this.time_to_answer[index]).subscribe((response: any) => {
        this.snackBar.open("Question " + (index + 1).toString(), "Saved", {
          duration: 2000,
        });
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
}
