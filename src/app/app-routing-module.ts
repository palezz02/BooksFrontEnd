import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import { Register } from './components/register/register';
import { UserSetting } from './components/user-setting/user-setting';
import { Home } from './components/home/home';
import { BooksPage } from './components/books-page/books-page';
import { NewBook } from './components/new-book/new-book';
import { BookDelete } from './components/book-delete/book-delete';
import { UpdateBookPopup } from './components/update-book-popup/update-book-popup';
import { ErrorPage } from './components/error-page/error-page';
import { CheckoutComponent } from './components/checkout/checkout';
import { NewCart } from './new-cart/new-cart';
import { Info } from './components/info/info';
import { AddressSetting } from './components/address-setting/address-setting';
import { authGuard } from './auth/auth-guard-guard';
import { authAdminGuard } from './auth/auth-admin-guard-guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // { path: 'raccomandation', component: BestBookCarosel }, // , canActivate:[authGuard]
  { path: 'info/:bookId', component: Info, canActivate: [authGuard] },
  { path: 'setting', component: UserSetting, canActivate: [authGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'allBooks', component: BooksPage, canActivate: [authGuard] },
  { path: 'cart', component: NewCart, canActivate: [authGuard] },
  { path: 'new', component: NewBook, canActivate: [authAdminGuard] },
  { path: 'admin/bookdelete', component: BookDelete, canActivate: [authAdminGuard] },
  { path: 'updateBook', component: UpdateBookPopup, canActivate: [authAdminGuard] },
  { path: 'error', component: ErrorPage },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'address', component: AddressSetting, canActivate: [authGuard] },
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
