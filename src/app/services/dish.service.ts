import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
// import { DISHES } from '../shared/dishes';
import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  [x: string]: any;


  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseUrl + 'dishes');
    // return of(DISHES).pipe(delay(2000));
}

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(baseUrl + 'dishes/' + id);

     // return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish>(baseUrl + 'dishes?featured=true').pipe(map(dishes => dishes[0]));
    // return of(DISHES.filter((dish) => dish.featured )[0]).pipe(delay(2000));
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)));

    // return of(DISHES.map(dish => dish.id));
  }
}
