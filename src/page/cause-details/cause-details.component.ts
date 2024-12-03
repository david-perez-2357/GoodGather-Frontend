import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CauseService} from '@/service/CauseService';
import {EventService} from '@/service/EventService';
import Cause from '@/interface/Cause';
import {ActivatedRoute} from '@angular/router';
import {putDefaultBackground, removeDefaultBackground} from '@/method/background-methods';
import {callAPI} from '@/method/response-mehods';
import ApiResponse from '@/interface/ApiResponse';
import {AppService} from '@/service/AppService';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [],
  templateUrl: './cause-details.component.html',
  styles: ``
})
export class CauseDetailsComponent implements OnInit, OnDestroy{
  constructor(private renderer: Renderer2,
              private causeService: CauseService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService) {
  }

  causeId: number = 1
  cause: Cause = {} as Cause;
  events: Event[] = []


  setCause(response: ApiResponse): void {
    if (response.status === 200) {
      this.cause = response.data;
    }else {
      this.catchErrorMessage(response);
    }
  }

  catchErrorMessage(error: any): void {
    this.appService.showWErrorInApp(error);
  }

  ngOnInit() {
    this.causeId = Number(this.route.snapshot.paramMap.get('id'))
    putDefaultBackground(this.renderer)
    callAPI(this.causeService.getCause(this.causeId))
      .then((causeResponse: ApiResponse) => {
        this.setCause(causeResponse);
      }).catch((error) => {
      this.catchErrorMessage(error);
    });
  }

  ngOnDestroy() {
    removeDefaultBackground(this.renderer);
  }
}
