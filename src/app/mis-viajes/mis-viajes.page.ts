import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Viaje } from '../models/viaje.model';
import { MapQuestService } from 'src/app/services/mapquest.service';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  viajesCreados: Viaje[] = [];
  direcciones: string[] = [];

  constructor(private firebaseService: FirebaseService, private mapQuestService: MapQuestService) {}

  async ngOnInit() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.viajesCreados = await this.firebaseService.getTripsCreatedByUser(user.uid);

      // Obtener las direcciones de los viajes creados
      this.viajesCreados.forEach(async (viaje, index) => {
        const direccion = await this.mapQuestService.getAddressFromCoordinates(viaje.destino.lat, viaje.destino.lng).toPromise();
        this.direcciones[index] = direccion || 'Dirección desconocida';
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  // Método para eliminar el viaje
  async cancelarViaje(viajeId: string) {
    try {
      await this.firebaseService.deleteTrip(viajeId);
      console.log('Viaje eliminado exitosamente');
      this.ngOnInit(); // Vuelve a cargar los viajes después de eliminar
    } catch (error) {
      console.error('Error al eliminar el viaje:', error);
    }
  }
}
