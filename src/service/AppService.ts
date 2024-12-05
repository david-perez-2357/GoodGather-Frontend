import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import ApiResponse from '@/interface/ApiResponse';
import AppUser from '@/interface/AppUser';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private triggerFunctionShowError = new Subject<ApiResponse>();
  triggerFunction$ = this.triggerFunctionShowError.asObservable();

  private appUserSubject = new BehaviorSubject<AppUser>({} as AppUser); // Estado inicial vacío
  appUser$ = this.appUserSubject.asObservable(); // Exponemos como Observable para suscribirse

  showWErrorInApp(apiResponse: ApiResponse): void {
    this.triggerFunctionShowError.next(apiResponse);
  }

  setCurrentUser(appUser: AppUser): void {
    this.appUserSubject.next(appUser); // Actualiza el BehaviorSubject
  }

  getCurrentUser(): AppUser {
    return this.appUserSubject.getValue(); // Obtiene el valor actual
  }
}
