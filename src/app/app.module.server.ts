import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { App } from './app';
import { AppModule } from './app-module';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations:[],
  imports: [
    AppModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App],
})
export class AppServerModule {}
