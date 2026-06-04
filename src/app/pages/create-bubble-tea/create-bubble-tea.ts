import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BubbleTeaService } from '../../services/bubble-tea.service';
import { BubbleTeaPayload } from '../../models/interfaces';
import { BubbleTeaForm } from '../../components/bubble-tea-form/bubble-tea-form';
import { UiButton } from '../../components/ui-button/ui-button';

/**
 * CreateBubbleTea = página (componente CONTENEDOR/inteligente) para crear un tea.
 *
 * Reparto de roles (igual que en "home"):
 * - La PÁGINA tiene la lógica: inyecta el service y el router, llama al backend.
 * - El FORMULARIO (app-bubble-tea-form) solo recoge datos y emite el payload.
 */
@Component({
  selector: 'app-create-bubble-tea',
  imports: [BubbleTeaForm, UiButton],
  templateUrl: './create-bubble-tea.html',
  styleUrl: './create-bubble-tea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBubbleTea {
  // inject() -> inyección moderna (código nuevo).
  private bubbleTeaService = inject(BubbleTeaService);
  private router = inject(Router);

  /** Mensaje de error a mostrar (null = sin error). La pinta el template. */
  protected errorMessage = signal<string | null>(null);

  /**
   * Recibe el payload emitido por el formulario y lo manda al backend.
   * No hace falta limpiar la suscripción: las peticiones de HttpClient
   * COMPLETAN solas tras una respuesta (no hay fuga de memoria).
   */
  protected onFormSubmit(payload: BubbleTeaPayload): void {
    this.errorMessage.set(null); // limpiamos errores previos

    this.bubbleTeaService.create(payload).subscribe({
      next: () => {
        // Éxito: volvemos a la home, donde se verá el nuevo bubble tea.
        this.router.navigate(['']);
      },
      error: (err) => {
        // NOTA: hasta implementar el token (HTTP Interceptor), el backend
        // responderá 401 aquí. Es ESPERADO en esta fase de solo-UI.
        console.error('Error al crear el bubble tea:', err);
        this.errorMessage.set('No se pudo crear el bubble tea. Inténtalo de nuevo.');
      },
    });
  }

  /** Botón Cancelar: volver a la home sin crear nada. */
  protected onCancel(): void {
    this.router.navigate(['']);
  }
}
