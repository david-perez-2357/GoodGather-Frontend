import {Component, Input, ViewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {BuyTicketDialogComponent} from '@/component/buy-ticket-dialog/buy-ticket-dialog.component';

@Component({
  selector: 'app-buy-ticket-button',
  standalone: true,
  imports: [
    Button,
  ],
  templateUrl: './buy-ticket-button.component.html',
  styles: ``
})
export class BuyTicketButtonComponent {
  @Input() price: number = 0;
  @Input() eventFinished: boolean = false;
  @Input() eventId: number = 0;
  @Input() ticketsLeft: number = 10;
  @Input() labelBeforePrice: string = '';
  @Input() priceLoaded: boolean = true;
  @Input() buttonClass: string = '';

  getLabel(): string {
    if (!this.priceLoaded) {
      return 'Cargando precio...';
    }

    if (this.eventFinished) {
      return 'FINALIZADO';
    }

    if (this.ticketsLeft <= 0) {
      return 'AGOTADO';
    }

    if (this.price === 0) {
      return 'GRATIS';
    }

    return this.labelBeforePrice + this.price + '€';
  }
}
