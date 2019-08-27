import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public static apiEndPoint = 'http://localhost:4200/api';
}
