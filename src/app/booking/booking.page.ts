import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Viaje } from '../models/viaje.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  viajes: Viaje[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit() {
    this.loadTrips();
  }

  async loadTrips() {
    try {
      const user = this.firebaseService.getCurrentUser(); // Obtener usuario autenticado
      if (user) {
        this.viajes = await this.firebaseService.getAvailableTrips(user.uid); // Pasar el userId como parámetro
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
    }
  }

  async reservar(viajeId: string) {
    try {
      await this.firebaseService.reserveTrip(viajeId);
      console.log('Reserva exitosa');
      this.router.navigate(['/mis-reservas']);
    } catch (error) {
      console.error('Error al reservar el viaje:', error);
    }
  }
}
