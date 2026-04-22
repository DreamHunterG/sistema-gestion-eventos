import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Si se entra a la raíz -> manda al login
  { path: '**', redirectTo: 'login' } // Si se escribe cualquier cosa mal -> manda al login
];
