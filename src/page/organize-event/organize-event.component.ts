import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';

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
    TooltipModule
  ],
  templateUrl: './organize-event.component.html',
  styles: ``
})
export class OrganizeEventComponent implements OnInit, OnDestroy {
  causes: any[] | undefined;
  selectedCause: any;
  countries: any[] | undefined;
  selectedCountry: any;
  province: any[] | undefined;
  selectedProvince: any;
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'form-bg');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'form-bg');
  }
}
