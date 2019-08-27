import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public setToken(token: string) {
    window.sessionStorage.setItem('token', token);
  }

  public getToken(): string {
    return window.sessionStorage.getItem('token');
  }

  public removeToken() {
    window.sessionStorage.removeItem('token');
  }
}
