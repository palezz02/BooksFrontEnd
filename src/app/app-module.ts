import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Login } from './components/login/login';
import { BestBookCarosel } from './components/best-book-carosel/best-book-carosel';
import { CardBook } from './components/card-book/card-book';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { Register } from './components/register/register';
import { PublisherPopup } from './components/publisher-popup/publisher-popup';
import { UserSetting } from './components/user-setting/user-setting';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';
import { MatDivider } from '@angular/material/divider';
import { AuthorPopup } from './components/author-popup/author-popup';
import { BooksPage } from './components/books-page/books-page';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CartInfo } from './components/cart/cart';

@NgModule({
  declarations: [App, Navbar, Login, CardBook, BookInfo, BestBookCarosel, BestSeller, Register, UserSetting, Footer, Home, BooksPage, CartInfo],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatGridListModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,

    PublisherPopup,
    MatDivider,
    AuthorPopup,
    MatPaginatorModule
],
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App],
})
export class AppModule {}
