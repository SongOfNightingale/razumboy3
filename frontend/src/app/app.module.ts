import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { SettingsComponent } from './settings/settings.component';
import { PlayerComponent } from './other/player/player.component';
import { HostComponent } from './other/host/host.component';
import { TvComponent } from './other/tv/tv.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { UsersComponent } from './users/users/users.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { CreateQuestionComponent } from './questions/create-question/create-question.component';
import { QuestionsComponent } from './questions/questions/questions.component';
import { UpdateQuestionComponent } from './questions/update-question/update-question.component';
import { CreateGameComponent } from './games/create-game/create-game.component';
import { GamesComponent } from './games/games/games.component';
import { UpdateGameComponent } from './games/update-game/update-game.component';
import { GamePanelComponent } from './games/game-panel/game-panel.component';
import { AddQuestionsComponent } from './games/add-questions/add-questions.component';
import { AddPlayersComponent } from './games/add-players/add-players.component';
import { GamePenaltiesComponent } from './games/game-penalties/game-penalties.component';
import { CreateBattlefieldComponent } from './games/create-battlefield/create-battlefield.component';
import { CreateQueueComponent } from './games/create-queue/create-queue.component';
import { GameTableComponent } from './games/game-table/game-table.component';
import { AcceptDialogComponent } from './utilities/accept-dialog/accept-dialog.component';
import { SidebarComponent } from './utilities/sidebar/sidebar.component';
import { DialogComponent } from './utilities/dialog/dialog.component';
import { SidebarGameComponent } from './utilities/sidebar-game/sidebar-game.component';
import { ChooseDrawComponent } from './games/choose-draw/choose-draw.component';
import { GameDrawAnswersComponent } from './games/game-draw-answers/game-draw-answers.component';
import { LogoComponent } from './selectors/logo/logo.component';
import { QuestionSelectorComponent } from './selectors/question-selector/question-selector.component';
import { MediaQuestionSelectorComponent } from './selectors/media-question-selector/media-question-selector.component';
import { AnswerSelectorComponent } from './selectors/answer-selector/answer-selector.component';
import { UserAnswerSelectorComponent } from './selectors/user-answer-selector/user-answer-selector.component';
import { ScoreSelectorComponent } from './selectors/score-selector/score-selector.component';
import { QuestionPlayerSelectorComponent } from './selectors/question-player-selector/question-player-selector.component';
import { MediaQuestionPlayerSelectorComponent } from './selectors/media-question-player-selector/media-question-player-selector.component';
import { BattlefieldSelectorComponent } from './selectors/battlefield-selector/battlefield-selector.component';
import { ShowBattlefieldComponent } from './games/show-battlefield/show-battlefield.component';
import { GameAnswersComponent } from './games/game-answers/game-answers.component';
import { GameHeaderComponent } from './utilities/game-header/game-header.component';
import { GameFooterComponent } from './utilities/game-footer/game-footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PlayerBattlefieldSelectorComponent } from './selectors/player-battlefield-selector/player-battlefield-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminMainComponent,
    SettingsComponent,
    PlayerComponent,
    HostComponent,
    TvComponent,
    CreateUserComponent,
    UsersComponent,
    UpdateUserComponent,
    CreateQuestionComponent,
    QuestionsComponent,
    UpdateQuestionComponent,
    CreateGameComponent,
    GamesComponent,
    UpdateGameComponent,
    GamePanelComponent,
    AddQuestionsComponent,
    AddPlayersComponent,
    GamePenaltiesComponent,
    CreateBattlefieldComponent,
    CreateQueueComponent,
    GameTableComponent,
    AcceptDialogComponent,
    SidebarComponent,
    DialogComponent,
    SidebarGameComponent,
    ChooseDrawComponent,
    GameDrawAnswersComponent,
    LogoComponent,
    QuestionSelectorComponent,
    MediaQuestionSelectorComponent,
    AnswerSelectorComponent,
    UserAnswerSelectorComponent,
    ScoreSelectorComponent,
    QuestionPlayerSelectorComponent,
    MediaQuestionPlayerSelectorComponent,
    BattlefieldSelectorComponent,
    ShowBattlefieldComponent,
    GameAnswersComponent,
    GameHeaderComponent,
    GameFooterComponent,
    PlayerBattlefieldSelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
