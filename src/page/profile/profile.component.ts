import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';
import {AvatarModule} from "primeng/avatar";
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {FormsModule} from '@angular/forms';
import Event from '@/interface/Event';
import Ticket from '@/interface/Ticket';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarModule,
    TabViewModule,
    TagModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit, OnDestroy {
  usersBoughtTickets: Ticket[] = [
    {
      id: 1,
      price: 22.2,
      amount: 3,
      purchaseDate: "10-10-2024",
      idEvent: 1,
      idUser: 1
    },

    {
      id: 1,
      price: 22.2,
      amount: 3,
      purchaseDate: "10-10-2024",
      idEvent: 1,
      idUser: 1
    }
  ];

  events: Event[] = [

  ];

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    putDefaultBackground(this.renderer);
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }

  getEvent(idEvent: number): Event {
    const event = this.events.find(event => event.id === idEvent);
    return event ?? {} as Event;
  }
}
