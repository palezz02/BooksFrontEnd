import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { App } from './app';
import { Home } from './components/home/home';
import { authGuard } from './auth/auth-guard-guard';
import { BestSeller } from './best-seller/best-seller';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'home', component: Home }, // , canActivate:[authGuard]
  { path: 'books', component: BestSeller }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
