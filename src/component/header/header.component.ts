import {Component, Inject, OnInit} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {AvatarModule} from 'primeng/avatar';
import AppUser from '@/interface/AppUser';
import {AppService} from '@/service/AppService';
import {ToastModule} from 'primeng/toast';
import ApiResponse from '@/interface/ApiResponse';
import {callAPI} from '@/method/response-mehods';
import {Router} from '@angular/router';
import {UserClientService} from '@/service/UserClientService';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuModule} from 'primeng/menu';
import {PasswordModule} from 'primeng/password';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipsModule,
    AvatarModule,
    ToastModule,
    SplitButtonModule,
    MenuModule,
    PasswordModule,
  ],
  providers:[MessageService],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  constructor(private appService: AppService, private messageService: MessageService, private router: Router, private userClientService: UserClientService){
  }

  activeUser: AppUser = {} as AppUser

  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Organizar un evento',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/organize-event']
    },
  ];

  perfil: MenuItem[] = [
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => {
        this.router.navigate(['/login']);
      }
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout()
    },
  ]


  onLogout() {
    callAPI(this.userClientService.doLogOut())
      .then((response: ApiResponse) => {
        if (response.status === 200 || 201) {
          this.router.navigate(['']);
        }
      })
      .catch((error: any) => {
        console.error('Logout failed:', error);
        this.messageService.add(error.toastMessage);
      });
  }


  ngOnInit() {
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });
  }
}
