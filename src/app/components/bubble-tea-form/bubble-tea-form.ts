import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BubbleTea, BubbleTeaPayload } from '../../models/interfaces';
import { UiButton } from '../ui-button/ui-button';

/**
 * BubbleTeaForm = formulario reutilizable para CREAR y EDITAR un bubble tea.
 *
 * Es PRESENTACIONAL: solo recoge y valida datos del usuario.
 * - NO hace peticiones HTTP ni navega.
 * - Cuando el usuario envía, EMITE el payload (output) hacia la página que lo use.
 *
 * Se autoconfigura según `initialValue`:
 * - null         -> modo CREAR  (form vacío, botón "Crear").
 * - un BubbleTea -> modo EDITAR (form precargado, botón "Guardar cambios").
 */
@Component({
  selector: 'app-bubble-tea-form',
  // Importamos lo que usa el template: Reactive Forms, los campos de Material
  // y nuestro botón reutilizable.
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, UiButton],
  templateUrl: './bubble-tea-form.html',
  styleUrl: './bubble-tea-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaForm {
  /**
   * Valor inicial del formulario.
   * - null -> crear (no precargamos nada).
   * - tea  -> editar (precargamos sus campos vía effect()).
   */
  initialValue = input<BubbleTea | null>(null);

  /** Emite el payload validado (SIN id) cuando el usuario envía el formulario. */
  formSubmit = output<BubbleTeaPayload>();

  /**
   * El formulario reactivo con sus 3 campos VISIBLES y sus validaciones.
   * (El campo `active` NO se muestra: lo añadimos como true al emitir.)
   */
  protected form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Los números empiezan en null (campo vacío) hasta que el usuario escribe.
    temperature: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    precio: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  /**
   * Modo derivado de initialValue (señal calculada con computed):
   * si hay tea -> 'edit'; si no -> 'create'. No hace falta pasarlo a mano.
   */
  protected mode = computed(() => (this.initialValue() ? 'edit' : 'create'));

  /** Texto del botón, derivado del modo. Se recalcula solo. */
  protected submitLabel = computed(() =>
    this.mode() === 'edit' ? 'Guardar cambios' : 'Crear'
  );

  constructor() {
    /**
     * effect(): cuando initialValue() llegue o cambie (modo editar),
     * volcamos sus datos al formulario con patchValue().
     * Angular rastrea solo que leemos initialValue(): no hay lista de dependencias.
     */
    effect(() => {
      const tea = this.initialValue();
      if (tea) {
        this.form.patchValue({
          name: tea.name,
          temperature: tea.temperature,
          precio: tea.precio,
        });
      }
    });
  }

  /**
   * Al pulsar el botón de enviar:
   * - Si el form es inválido, marcamos los campos como "tocados" para mostrar errores.
   * - Si es válido, construimos el payload (añadiendo active: true) y lo emitimos.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue() nos da los valores ya tipados del formulario.
    const { name, temperature, precio } = this.form.getRawValue();

    this.formSubmit.emit({
      name,
      temperature: temperature!, // sabemos que no son null: el form es válido.
      precio: precio!,
      active: true, // Decisión: el usuario no toca este campo; nace activo.
    });
  }
}
