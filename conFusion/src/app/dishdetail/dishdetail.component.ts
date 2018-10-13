import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    //getting Id's of all dishes
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    //following the changes in url params in router link (observable in router), when the change happened
    //creating a new observable, that returns us a dish, according to a change of is in params
    this.route.params.pipe(
      switchMap((params: Params) => this.dishService.getDish(params['id']))
      )
    .subscribe(
      dish => { this.dish = dish; this.setPrevNext(dish.id); }
      );
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    // according to a current dis id - find previous and next dishes
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
}
