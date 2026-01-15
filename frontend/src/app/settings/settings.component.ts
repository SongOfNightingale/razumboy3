import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  language: string = 'Русский';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Battlefield
  fieldRows: number = 10;
  fieldColumns: number = 10;

  // Regular ships
  ships6: number = 0;
  ships5: number = 0;
  ships4: number = 0;
  ships3: number = 0;
  ships2: number = 0;
  ships1: number = 0;

  // Special ships
  shipSurprise: number = 0;
  shipDoubleBarrel: number = 0;
  shipReverse: number = 0;
  shipMove5: number = 0;
  shipMove3: number = 0;
  shipKaraoke: number = 0;
  shipCastling: number = 0;
  shipBonus5: number = 0;
  shipBonus3: number = 0;
  shipBonus1: number = 0;
  shipPenalty5: number = 0;
  shipPenalty3: number = 0;
  shipPenalty1: number = 0;
  shipSong: number = 0;
  shipSonar: number = 0;
  shipEvenBonus: number = 0;
  shipOddBonus: number = 0;
  shipSpecialTour: number = 0;
  shipJackpot: number = 0;
  shipTax: number = 0;

  // Points settings
  pointsSong: number = 0;
  pointsSpecialTour: number = 0;
  taxPercent: number = 0;
  pointsPrediction: number = 0;
  penaltyMine: number = 0;

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
        const settings = data[0];
        this.language = settings.language;
        this.fieldRows = settings.fieldRows || 10;
        this.fieldColumns = settings.fieldColumns || 10;
        this.ships6 = settings.ships6 || 0;
        this.ships5 = settings.ships5 || 0;
        this.ships4 = settings.ships4 || 0;
        this.ships3 = settings.ships3 || 0;
        this.ships2 = settings.ships2 || 0;
        this.ships1 = settings.ships1 || 0;
        this.shipSurprise = settings.shipSurprise || 0;
        this.shipDoubleBarrel = settings.shipDoubleBarrel || 0;
        this.shipReverse = settings.shipReverse || 0;
        this.shipMove5 = settings.shipMove5 || 0;
        this.shipMove3 = settings.shipMove3 || 0;
        this.shipKaraoke = settings.shipKaraoke || 0;
        this.shipCastling = settings.shipCastling || 0;
        this.shipBonus5 = settings.shipBonus5 || 0;
        this.shipBonus3 = settings.shipBonus3 || 0;
        this.shipBonus1 = settings.shipBonus1 || 0;
        this.shipPenalty5 = settings.shipPenalty5 || 0;
        this.shipPenalty3 = settings.shipPenalty3 || 0;
        this.shipPenalty1 = settings.shipPenalty1 || 0;
        this.shipSong = settings.shipSong || 0;
        this.shipSonar = settings.shipSonar || 0;
        this.shipEvenBonus = settings.shipEvenBonus || 0;
        this.shipOddBonus = settings.shipOddBonus || 0;
        this.shipSpecialTour = settings.shipSpecialTour || 0;
        this.shipJackpot = settings.shipJackpot || 0;
        this.shipTax = settings.shipTax || 0;
        this.pointsSong = settings.pointsSong || 0;
        this.pointsSpecialTour = settings.pointsSpecialTour || 0;
        this.taxPercent = settings.taxPercent || 0;
        this.pointsPrediction = settings.pointsPrediction || 0;
        this.penaltyMine = settings.penaltyMine || 0;
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
    
    const settingsData = {
      language: this.language,
      fieldRows: this.fieldRows,
      fieldColumns: this.fieldColumns,
      ships6: this.ships6,
      ships5: this.ships5,
      ships4: this.ships4,
      ships3: this.ships3,
      ships2: this.ships2,
      ships1: this.ships1,
      shipSurprise: this.shipSurprise,
      shipDoubleBarrel: this.shipDoubleBarrel,
      shipReverse: this.shipReverse,
      shipMove5: this.shipMove5,
      shipMove3: this.shipMove3,
      shipKaraoke: this.shipKaraoke,
      shipCastling: this.shipCastling,
      shipBonus5: this.shipBonus5,
      shipBonus3: this.shipBonus3,
      shipBonus1: this.shipBonus1,
      shipPenalty5: this.shipPenalty5,
      shipPenalty3: this.shipPenalty3,
      shipPenalty1: this.shipPenalty1,
      shipSong: this.shipSong,
      shipSonar: this.shipSonar,
      shipEvenBonus: this.shipEvenBonus,
      shipOddBonus: this.shipOddBonus,
      shipSpecialTour: this.shipSpecialTour,
      shipJackpot: this.shipJackpot,
      shipTax: this.shipTax,
      pointsSong: this.pointsSong,
      pointsSpecialTour: this.pointsSpecialTour,
      taxPercent: this.taxPercent,
      pointsPrediction: this.pointsPrediction,
      penaltyMine: this.penaltyMine
    };

    this.settingsService.update_numbers(settingsData).subscribe({
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