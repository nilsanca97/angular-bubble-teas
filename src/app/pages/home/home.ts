import { Component, OnInit, inject, signal } from '@angular/core'; // signal → caja reactiva que avisa a la pantalla.
import { Router } from '@angular/router'; // Router → para navegar a otras páginas (crear/editar).
import { BubbleTea } from '../../models/interfaces'; // → la interface (BubbleTea), para tipar la libreta.
import { BubbleTeaService } from '../../services/bubble-tea.service';
// Componentes reutilizables que usamos en el template del home.
import { BubbleTeaCard } from '../../components/bubble-tea-card/bubble-tea-card';
import { UiButton } from '../../components/ui-button/ui-button';

@Component({
  selector: 'app-home',
  // Registramos los componentes que aparecen en home.html.
  imports: [BubbleTeaCard, UiButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})


// implements OnInit -> es una promesa: "esta clase tendrá un método ngOnInit"
export class Home implements OnInit {

  // La "libreta" reactiva donde guardaremos los bubble teas. Empieza vacía.
  // Al ser una signal, cuando cambie avisará sola a la pantalla para repintar.
  bubbleTeas = signal<BubbleTea[]>([]);

  // inject() -> inyección moderna. Migramos el home a este estilo (antes era
  // por constructor) para usar también el Router de forma coherente.
  private bubbleTeaService = inject(BubbleTeaService);
  private router = inject(Router);

  // ngOnInit se ejecuta cuando la página se carga. Aquí arrancamos el trabajo.
  ngOnInit(): void {
    this.cargarBubbleTeas();
  }

  /**
   * Pide la lista de bubble teas al backend y la guarda en la signal.
   * Lo extraemos a un método porque lo usamos en dos sitios: al cargar la
   * página (ngOnInit) y tras borrar (para refrescar la lista).
   */
  private cargarBubbleTeas(): void {
    this.bubbleTeaService.getAll().subscribe((datos) => {
      // .set() mete los datos en la signal Y avisa a la pantalla para que repinte.
      this.bubbleTeas.set(datos);
    });
  }

  // --- Métodos de acción ---

  /** Botón "Crear nuevo bubble-tea": navega a la página de creación (/create). */
  protected crear(): void {
    this.router.navigate(['create']);
  }

  /** Botón "Ver detalles" de una tarjeta. */
  protected verDetalles(tea: BubbleTea): void {
    // TODO: feat futura -> navegar a la página de detalle de este bubble tea.
    console.log('Ver detalles:', tea);
  }

  /** Botón "Editar" de una tarjeta: navega a /edit/:id con el id del tea. */
  protected editar(tea: BubbleTea): void {
    this.router.navigate(['edit', tea.id]);
  }

  /**
   * Botón "Borrar" de una tarjeta.
   * 1. Pedimos confirmación (acción destructiva) con window.confirm.
   * 2. Si confirma, llamamos al backend para borrar.
   * 3. Si va bien, recargamos la lista; si falla, lo registramos en consola.
   *
   * NOTA: el frontend solo "pide borrar"; el backend decide CÓMO (hoy borra
   * físicamente; en el futuro será un soft-delete que pondrá active=false).
   * Además, hasta tener el token, el DELETE responderá 401 (esperado).
   */
  protected borrar(tea: BubbleTea): void {
    const confirmado = window.confirm(`¿Seguro que quieres borrar "${tea.name}"?`);
    if (!confirmado) {
      return;
    }

    this.bubbleTeaService.delete(tea.id).subscribe({
      next: () => {
        // Borrado OK en el backend -> refrescamos la lista para reflejarlo.
        this.cargarBubbleTeas();
      },
      error: (err) => {
        // 401 esperado hasta implementar el token (Interceptor).
        console.error('Error al borrar el bubble tea:', err);
      },
    });
  }
}
