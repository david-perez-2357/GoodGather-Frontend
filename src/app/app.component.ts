import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from '../component/header/header.component';
import {ServerErrorComponent} from '../component/server-error/server-error.component';
import ApiResponse from '../interface/ApiResponse';
import {NgIf} from '@angular/common';
import {AppService} from '../service/AppService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ServerErrorComponent, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'GoodGather';
  error = false;
  errorText: string = 'Ha ocurrido un error en el servidor';

  constructor(private appService: AppService) {}

  showError(apiResponse: ApiResponse): void {
    this.error = true;

    if (apiResponse?.toastMessage?.summary) {
      this.errorText = apiResponse.toastMessage.summary;
    }

    if (apiResponse.status == 403) {
      window.location.href = '/login';
    }
  }

  ngOnInit() {
    this.appService.triggerFunction$.subscribe((apiResponse) => {
      this.showError(apiResponse);
    });
  }
}
