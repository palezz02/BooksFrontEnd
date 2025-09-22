import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { App } from './app';
import { BestBookCarosel } from './components/best-book-carosel/best-book-carosel';
import { authGuard } from './auth/auth-guard-guard';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import { Register } from './components/register/register';
import { Home } from './components/home/home';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // { path: 'raccomandation', component: BestBookCarosel }, // , canActivate:[authGuard]
  { path: 'info', component: BookInfo },
  // { path: 'books', component: BestSeller },
  { path: 'home', component: Home }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
