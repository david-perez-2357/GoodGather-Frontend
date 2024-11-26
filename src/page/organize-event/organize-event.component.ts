import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import Event from '@/interface/Event';
import { putFormBackground, removeFormBackground } from '@/method/background-methods';
import { callAPI } from '@/method/response-mehods';
import {NgClass, NgIf} from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { EventService } from '@/service/EventService';
import {LocationService} from '@/service/LocationService';
import ApiResponse from '@/interface/ApiResponse';
import {convertToLocationList} from '@/method/location-methods';
import Location from '@/interface/Location';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"

UC.defineComponents(UC);

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
    NgClass,
    ToastModule
  ],
  templateUrl: './organize-event.component.html',
  styles: ``,
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
  formValid: boolean = false;
  stepActive: number = 0;

  event: Event = {
    id: 0,
    name: '',
    description: '',
    image: 'aqui va la imagen',
    startDate: '',
    endDate: '',
    capacity: 0,
    boughtTickets: 0,
    address: '',
    province: '',
    country: '',
    ticketPrice: 0,
    deleted: 0,
    idOwner: 1,
    idCause: 1
  }
  country: Location = {
    name: '',
    code: ''
  }
  constructor(private renderer: Renderer2, private locationService: LocationService, private eventService: EventService, private messageService: MessageService) {}

  @ViewChild('ctxProvider', {static: true}) ctxProvider!: ElementRef<typeof UC.UploadCtxProvider.prototype>;

  ngOnInit(): void {
    putFormBackground(this.renderer);
    callAPI(this.locationService.getAllCountries())
      .then((countryResponse: ApiResponse) => {
        this.countries = convertToLocationList(countryResponse.data);
      })
      .catch((error: any) => {
        console.error('Error getting countries:', error);
      });
    this.ctxProvider.nativeElement.addEventListener('data-output', this.handleUploadEvenet);
    this.ctxProvider.nativeElement.addEventListener('done-flow', this.handleDoneFlow);
  }

  handleUploadEvenet(e: any) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    console.log(e.detail);
  }

  handleDoneFlow() {
    console.log('handleDoneFlow');
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
    const countryCode = this.country.code;
    this.event.country = this.country.name;
    this.event.province = '';
    console.log('Country code:', countryCode);
    callAPI(this.locationService.getStatesByCountry(countryCode))
      .then((stateResponse: ApiResponse) => {
        this.provinces = convertToLocationList(stateResponse.data);
      })
      .catch((error: any) => {
        console.error('Error getting states:', error);
      });
  }

  validateForm(): boolean {
    return this.formValid = this.event.name !== '' &&
      this.event.description !== '' &&
      this.event.startDate.trim() !== '' &&
      this.event.endDate.trim() !== '' &&
      this.event.capacity > 0 &&
      this.event.address !== '' &&
      this.event.province !== '' &&
      this.event.country !== '';
  }

  onSubmit(): void {
    this.event.startDate = this.startDateDate + ' ' + this.startDateHour;
    this.event.endDate = this.endDateDate + ' ' + this.endDateHour;
    if (!this.validateForm()) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Por favor, rellena todos los campos'});
      return;
    }
      callAPI(this.eventService.createEvent(this.event))
        .then((response: ApiResponse) => {
          if (response.status === 200) {
            this.messageService.add({severity: 'success', summary: 'Evento creado', detail: 'El evento se ha creado correctamente'});
          } else if (response.toastMessage) {
            this.messageService.add(response.toastMessage);
          }
        }).catch((error: any) => {
          this.messageService.add(error.toastMessage);
        });
  }
}
