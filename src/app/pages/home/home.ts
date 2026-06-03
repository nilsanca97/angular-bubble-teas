import { Component, OnInit, signal } from '@angular/core'; // → la "interfaz" que nos da el momento ngOnInit. signal → caja reactiva que avisa a la pantalla.
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


  // PASO 2: la "libreta" reactiva donde guardaremos los bubble teas. Empieza vacía.
  // Al ser una signal, cuando cambie avisará sola a la pantalla para repintar.
  bubbleTeas = signal<BubbleTea[]>([]);

  // PASO 1: inyectamos el service (el "teléfono" a la cocina/backend)
  constructor(private bubbleTeaService: BubbleTeaService) {}

  // PASO 3: ngOnInit se ejecuta cuando la página se carga. Aquí arrancamos el trabajo.
  ngOnInit(): void {
    // PASO 4: pedimos los datos y nos suscribimos.
    // Cuando lleguen, los guardamos en la libreta.
    this.bubbleTeaService.getAll().subscribe((datos) => {
      // .set() mete los datos en la signal Y avisa a la pantalla para que repinte
      this.bubbleTeas.set(datos);
    });
  }

  // --- Métodos de acción (placeholders) ---
  // De momento solo imprimen en consola. La lógica real (navegar, borrar en el
  // backend...) NO es parte de este diseño visual, por eso quedan como TODO.

  /** Acción del botón "Crear nuevo bubble-tea". */
  protected crear(): void {
    // TODO: navegar al formulario de creación.
    console.log('Crear nuevo bubble tea');
  }

  /** Acción del botón "Ver detalles" de una tarjeta. */
  protected verDetalles(tea: BubbleTea): void {
    // TODO: navegar a la página de detalle de este bubble tea.
    console.log('Ver detalles:', tea);
  }

  /** Acción del botón "Editar" de una tarjeta. */
  protected editar(tea: BubbleTea): void {
    // TODO: navegar al formulario de edición de este bubble tea.
    console.log('Editar:', tea);
  }

  /** Acción del botón "Borrar" de una tarjeta. */
  protected borrar(tea: BubbleTea): void {
    // TODO: llamar al servicio para borrar y refrescar la lista.
    console.log('Borrar:', tea);
  }
}
