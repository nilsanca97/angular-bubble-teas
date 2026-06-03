import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/**
 * UiButton = botón reutilizable de la app.
 *
 * Envuelve el botón de Angular Material para tener UN único botón
 * consistente (mismo estilo, tamaño y comportamiento) en toda la app.
 * Es presentacional: no sabe QUÉ hace el click, solo avisa de que ocurrió.
 */
@Component({
  selector: 'app-ui-button',
  // Importamos el módulo de botones de Material para poder usar [matButton].
  imports: [MatButtonModule],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  /** Texto que se muestra dentro del botón (obligatorio y tipado). */
  label = input.required<string>();

  /**
   * Aspecto visual del botón:
   * - 'primary' = relleno (acción principal).
   * - 'outline' = solo borde (acción secundaria).
   * Por defecto 'primary'. En "home" todos los botones usan 'primary'.
   */
  variant = input<'primary' | 'outline'>('primary');

  /** Permite deshabilitar el botón desde fuera. */
  disabled = input(false);

  /** Avisa al componente padre cuando se pulsa el botón. */
  clicked = output<void>();

  /**
   * Traduce nuestra 'variant' a la "apariencia" que entiende Material:
   * 'primary' -> 'filled' (relleno) | 'outline' -> 'outlined' (con borde).
   * computed() = signal derivada: se recalcula sola si cambia variant().
   */
  protected appearance = computed(() => (this.variant() === 'outline' ? 'outlined' : 'filled'));

  /** Emite el evento 'clicked' solo si el botón NO está deshabilitado. */
  protected onClick(): void {
    if (this.disabled()) {
      return;
    }
    this.clicked.emit();
  }
}
