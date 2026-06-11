import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Credentials, UserPayload } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

//importar clases de angular Material para usar en el formulario de register (CSS: estilo visual)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Validador de GRUPO: comprueba que 'password' y 'confirmPassword' coincidan.
// Devuelve { passwordsMismatch: true } si difieren -> el .html ya muestra ese error
// y, como el botón está [disabled]="registerForm.invalid", también se deshabilita.
// Si confirmPassword aún está vacío, devolvemos null: dejamos que su Validators.required
// se encargue, para no mostrar dos errores a la vez ("requerido" + "no coinciden").
const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordsMismatch: true };
};

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

  // inject() en el código nuevo (UserService): graba la fila User en la BD tras el
  // registro en Firebase. AuthService/Router siguen por constructor (migración aparte).
  private userService = inject(UserService);

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
  }, { validators: passwordsMatchValidator });

  protected async onRegisterClick(): Promise<void> {
    // getRawValue(): los controles son nonNullable, así que devuelve el objeto
    // completo y tipado (sin undefined) -> no hacen falta aserciones "!".
    const { name, surname, email, birth_date, notifications, password } =
      this.registerForm.getRawValue();

    // Paso 1: registro en Firebase. Si falla (email ya existe, password débil, red...),
    // NO seguimos ni navegamos: el usuario se queda en /register para corregir y reintentar.
    try {
      await this.authService.register(email, password);
    } catch (error) {
      console.error('Error en el registro de Firebase:', error);
      return;
    }

    // Paso 2: grabar la fila User en la BD. birth_date '' -> null (la BD es DATE NULL y
    // Pydantic rechaza ''); active siempre true (no se pregunta).
    const payload: UserPayload = {
      name,
      surname,
      email,
      birth_date: birth_date || null,
      active: true,
      notifications,
    };

    // Si falla (fila huérfana: registrado en Firebase pero sin fila en BD), avisamos por
    // consola pero navegamos igual: el usuario YA está autenticado y se autorrepara con el
    // get-or-create de /me (localiza/crea la fila por firebase_uid, con backfill por email).
    try {
      await firstValueFrom(this.userService.create(payload));
    } catch (error) {
      console.error('Usuario registrado en Firebase, pero falló la grabación en BD:', error);
    }

    this.router.navigate(['']);
  }
}
