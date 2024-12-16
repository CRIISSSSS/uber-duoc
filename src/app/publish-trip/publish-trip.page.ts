import { Component } from '@angular/core';
import { MapQuestService } from 'src/app/services/mapquest.service';
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio de Firebase
import { Timestamp } from '@angular/fire/firestore'; // Importamos solo Timestamp

@Component({
  selector: 'app-publish-trip',
  templateUrl: './publish-trip.page.html',
  styleUrls: ['./publish-trip.page.scss'],
})
export class PublishTripPage {
  destinoInput = ''; // Entrada de texto para el destino
  suggestions: any[] = []; // Listado de sugerencias para autocompletar
  costo: number = 0; // Inicialización de costo
  cantPasajeros: number = 1; // Inicialización de cantidad de pasajeros (1 por defecto)
  patente: string = ''; // Inicialización de patente
  horaSalida: string = ''; // Inicialización de hora de salida
  destinoGeoPoint: { lat: number; lng: number } | null = null; // Usamos un objeto {lat, lng} en lugar de GeoPoint

  constructor(
    private mapQuestService: MapQuestService,
    private firebaseService: FirebaseService // Inyección del servicio de Firebase
  ) {}

  onSearch(event: any): void {
    const query = event.target.value;
    if (query.length < 3) {
      this.suggestions = [];
      return; // Salir si el texto es muy corto
    }

    console.log('Buscando sugerencias para la consulta:', query);

    this.mapQuestService.getSuggestions(query).subscribe({
      next: (data: any) => {
        if (data.results && data.results.length > 0) {
          this.suggestions = data.results[0].locations.map((location: any) => ({
            displayName: `${location.street}, ${location.adminArea5}, ${location.adminArea1}`,
            latLng: location.latLng, // Incluimos latitud y longitud
          }));

          console.log('Sugerencias obtenidas:', this.suggestions);
        } else {
          console.log('No se encontraron sugerencias');
          this.suggestions = [];
        }
      },
      error: (err) => {
        console.error('Error buscando sugerencias:', err);
        this.suggestions = [];
      },
    });
  }

  selectSuggestion(suggestion: any): void {
    this.destinoInput = suggestion.displayName; // Asignar la dirección seleccionada
    this.destinoGeoPoint = { lat: suggestion.latLng.lat, lng: suggestion.latLng.lng }; // Usamos un objeto { lat, lng }

    console.log('Destino seleccionado:', this.destinoInput);
    console.log('Latitud:', suggestion.latLng.lat, 'Longitud:', suggestion.latLng.lng);

    this.suggestions = []; // Limpiar sugerencias tras seleccionar
  }

  async publishTrip(): Promise<void> {
    if (!this.destinoGeoPoint) {
      console.error('Debe seleccionar un destino válido.');
      return;
    }
  
    const horaSalidaTimestamp = Timestamp.fromDate(new Date(this.horaSalida));
    const viaje = {
      id: Math.random().toString(36).substring(2), // Generar un ID único
      costo: this.costo,
      destino: this.destinoGeoPoint, // Aquí usamos el objeto con lat, lng
      cantPasajeros: this.cantPasajeros,
      patente: this.patente,
      horaSalida: horaSalidaTimestamp,
      realizado: false,
      reservaciones: [],
      idCreador: '', // Inicializamos idCreador
    };
  
    try {
      const user = this.firebaseService.getCurrentUser();
      if (!user) {
        console.error('Usuario no autenticado.');
        return;
      }
      viaje.idCreador = user.uid;
  
      console.log('Publicando el viaje con los siguientes detalles:', viaje);
      await this.firebaseService.publishTrip(viaje);
      console.log('Viaje publicado correctamente:', viaje);
    } catch (error) {
      console.error('Error al publicar el viaje:', error);
    }
  }
}
