import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';

//importar clases de angular Material para usar en el formulario de register (CSS: estilo visual)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})

export class Register {
  // Inyectar AuthService y Router en el componente Register
  // para usar métodos de autenticación y navegar al home.
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  protected registerForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    // Apellido: obligatorio, espeja a 'name' (BD NOT NULL, schema surname: str).
    surname: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl<Credentials['email']>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    // Fecha de nacimiento: OPCIONAL (BD DATE NULL). El input nativo type="date"
    // da string 'YYYY-MM-DD' (o '' si está vacío), que encaja con User.birth_date.
    // La conversión '' -> null al construir el payload se hará en el INCR3.
    birth_date: new FormControl<string>('', {
      nonNullable: true
    }),
    // Notificaciones: opt-in -> checkbox desmarcado por defecto (false).
    notifications: new FormControl<boolean>(false, {
      nonNullable: true
    }),
    password: new FormControl<Credentials['password']>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  protected onRegisterClick(): void {
    const { name, email, password, confirmPassword } = this.registerForm.value;
    
    //2. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
    console.error('Las contraseñas no coinciden');
    return;
    }

    //Llamar al método de registro del servicio de autenticación (firebase)
    //3. envia a Firebase y espera la respuesta.
    this.authService.register(email!, password!)
      .then(response => {
        console.log('Registro exitoso:', response);
        // redirigimos al home tras registro exitoso
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error('Error en registro:', error.message);
      });
  
  }
}
