import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // Inyectar AuthService y Router en el componente Login
  // para usar sus métodos de autenticación y redirigir al home.
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
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

  //cambia el método onLoginClick para llamar al método de login del AuthService y manejar la respuesta.
  protected onLoginClick(): void {
    // 1. Si el formulario es inválido, no intentamos hacer login
    if (this.loginForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    // 2. Extraemos los valores del formulario
    const { email, password } = this.loginForm.value;

    // 3. Llamamos al servicio de autenticación para iniciar sesión
    this.authService.login(email!, password!)
      .then(response => {
        // 4. Si el login es exitoso, aquí recibimos la respuesta de Firebase
        console.log('Login exitoso:', response);
        // 5. Redirigimos al home cuando el login es exitoso
        this.router.navigate(['']);
      })
      .catch(error => {
        // 6. Si hay un error de autenticación, lo capturamos
        console.error('Error en login:', error.message);
      });
  }
}
