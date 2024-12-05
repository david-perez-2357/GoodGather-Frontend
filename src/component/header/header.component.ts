import {Component, OnInit} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {NgClass, NgIf} from '@angular/common';
import {AvatarModule} from 'primeng/avatar';
import AppUser from '@/interface/AppUser';
import {AppService} from '@/service/AppService';

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
export class HeaderComponent implements OnInit {
  constructor(private appService: AppService) {
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

  ngOnInit() {
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

}
