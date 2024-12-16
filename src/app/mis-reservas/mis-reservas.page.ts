import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { MapQuestService } from '../services/mapquest.service'; 
import { Viaje } from '../models/viaje.model';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.page.html',
  styleUrls: ['./mis-reservas.page.scss'],
})
export class MisReservasPage implements OnInit {
  misReservas: Viaje[] = [];
  direcciones: string[] = [];

  constructor(private firebaseService: FirebaseService, private mapQuestService: MapQuestService) {}

  async ngOnInit() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.misReservas = await this.firebaseService.getTripsReservedByUser(user.uid);
      
      // Llamar a tu método para obtener las direcciones
      this.misReservas.forEach(async (reserva, index) => {
        const direccion = await this.mapQuestService.getAddressFromCoordinates(reserva.destino.lat, reserva.destino.lng).toPromise();
        this.direcciones[index] = direccion || 'Dirección desconocida';
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  // Método para cancelar la reserva
  async cancelarReserva(viajeId: string) {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      try {
        await this.firebaseService.cancelReservation(viajeId, user.uid);
        console.log('Reserva cancelada exitosamente');
        // Volver a cargar las reservas después de cancelar
        this.misReservas = await this.firebaseService.getTripsReservedByUser(user.uid);
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
      }
    }
  }
}
