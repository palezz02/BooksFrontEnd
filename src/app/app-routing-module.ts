import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import { Register } from './components/register/register';
import { UserSetting } from './components/user-setting/user-setting';
import { Home } from './components/home/home';
import { BooksPage } from './components/books-page/books-page';
import { CartInfo } from './components/cart/cart';
import { NewBook } from './components/new-book/new-book';
import { BookDelete } from './components/book-delete/book-delete';
import { ErrorPage } from './components/error-page/error-page';
import { CheckoutComponent } from './components/checkout/checkout';
import { NewCart } from './new-cart/new-cart';
import { Info } from './components/info/info';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // { path: 'raccomandation', component: BestBookCarosel }, // , canActivate:[authGuard]
  { path: 'info/:bookId', component: Info },
  { path: 'books', component: BestSeller },
  { path: 'setting', component: UserSetting },
  { path: 'home', component: Home },
  { path: 'allBooks', component: BooksPage },
  { path: 'cart', component: NewCart },
  { path: 'new', component: NewBook },
  { path: 'bookdelete', component: BookDelete },
  { path: 'error', component: ErrorPage },
  { path: 'checkout', component: CheckoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
