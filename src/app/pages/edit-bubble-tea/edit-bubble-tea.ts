import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BubbleTeaService } from '../../services/bubble-tea.service';
import { BubbleTea, BubbleTeaPayload } from '../../models/interfaces';
import { BubbleTeaForm } from '../../components/bubble-tea-form/bubble-tea-form';
import { UiButton } from '../../components/ui-button/ui-button';

/**
 * EditBubbleTea = página (componente CONTENEDOR/inteligente) para editar un tea.
 *
 * Flujo:
 * 1. Lee el :id de la URL (Route Input Binding -> llega como input).
 * 2. En ngOnInit pide el tea con getById y lo guarda en una signal.
 * 3. Pasa ese tea al BubbleTeaForm como initialValue (el form se precarga solo).
 * 4. Al recibir formSubmit, llama a update(id, payload) y vuelve a home.
 */
@Component({
  selector: 'app-edit-bubble-tea',
  imports: [BubbleTeaForm, UiButton],
  templateUrl: './edit-bubble-tea.html',
  styleUrl: './edit-bubble-tea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBubbleTea implements OnInit {
  /**
   * Route Input Binding: el :id de la URL llega como un input normal.
   * OJO: llega como TEXTO (string); lo convertimos a número al usarlo.
   */
  id = input.required<string>();

  // inject() -> inyección moderna (código nuevo).
  private bubbleTeaService = inject(BubbleTeaService);
  private router = inject(Router);

  /** El bubble tea cargado. null = aún cargando (o falló la carga). */
  protected tea = signal<BubbleTea | null>(null);

  /** Mensaje de error (al cargar o al guardar). null = sin error. */
  protected errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // El input de ruta ya está disponible aquí. Lo pasamos a número.
    const id = Number(this.id());

    // GET /bubble-teas/{id} es PÚBLICO -> esta carga SÍ funciona (sin token).
    this.bubbleTeaService.getById(id).subscribe({
      next: (tea) => this.tea.set(tea),
      error: (err) => {
        console.error('Error al cargar el bubble tea:', err);
        this.errorMessage.set('No se pudo cargar el bubble tea.');
      },
    });
  }

  /**
   * Recibe el payload emitido por el formulario y manda el PUT al backend.
   * (No hace falta limpiar la suscripción: HttpClient completa solo.)
   */
  protected onFormSubmit(payload: BubbleTeaPayload): void {
    this.errorMessage.set(null); // limpiamos errores previos
    const id = Number(this.id());

    this.bubbleTeaService.update(id, payload).subscribe({
      next: () => {
        // Éxito: volvemos a home, donde se verán los cambios.
        this.router.navigate(['']);
      },
      error: (err) => {
        // NOTA: hasta implementar el token (Interceptor), el PUT da 401.
        // Es ESPERADO en esta fase de solo-UI.
        console.error('Error al actualizar el bubble tea:', err);
        this.errorMessage.set('No se pudieron guardar los cambios. Inténtalo de nuevo.');
      },
    });
  }

  /** Botón Cancelar/Volver: regresar a home sin guardar. */
  protected onCancel(): void {
    this.router.navigate(['']);
  }
}
