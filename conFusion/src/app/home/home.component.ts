import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  constructor(
    private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('baseURL') private baseURL
    ) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe((fdish)=>this.dish = fdish);

    this.promotionservice.getFeaturedPromotion()
      .subscribe((fpromo) => this.promotion = fpromo);

    this.leaderService.getFeaturedLeader()
      .subscribe((fleader) => this.leader = fleader);
  }

}
