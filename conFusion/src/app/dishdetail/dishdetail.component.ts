import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/Comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDerective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  commentObj: Comment;
  errMess: boolean;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author name is required.',
      'minlength':     'Author name must be at least 2 characters long.',
      'maxlength':     'Author name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.'
    },
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('baseURL') private baseURL
  ) { }

  ngOnInit() {
    //getting Id's of all dishes
    this.dishService.getDishIds().subscribe(
      dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess
      );

    //following the changes in url params in router link (observable in router), when the change happened
    //creating a new observable, that returns us a dish, according to a change of is in params
    this.route.params.pipe(
      switchMap((params: Params) => this.dishService.getDish(params['id']))
      )
    .subscribe(
      dish => { this.dish = dish; this.setPrevNext(dish.id); },
      errmess => this.errMess = <any>errmess
      );

    this.createForm();

    // Subscribibg to any change of the form elements
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); 
  }

  onValueChanged(data? : any){
    if (!this.commentForm) { return; }
    const form = this.commentForm;

    //For every el in the form we ...
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // ... clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        // state new error msg if needed
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          // with name of the error in mind we place necessary error msg
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }

    this.commentObj = this.commentForm.value;
  }

  createForm(): void {
    this.commentForm = this.formBuilder.group({
      author: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2)] ]
    });
  }

  onSubmit() {
    this.commentObj.date = (new Date()).toString();
    this.dish.comments.push(this.commentObj);
    console.log(this.commentObj);
    this.commentForm.reset({
      author:'',
      rating: 5,
      comment: ''
    });
    
    this.commentFormDerective.reset();
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
