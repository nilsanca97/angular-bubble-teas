import { Component, OnInit, signal } from '@angular/core'; // → la "interfaz" que nos da el momento ngOnInit. signal → caja reactiva que avisa a la pantalla.
import { BubbleTea } from '../../models/interfaces'; // → la interface (BubbleTea), para tipar la libreta.
import { BubbleTeaService } from '../../services/bubble-tea.service';

@Component({
  selector: 'app-home',
  imports: [],
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
}
