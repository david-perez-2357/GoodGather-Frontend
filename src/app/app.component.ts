import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button, ButtonDirective, ButtonModule} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button, ButtonDirective, Ripple],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'GoodGather-Frontend';
}
