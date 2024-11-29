import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    putDefaultBackground(this.renderer);
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }
}
