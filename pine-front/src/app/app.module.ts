import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CanActivateToken } from './guard/can-activate-token';
import { ProductListComponent } from './product-list/product-list.component';
import { IconsModule } from './icons/icons.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    IconsModule
  ],
  providers: [
    CanActivateToken
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
