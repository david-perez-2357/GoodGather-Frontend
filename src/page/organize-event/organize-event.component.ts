import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import moment from 'moment';
import Event from '../../interface/Event';
import {putFormBackground, removeFormBackground} from '../../method/background-methods';
import {NgIf} from '@angular/common';
import {InputNumberModule} from 'primeng/inputnumber';

@Component({
  selector: 'app-organize-event',
  standalone: true,
  imports: [
    StepperModule,
    Button,
    InputTextareaModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    NgIf,
    InputNumberModule
  ],
  templateUrl: './organize-event.component.html',
  styles: ``
})
export class OrganizeEventComponent implements OnInit, OnDestroy {
  causes: any[] | undefined;
  countries: any[] | undefined;
  province: any[] | undefined;
  startDateDate: string = '';
  endDateDate: string = '';
  startDateHour: string = '';
  endDateHour: string = '';

  event: Event = {
    id: 0,
    name: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    capacity: 0,
    boughtTickets: 0,
    address: '',
    province: '',
    country: '',
    ticketPrice: 0,
    deleted: 0,
    idOwner: 0,
    idCause: 0
  }
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    putFormBackground(this.renderer);
    this.startDateDate = moment().format('YYYY-MM-DD');
    this.endDateDate = this.startDateDate;
    if (this.startDateDate == this.endDateDate && this.endDateHour < this.startDateHour) {
      this.endDateHour = this.startDateHour;
    }
  }

  ngOnDestroy(): void {
    removeFormBackground(this.renderer);
  }

  startDateChanged() {
    this.endDateDate = this.event.startDate;
  }

}
