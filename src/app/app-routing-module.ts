import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { App } from './app';
import { BestBookCarosel } from './components/best-book-carosel/best-book-carosel';
import { authGuard } from './auth/auth-guard-guard';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import { CartInfo } from './components/cart/cart';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'raccomandation', component: BestBookCarosel }, // , canActivate:[authGuard]
  { path: 'info', component: BookInfo },
  { path: 'books', component: BestSeller },
  { path: 'cart', component: CartInfo },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
