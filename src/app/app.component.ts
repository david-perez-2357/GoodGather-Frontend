import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from '@/component/header/header.component';
import {ServerErrorComponent} from '@/component/server-error/server-error.component';
import ApiResponse from '@/interface/ApiResponse';
import {NgIf} from '@angular/common';
import {AppService} from '@/service/AppService';
import AppUser from '@/interface/AppUser';
import {AppUserMethods} from '@/method/app-user-methods';

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
  user: AppUser = {} as AppUser;
  status: number = 500;


  constructor(private appService: AppService, private appUserMethods: AppUserMethods, private router: Router) {}

  showError(apiResponse: ApiResponse): void {
    this.error = true;

    if (apiResponse?.toastMessage?.summary) {
      this.errorText = apiResponse.toastMessage.summary;
    }

    if (apiResponse.status == 403 && !this.user.id) {
      this.status = 403;
    }else if (apiResponse.status == 403) {
      this.errorText = 'Ha ocurrido un error en el servidor';
    }
  }

  setCurrentUser(appUser: AppUser): void {
    this.appService.setCurrentUser(appUser);
  }

  ngOnInit() {
    this.appService.triggerFunction$.subscribe((apiResponse) => {
      this.showError(apiResponse);
    });

    this.appUserMethods.getCurrentUser().then((response: ApiResponse) => {
      if (response.status === 200) {
        this.user = response.data;
        this.setCurrentUser(this.user);
      }else if (this.router.url !== '/login' && this.router.url !== '/register') {
        this.showError(response);
      }
    });
  }

  setError($event: boolean) {
    this.error = $event;
    console.log('error', this.error);
  }
}
