import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Promotion } from '../shared/promotion';
import { Dish } from '../shared/dish';
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
  dishError: string;
  promoError: string;
  leaderError: string;
  constructor(private dishService: DishService,
              private promotionService: PromotionService,
              private leaderService: LeaderService,
              @Inject('BaseURL') private BaseURL ) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
    .subscribe((dish) => this.dish = dish,
    error => this.dishError = <any>error);

    this.promotionService.getFeaturedPromotion()
    .subscribe((promo) => this.promotion = promo,
    error => this.promoError = <any>error);

    this.leaderService.getFeaturedLeader()
    .subscribe((leader) => this.leader = leader,
    error => this.leaderError = <any>error);
  }

}
