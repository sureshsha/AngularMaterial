import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {


  dish: Dish;
  dishIds: string[];
  next: string;
  prev: string;

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute ) { }

  ngOnInit() {

  this.dishService.getDishIds().subscribe(dishId => this.dishIds = dishId );
  // tslint:disable-next-line: no-string-literal
  this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
  .subscribe((dish) => {
    this.dish = dish;
    this.setPrevNext(dish.id);
  });
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
  }
}
