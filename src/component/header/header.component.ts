import {Component, Inject} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {AvatarModule} from 'primeng/avatar';
import {UserClientService} from '@/service/UserClientService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipsModule,
    AvatarModule,
  ],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
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
    {
      label: 'Iniciar sesión',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/login']
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/organize-event'],
      command: () => this.onLogout()
      //<button (click)="onLogout()" *ngIf="loginService.isLoggedIn()">Logout</button>

    }
  ];

  constructor(@Inject(UserClientService)private userClientService:UserClientService) {
  }

  onLogout(){
    console.log('Logging out...');
    this.userClientService.doLogOut();
  }

}
