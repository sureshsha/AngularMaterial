import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [trigger('visibility', [
     state('shown', style({ transform: 'scale(1.0)', opacity: 1 })),
     state('hidden', style({ transform: 'scale(0.5)', opacity: 0})),
    transition('* => *', animate('0.5s ease-in-out'))
])
  ]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  next: string;
  prev: string;
  userComments: FormGroup;
  Comments: Comment;
  dishError: string;
  dishCopy: Dish;
  visibility = 'shown';




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
    this.dishCopy.comments.push(this.Comments);
    this.dishService.putDishes(this.dishCopy).subscribe(dish => {
      this.dish = dish; this.dishCopy = dish;
    }, errmess => { this.dish = null; this.dishCopy = null; this.dishError = <any>errmess; });
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

  this.dishService.getDishIds().subscribe(dishId => this.dishIds = dishId);

  // tslint:disable-next-line: no-string-literal
  this.route.params.pipe(switchMap((params: Params) => {
    this.visibility = 'hidden';
    return this.dishService.getDish(params['id']); } ))
  .subscribe((dish) => {
    this.dish = dish;
    this.dishCopy = dish;
    this.setPrevNext(dish.id);
    this.visibility = 'shown';
  }, error => this.dishError = error);
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
