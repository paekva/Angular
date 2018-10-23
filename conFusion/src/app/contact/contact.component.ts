import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(), expand()
  ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;

  feedbackForm: FormGroup;
  feedback: Feedback;
  showForm: boolean = true;
  showSpinner: boolean = false;
  errMsg: string;

  contactType = ContactType;


  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email is not in a valid format.'
    },
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(2)]],
      telnum: [0, [ Validators.required, Validators.pattern]],
      email: ['', [ Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    // Subscribibg to any change of the form elements
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); 
  }

  onValueChanged(data? : any){
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;

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
  }
  
  onSubmit() {
    this.showForm = false;
    this.showSpinner = true;
    this.feedbackService.submitFeedback(this.feedbackForm.value)
      .subscribe(
        feedback =>
        {
          this.feedback = feedback;
          this.showSpinner = false;
          setTimeout(() => this.showForm = true, 5000);
        },
        error => {
          this.errMsg = error;
          this.showSpinner = false;
          setTimeout(() => {this.showForm = true; this.errMsg = null}, 5000);
        }
      )
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
