import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/Leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  leadersErrMsg: boolean;

  constructor( 
    private lederService: LeaderService,
    @Inject('baseURL') private baseURL
    ) { }

  ngOnInit() {
    this.lederService.getLeaders()
    .subscribe(
      (leaders)=> this.leaders = leaders),
      leaderErrMsg => this.leadersErrMsg = leaderErrMsg;
  }

}
