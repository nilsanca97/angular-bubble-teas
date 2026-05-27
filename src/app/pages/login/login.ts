import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected loginForm = new FormGroup({
    email: new FormControl<User['email']>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<User['password']>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
  });

  protected onLoginClick(): void {
    const formValue = this.loginForm.value;
    console.log('Login:', formValue);
    // agregar la lógica de autenticación (en la segunda fase)
  }
}
