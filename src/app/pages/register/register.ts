import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})

export class Register {
  // 1.inyectar el servicio de autenticacion. 
  // usar el AuthService dentro de la pagina Register. 
  //uso el constructor para inyectar dependencias (service autenticacion).
  constructor(private authService: AuthService) {}

  protected registerForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
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
        // aquí puedes redirigir al usuario o guardar datos
      })
      .catch(error => {
        console.error('Error en registro:', error.message);
      });
  
  }
}
