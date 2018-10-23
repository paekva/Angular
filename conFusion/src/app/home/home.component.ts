import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: boolean;

  constructor(
    private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('baseURL') private baseURL
    ) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe(
        (fdish)=>this.dish = fdish,
        dishErrMess => this.dishErrMess = <any>dishErrMess
        );

    this.promotionservice.getFeaturedPromotion()
      .subscribe(
        (fpromo) => this.promotion = fpromo,
        dishErrMess => this.dishErrMess = <any>dishErrMess
        );

    this.leaderService.getFeaturedLeader()
      .subscribe(
        (fleader) => this.leader = fleader,
        dishErrMess => this.dishErrMess = <any>dishErrMess
        );
  }

}
