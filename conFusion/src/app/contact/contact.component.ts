import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;

  feedbackForm: FormGroup;
  feedback: Feedback;

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
    private fb: FormBuilder
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
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
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
