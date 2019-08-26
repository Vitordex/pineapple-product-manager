import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CanActivateToken } from './guard/can-activate-token';
import { ProductsPageComponent } from './products-page/products-page.component';


const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: ProductsPageComponent, canActivate: [CanActivateToken] },
  { path: '**', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
