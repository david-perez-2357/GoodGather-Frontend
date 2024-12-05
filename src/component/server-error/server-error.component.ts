import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

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
  @Input() status = 500;
  @Output() triggerError = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  reloadPage(): void {
    window.location.reload();
  }

  primaryButtonAction(): void {
    if (this.status === 403) {
      this.show = false;
      this.router.navigate(['/login']);
      this.triggerError.emit(this.show);
    } else {
      this.reloadPage();
    }
  }

  goHome(): void {
    window.location.href = '/';
  }

  getPrimaryButtonText(): string {
    if (this.status === 403) {
      return 'Iniciar sesión';
    }else {
      return 'Reintentar';
    }
  }

  getSecondaryButtonText(): string {
    if (this.status === 403) {
      return 'Registrate';
    }else {
      return 'Volver al inicio';
    }
  }

  secondaryButtonAction() {
    if (this.status === 403) {
      this.show = false;
      this.router.navigate(['/register']);
      this.triggerError.emit(this.show);
    }else {
      this.goHome();
    }
  }
}
