import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CanActivateToken } from './guard/can-activate-token';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';


const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: ProductListComponent, canActivate: [CanActivateToken] },
  { path: '**', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
