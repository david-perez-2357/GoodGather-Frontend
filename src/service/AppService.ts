import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import ApiResponse from '@/interface/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private triggerFunctionShowError = new Subject<ApiResponse>();
  triggerFunction$ = this.triggerFunctionShowError.asObservable();

  showWErrorInApp(apiResponse: ApiResponse): void {
    this.triggerFunctionShowError.next(apiResponse);
  }
}
