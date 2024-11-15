import { Component, Renderer2, ViewChild } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { Button, ButtonDirective } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { NgForOf } from '@angular/common';
import { OverlayPanel } from 'primeng/overlaypanel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SliderModule} from 'primeng/slider';
import {PaginatorModule} from 'primeng/paginator';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-page-index',
  standalone: true,
  imports: [
    FloatLabelModule,
    FormsModule,
    ChipsModule,
    Button,
    IconFieldModule,
    InputIconModule,
    OverlayPanelModule,
    CheckboxModule,
    NgForOf,
    ButtonDirective,
    SelectButtonModule,
    SliderModule,
    PaginatorModule,
    Ripple
  ],
  templateUrl: './view-all-events.component.html',
  styleUrls: ['./view-all-events.component.css']
})
export class ViewAllEventsComponent {
  @ViewChild('overlay') overlay!: OverlayPanel;

  loading = false;
  stateOptions: any[] = [{ label: 'En tu país', value: 'country' }, { label: 'En tu provincia', value: 'province' }];

  value: string = 'province';

  valueslider: number = 50;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'default-bg');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'default-bg');
  }

  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  toggleOverlay(event: Event) {
    this.overlay.toggle(event);
  }

}
