import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BubbleTea } from '../../models/interfaces';
import { FieldLabel } from '../field-label/field-label';
import { UiButton } from '../ui-button/ui-button';

/**
 * BubbleTeaCard = la tarjeta que representa UN bubble tea.
 *
 * Ensambla las piezas reutilizables: una mat-card de Material que dentro
 * usa los rectángulos (FieldLabel) y los botones (UiButton).
 *
 * Es PRESENTACIONAL: muestra los datos y AVISA de los clicks mediante outputs,
 * pero NO decide qué pasa al pulsar (de eso se encarga el componente "home").
 */
@Component({
  selector: 'app-bubble-tea-card',
  // Importamos lo que usa el template: la card de Material y nuestros componentes.
  imports: [MatCardModule, FieldLabel, UiButton],
  templateUrl: './bubble-tea-card.html',
  styleUrl: './bubble-tea-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaCard {
  /** El bubble tea a mostrar (objeto completo, obligatorio y tipado). */
  tea = input.required<BubbleTea>();

  /** Avisos hacia el padre: cada botón tiene su propio evento. */
  viewDetails = output<BubbleTea>();
  edit = output<BubbleTea>();
  delete = output<BubbleTea>();

  // Manejadores: emiten el evento con el tea actual.
  // Usamos métodos (y no llamar a emit() en el template) porque 'delete'
  // es palabra reservada de JavaScript y daría problemas en la plantilla.
  protected onViewDetails(): void {
    this.viewDetails.emit(this.tea());
  }

  protected onEdit(): void {
    this.edit.emit(this.tea());
  }

  protected onDelete(): void {
    this.delete.emit(this.tea());
  }
}
