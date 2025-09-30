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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Login } from './components/login/login';
import { BestBookCarosel } from './components/best-book-carosel/best-book-carosel';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardBook } from './components/card-book/card-book';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { BookInfo } from './components/book-info/book-info';
import { BestSeller } from './components/best-seller/best-seller';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Register } from './components/register/register';
import { PublisherPopup } from './components/publisher-popup/publisher-popup';
import { UserSetting } from './components/user-setting/user-setting';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';
import { MatDivider } from '@angular/material/divider';
import { AuthorPopup } from './components/author-popup/author-popup';
import { BooksPage } from './components/books-page/books-page';
import { CartInfo } from './components/cart/cart';
import { NewBook } from './components/new-book/new-book';
import { UserPage } from './components/user-page/user-page';
import { BookDelete } from './components/book-delete/book-delete';
import { ErrorPage } from './components/error-page/error-page';
import { Reviews } from './components/reviews/reviews';
import { Info } from './components/info/info';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { DeleteAccountConfirmDialog } from './components/delete-account-confirm-dialog/delete-account-confirm-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CheckoutComponent } from './components/checkout/checkout';
import { jwtInterceptor } from './Utils/JwtIterceptor';
@NgModule({
  declarations: [
    App,
    Navbar,
    Login,
    CardBook,
    BookInfo,
    BestBookCarosel,
    BestSeller,
    Register,
    UserSetting,
    Footer,
    Home,
    BooksPage,
    CartInfo,
    NewBook,
    BookDelete,
    UserPage,
    ErrorPage,
    Reviews,
    Info,
    DeleteAccountConfirmDialog,
    CheckoutComponent,
  ],
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
    ReactiveFormsModule,
    MatCard,
    PublisherPopup,
    MatDivider,
    AuthorPopup,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App],
})
export class AppModule {}
