import { GeoPoint } from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  sexo: string;
  locacion: GeoPoint;
}