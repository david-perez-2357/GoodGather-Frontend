import {Component, Input} from '@angular/core';
import Cause from '../../interface/Cause';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cause',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './cause.component.html',
  styles: ``
})
export class CauseComponent {


  @Input() cause: Cause = {
    id: 0,
    name: 'Afectados por la DANA en Valencia',
    description: '',
    image: '',
    scope: '',
    idOwner: 0
  }

  onImageError($event: ErrorEvent) {
    const target = $event.target as HTMLImageElement;
    target.src = 'gg-placeholder-image.png';
  }


}
