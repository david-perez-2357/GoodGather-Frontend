import {Component, Input} from '@angular/core';
import {Button} from 'primeng/button';
import {BuyTicketDialogComponent} from '../buy-ticket-dialog/buy-ticket-dialog.component';

@Component({
  selector: 'app-buy-ticket-button',
  standalone: true,
  imports: [
    Button,
    BuyTicketDialogComponent
  ],
  templateUrl: './buy-ticket-button.component.html',
  styles: ``
})
export class BuyTicketButtonComponent {
  @Input() price: number = 0;
  @Input() disabled: boolean = false;
  @Input() eventId: number = 0;
  @Input() eventName: string = '';
  @Input() userId: number = 0;
  @Input() ticketsLeft: number = 10;
  @Input() labelBeforePrice: string = '';
  @Input() priceLoaded: boolean = true;
  @Input() buttonClass: string = '';
  showDialog: boolean = false;

  getLabel(): string {
    if (!this.priceLoaded) {
      return 'Cargando precio...';
    }

    if (this.disabled) {
      return 'AGOTADO';
    }

    if (this.price === 0) {
      return 'GRATIS';
    }

    return this.labelBeforePrice + this.price + '€';
  }
}
