import { Component, OnInit, inject, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
// import { baseUrl } from '../shared/baseurl';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errorMsg: string;

  constructor(private dishService: DishService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe((dishes) => this.dishes = dishes,
    error => this.errorMsg = <any>error);
  }
}
