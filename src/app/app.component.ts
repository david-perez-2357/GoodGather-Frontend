import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button, ButtonDirective, ButtonModule} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {HeaderComponent} from '../component/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button, ButtonDirective, Ripple, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'GoodGather-Frontend';
}
