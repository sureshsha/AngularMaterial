import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';


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
  userComments: FormGroup;
  Comments: Comment;




  formErrors = {
    'author':'',
    'comment':''
  };

  validationMessages = {
      'author': {
        'required':'User Name is required.',
        'minlength':'User Name must be at least 2 characters long.',
        'maxlength': 'User Name cannot be more than 25 characters long.'
    },
      'comment': {
        'required': 'comment is required.',
    }
  };

  @ViewChild('fform', {static: true}) formDirective;

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL ) {
                this.createForm();
               }

  createForm() {
    this.userComments = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', Validators.required]
    });

    this.userComments.valueChanges.subscribe(data =>
      this.onValueChanged(data));

    this.onValueChanged();

  }


  onSubmit() {
    this.Comments = this.userComments.value;
    /*const data = {
      rating: this.userComments.value.rating,
      comment: this.userComments.value.comment,
      author: this.userComments.value.author,
      date: new Date()
    };*/
    this.Comments.date = new Date().toISOString();
    console.log(this.Comments);
    this.dish.comments.push(this.Comments);
    this.userComments.reset();

    this.formDirective.resetForm({
      author: '',
      rating: '5',
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.userComments) { return; }
    const form = this.userComments;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }



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
