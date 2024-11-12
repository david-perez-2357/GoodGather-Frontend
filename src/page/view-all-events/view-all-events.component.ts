import {Component, Renderer2} from '@angular/core';
import {FloatLabelModule} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {ChipsModule} from 'primeng/chips';
import {Button} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';

@Component({
  selector: 'app-page-index',
  standalone: true,
  imports: [
    FloatLabelModule,
    FormsModule,
    ChipsModule,
    Button,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './view-all-events.component.html',
  styles: ``
})
export class ViewAllEventsComponent {
  value: any;
  loading: unknown;
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'default-bg');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'default-bg');
  }

  load() {

  }
}
