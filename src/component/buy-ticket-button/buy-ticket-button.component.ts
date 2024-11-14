import {Component, Input} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-buy-ticket-button',
  standalone: true,
  imports: [
    Button
  ],
  templateUrl: './buy-ticket-button.component.html',
  styles: ``
})
export class BuyTicketButtonComponent {
  @Input() price: number = 0;
  @Input() disabled: boolean = false;
  @Input() eventId: number = 0;
  @Input() userId: number = 0;
  @Input() quantity: number = 1;
  @Input() labelBeforePrice: string = '';
}
