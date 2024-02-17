import { Component, OnInit } from '@angular/core';
import { MAX_REQUEST_LIFE } from 'app/constants/max-request-life';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      ms: new FormControl(localStorage.getItem(MAX_REQUEST_LIFE), [Validators.required, Validators.min(3000)])
    });
  }

  updateValue(value: string) {
    if (!value)
      return;
    localStorage.setItem(MAX_REQUEST_LIFE, value);
    this.form.reset();
    this.router.navigate(['']);
  }
}
