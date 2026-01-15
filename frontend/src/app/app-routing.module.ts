import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AddPlayersComponent } from './games/add-players/add-players.component';
import { AddQuestionsComponent } from './games/add-questions/add-questions.component';
import { CreateBattlefieldComponent } from './games/create-battlefield/create-battlefield.component';
import { CreateGameComponent } from './games/create-game/create-game.component';
import { CreateQueueComponent } from './games/create-queue/create-queue.component';
import { GamePanelComponent } from './games/game-panel/game-panel.component';
import { GamePenaltiesComponent } from './games/game-penalties/game-penalties.component';
import { GameTableComponent } from './games/game-table/game-table.component';
import { GamesComponent } from './games/games/games.component';
import { UpdateGameComponent } from './games/update-game/update-game.component';
import { ChooseDrawComponent } from './games/choose-draw/choose-draw.component';
import { GameDrawAnswersComponent } from './games/game-draw-answers/game-draw-answers.component';
import { ShowBattlefieldComponent } from './games/show-battlefield/show-battlefield.component';
import { GameAnswersComponent } from './games/game-answers/game-answers.component';
import { GamePredictionsComponent } from './games/game-predictions/game-predictions.component';
import { GameUserAnswersComponent } from './games/game-user-answers/game-user-answers.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminMainComponent },
  { path: 'settings', component: SettingsComponent },

  { path: 'player', component: PlayerComponent },
  { path: 'host', component: HostComponent },
  { path: 'tv', component: TvComponent },

  { path: 'create-user', component: CreateUserComponent },
  { path: 'users', component: UsersComponent },
  { path: 'update-user', component: UpdateUserComponent },

  { path: 'create-question', component: CreateQuestionComponent },
  { path: 'questions', component: QuestionsComponent },
  { path: 'update-question', component: UpdateQuestionComponent },

  { path: 'add-players', component: AddPlayersComponent },
  { path: 'add-questions', component: AddQuestionsComponent },
  { path: 'create-battlefield', component: CreateBattlefieldComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'create-queue', component: CreateQueueComponent },
  { path: 'game-panel', component: GamePanelComponent },
  { path: 'game-penalties', component: GamePenaltiesComponent },
  { path: 'game-table', component: GameTableComponent },
  { path: 'games', component: GamesComponent },
  { path: 'update-game', component: UpdateGameComponent },
  { path: 'choose-draw', component: ChooseDrawComponent },
  { path: 'game-draw-answers', component: GameDrawAnswersComponent },
  { path: 'game-answers', component: GameAnswersComponent },
  { path: 'game-predictions', component: GamePredictionsComponent },
  { path: 'game-user-answers', component: GameUserAnswersComponent },

  { path: 'show-battlefield', component: ShowBattlefieldComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
