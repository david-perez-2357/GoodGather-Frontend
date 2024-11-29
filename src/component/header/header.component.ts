import {Component, Inject} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {AvatarModule} from 'primeng/avatar';
import {UserClientService} from '@/service/UserClientService';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '@/interface/ApiResponse';
import {Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipsModule,
    AvatarModule,
    ToastModule,
  ],
  providers:[MessageService],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
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

  constructor() {
  }







}
