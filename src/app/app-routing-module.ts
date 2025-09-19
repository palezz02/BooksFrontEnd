import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { App } from './app';
import { Home } from './components/home/home';
import { authGuard } from './auth/auth-guard-guard';
import { BookInfo } from './components/book-info/book-info';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'home', component: Home }, // , canActivate:[authGuard]
  { path: 'info', component: BookInfo }, // , canActivate:[authGuard]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
