import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import Event from '../../interface/Event';
import { putFormBackground, removeFormBackground } from '../../method/background-methods';
import { callAPI } from '../../method/response-mehods';
import {NgClass, NgIf} from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { EventService } from '../../service/EventService';
import {LocationService} from '../../service/LocationService';
import ApiResponse from '../../interface/ApiResponse';
import {convertToLocationList} from '../../method/location-methods';
import Location from '../../interface/Location';

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
    InputNumberModule,
    NgClass
  ],
  templateUrl: './organize-event.component.html',
  styles: ``
})

export class OrganizeEventComponent implements OnInit, OnDestroy {
  causes: any[] | undefined;
  countries: any[] | undefined;
  provinces: Location[] = [];
  startDateDate: string = '';
  endDateDate: string = '';
  startDateHour: string = '';
  endDateHour: string = '';
  minStartDateDate: string = moment().format('YYYY-MM-DD');

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

  constructor(private renderer: Renderer2, private locationService: LocationService) {

  }

  ngOnInit(): void {
    putFormBackground(this.renderer);
    callAPI(this.locationService.getAllCountries())
      .then((countryResponse: ApiResponse) => {
        this.countries = convertToLocationList(countryResponse.data);
      })
      .catch((error: any) => {
        console.error('Error getting countries:', error);
      });
  }

  ngOnDestroy(): void {
    removeFormBackground(this.renderer);
  }

  dateAndTimeValidator($event: any): void {

    const startDate = moment(this.startDateDate, 'YYYY-MM-DD');
    const endDate = moment(this.endDateDate, 'YYYY-MM-DD');
    const startHour = moment(this.startDateHour, 'HH:mm');
    const endHour = moment(this.endDateHour, 'HH:mm');

    if (startDate.isSame(endDate) && endHour.isBefore(startHour)) {
      this.endDateHour = this.startDateHour;
    }
    if (endDate.isBefore(startDate)) {
      this.endDateDate = this.startDateDate;
    }
  }

  countryChange(): void {
    const countryCode = this.event.country;
    console.log('Country code:', countryCode);
    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse: ApiResponse) => {
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error: any) => {
        console.error('Error getting states:', error);
      });
  }

  onSubmit(): void {

  }
}
