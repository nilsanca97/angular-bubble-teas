import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * FieldLabel = el "rectángulo" gris reutilizable para los títulos de campo.
 *
 * Es un componente PRESENTACIONAL puro: solo pinta, no tiene lógica de negocio.
 * Su única responsabilidad es dar un estilo consistente a las etiquetas
 * (TIPO, SABOR, PRECIO, ESTADO...) en toda la aplicación.
 */
@Component({
  selector: 'app-field-label',
  // standalone es el modo por defecto en Angular moderno: no hace falta NgModule.
  templateUrl: './field-label.html',
  styleUrl: './field-label.scss',
  // OnPush = solo se repinta si cambian sus inputs. Ideal en componentes
  // presentacionales: mejor rendimiento y escalabilidad.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldLabel {
  /**
   * Texto que se muestra dentro del rectángulo.
   * - input.required() = es obligatorio (TypeScript obliga a pasarlo).
   * - Es una signal de solo lectura: se usa en el template como text().
   */
  text = input.required<string>();
}
