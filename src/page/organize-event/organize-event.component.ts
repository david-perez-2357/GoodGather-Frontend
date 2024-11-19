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
import { NgIf } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { EventService } from '../../service/EventService';

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
  eventForm: FormGroup;
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
  minStartDateDate: string = moment().format('YYYY-MM-DD');

  constructor(private renderer: Renderer2, private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      startDateDate: ['', Validators.required],
      endDateDate: ['', Validators.required],
      startDateHour: ['', Validators.required],
      endDateHour: ['', Validators.required],
      ticketPrice: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      capacity: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]]
    }, { validators: this.dateAndTimeValidator });
  }

  ngOnInit(): void {
    putFormBackground(this.renderer);
    callAPI(this.eventService.createEvent(this.eventForm.value)).then(response => {
      if (response.status === 200) {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    removeFormBackground(this.renderer);
  }

  dateAndTimeValidator(group: FormGroup) {
    const startDate = moment(group.get('startDateDate')?.value, 'YYYY-MM-DD');
    const endDate = moment(group.get('endDateDate')?.value, 'YYYY-MM-DD');
    const startHour = moment(group.get('startDateHour')?.value, 'HH:mm');
    const endHour = moment(group.get('endDateHour')?.value, 'HH:mm');

    if (startDate.isSame(endDate, 'day') && startDate.isSame(endDate, 'month') && startDate.isSame(endDate, 'year') && endHour.isBefore(startHour)) {
      return { timeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      callAPI(this.eventService.createEvent(this.eventForm.value)).then(response => {
        if (response.status === 200) {
          window.location.reload();
        }
      });
    }
  }
}
