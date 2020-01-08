import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
// import { LEADERS } from '../shared/leaders';
import { of, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {baseUrl } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeader(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseUrl + 'leadership');
    // return of (LEADERS).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseUrl + 'leadership?featured=true').pipe(map(leader => leader[0]));
    // return of (LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  }
}
