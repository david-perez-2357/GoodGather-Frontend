import { Component } from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {NgClass, NgIf} from '@angular/common';
import {AvatarModule} from 'primeng/avatar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipsModule,
    NgClass,
    NgIf,
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
      routerLink: ['/page-index']
    },
    {
      label: 'Organizar un evento',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/organize-event']
    },
  ];

}
