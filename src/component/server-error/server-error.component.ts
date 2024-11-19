import {Component, Input} from '@angular/core';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [
    CardModule,
    Button,
    NgIf
  ],
  templateUrl: './server-error.component.html',
  styles: ``
})
export class ServerErrorComponent {
  @Input() show = false;
  @Input() error = 'Ha ocurrido un error en el servidor';

  reloadPage(): void {
    window.location.reload();
  }

  goHome(): void {
    window.location.href = '/';
  }
}
