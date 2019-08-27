import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) {}

  public login(email: string, password: string) {
    const body = {email, password};
    return this.client.post(`${ConfigService.apiEndPoint}/users/login`, body).toPromise();
  }

  public register(email: string, password) {
    const body = {email, password};
    return this.client.post(`${ConfigService.apiEndPoint}/users/`, body).toPromise();
  }
}
