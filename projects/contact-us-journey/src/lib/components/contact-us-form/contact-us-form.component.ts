import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../model/Contact';

@Component({
  selector: 'bb-contact-us-form',
  templateUrl: 'contact-us-form.component.html'
})
export class ContactUsFormComponent implements OnInit {

  @Output() submitContact = new EventEmitter<Contact>();
  contactUsForm!: FormGroup;

  private getControl(field: string): AbstractControl | undefined {
    return this.contactUsForm.controls[field];
  }

  contact(): void {
    if (this.contactUsForm.valid) {
      this.submitContact.emit({
        name: this.contactUsForm.value.name,
        email: this.contactUsForm.value.email,
        phone: this.contactUsForm.value.phone,
        subject: this.contactUsForm.value.subject,
        message: this.contactUsForm.value.message,
      });
    } else {
      this.contactUsForm.markAllAsTouched();
    }
  }

  getError(field: string, type: string): string {
    const control = this.getControl(field);

    return control && control.errors && control.errors[type];
  }

  isInvalidControl(field: string): boolean {
    const control = this.getControl(field);

    return !!control && control.touched && control.invalid;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.email],
        phone: [''],
        subject: ['', Validators.required],
        message: ['', Validators.required]
    });
  }
}
