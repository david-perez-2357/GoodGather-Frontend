import {Component, Inject, OnInit} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {AvatarModule} from 'primeng/avatar';
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
export class HeaderComponent implements OnInit{
  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/page-index']
    },
    {
      label: 'Organizar un evento',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/organize-event']
    },


  ];

  perfil: MenuItem[] | undefined;



  constructor(@Inject(UserClientService)private userClientService:UserClientService, private router: Router,
              private messageService: MessageService) {
  }

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

  ngOnInit(): void{
    this.perfil = [
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

  }


  }
