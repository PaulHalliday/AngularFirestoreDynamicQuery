import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { Lesson } from './models/lesson';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lessonRef: AngularFirestoreCollection<Lesson>;
  lesson$: Observable<Lesson[]>;
  endDate$: BehaviorSubject<Date>;

  constructor(private afs: AngularFirestore) {
    this.endDate$ = new BehaviorSubject(new Date('2017-12-24'));
    this.lesson$ = this.endDate$.pipe(
      switchMap(date =>
        this.afs.collection<Lesson>('Lesson', ref => ref.where('endDate', '==', date)).valueChanges()
      )
    );
  }

  nextLesson() {
    this.endDate$.next(moment(this.endDate$.getValue()).add(7, 'days').toDate());
  }
  previousLesson() {
    this.endDate$.next(moment(this.endDate$.getValue()).add(-7, 'days').toDate());
  }
}
