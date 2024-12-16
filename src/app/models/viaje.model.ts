import { Timestamp } from '@angular/fire/firestore';

export interface Viaje {
  id: string;
  costo: number;
  destino: { lat: number; lng: number }; // Ahora usamos un objeto con lat y lng
  cantPasajeros: number;
  patente: string;
  horaSalida: Timestamp;
  realizado: boolean;
  reservaciones: string[]; // Listado de usuarios que reservaron
  idCreador: string;
}
