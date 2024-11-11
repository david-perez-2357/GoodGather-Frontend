import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-register-and-login',
  standalone: true,
  imports: [],
  templateUrl: './register-and-login.component.html',
  styles: ``
})

export class RegisterAndLoginComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'form-bg');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'form-bg');
  }
}
