import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CanActivateToken } from './guard/can-activate-token';
import { ProductListComponent } from './product-list/product-list.component';
import { IconsModule } from './icons/icons.module';
import { ProductsPageComponent } from './products-page/products-page.component';
import { ProductComponent } from './product/product.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProductListComponent,
    ProductsPageComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    IconsModule,
    ReactiveFormsModule
  ],
  providers: [
    CanActivateToken
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
