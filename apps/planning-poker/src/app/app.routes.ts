import { Routes } from '@angular/router';
import { SessionLobbyComponent } from './features/session/components/session-lobby/session-lobby.component';
import { SessionTableComponent } from './features/session/components/session-table/session-table.component';

export const routes: Routes = [
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: 'lobby', component: SessionLobbyComponent },
  { path: 'session/:id', component: SessionTableComponent },
];
