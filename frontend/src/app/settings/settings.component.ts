import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  o_number: number = 0;
  language: string = 'Русский';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }


  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.loadNumbers();
  }

  loadNumbers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.settingsService.get_numbers().subscribe({
      next: (data: any) => {
        console.log(data[0])
        this.o_number = data[0].o_number || 0;
        this.language = data[0].language == 'ru' ? 'Русский' : 'Узбекский';
        console.log(this.language)
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading settings:', error);
        this.errorMessage = 'Ошибка при загрузке настроек';
        this.isLoading = false;
      }
    });
  }

  saveSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.settingsService.update_numbers(this.o_number, this.language).subscribe({
      next: () => {
        this.successMessage = 'Настройки успешно сохранены';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error saving settings:', error);
        this.errorMessage = 'Ошибка при сохранении настроек';
        this.isLoading = false;
      }
    });
  }
}