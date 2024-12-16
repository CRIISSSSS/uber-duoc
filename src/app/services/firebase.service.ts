import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, GeoPoint, collection, getDocs, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Viaje } from '../models/viaje.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)); // Correcto sin 'async'
  }

  // Registro de usuario con detalles adicionales
  async registerUserWithDetails(
    email: string, 
    password: string, 
    nombre: string, 
    apellido: string, 
    sexo: string, 
    locacion: GeoPoint
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log('Usuario creado en Firebase Authentication:', user);
  
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { uid: user.uid, email, nombre, apellido, sexo, locacion });
      console.log('Detalles del usuario guardados en Firestore');
      return userCredential;
    } catch (error) {
      console.error('Error al registrar al usuario:', error);
      throw error;
    }
  }
  
  async cancelReservation(viajeId: string, userId: string): Promise<void> {
    const tripDocRef = doc(this.firestore, `viajes/${viajeId}`);
    const tripDocSnapshot = await getDoc(tripDocRef);
    if (tripDocSnapshot.exists()) {
      const viaje = tripDocSnapshot.data() as Viaje;
      
      // Eliminar la reserva del usuario
      const updatedReservaciones = viaje.reservaciones.filter((id) => id !== userId);
      
      // Aumentar la cantidad de pasajeros
      const newCantPasajeros = viaje.cantPasajeros + 1;
  
      await updateDoc(tripDocRef, {
        reservaciones: updatedReservaciones,
        cantPasajeros: newCantPasajeros // Actualizar la cantidad de pasajeros disponibles
      });
      console.log('Reserva cancelada exitosamente');
    }
  }
  async getUserDetails(): Promise<any> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        return userDocSnapshot.data();
      } else {
        throw new Error('Detalles del usuario no encontrados');
      }
    } else {
      throw new Error('Usuario no autenticado');
    }
  }
  async deleteTrip(viajeId: string): Promise<void> {
    const tripDocRef = doc(this.firestore, `viajes/${viajeId}`);
    await deleteDoc(tripDocRef);  // Correcto
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  async publishTrip(viaje: Viaje): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.error('El usuario no está autenticado. No se puede publicar el viaje.');
      throw new Error('El usuario no está autenticado.');
    }

    const viajeRef = doc(this.firestore, 'viajes', viaje.id);

    try {
      if (!viaje.destino || typeof viaje.destino.lat !== 'number' || typeof viaje.destino.lng !== 'number') {
        throw new Error('Coordenadas inválidas para el destino');
      }

      await setDoc(viajeRef, {
        costo: viaje.costo,
        destino: viaje.destino,
        cantPasajeros: viaje.cantPasajeros,
        patente: viaje.patente,
        horaSalida: viaje.horaSalida,
        realizado: viaje.realizado,
        reservaciones: viaje.reservaciones,
        idCreador: currentUser.uid,
      });

      console.log('Viaje guardado correctamente en Firestore');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al guardar viaje en Firestore:', error);
      throw error;
    }
  }

  

  // Obtener viajes disponibles
  async getAvailableTrips(userId: string): Promise<Viaje[]> {
    try {
      const tripsCollectionRef = collection(this.firestore, 'viajes');
      const tripsSnapshot = await getDocs(tripsCollectionRef);
      const allTrips = tripsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Viaje;
      });
  
      // Filtramos los viajes para que el usuario no vea los que ya ha reservado
      const filteredTrips = allTrips.filter(trip => !trip.reservaciones.includes(userId));
  
      return filteredTrips;
    } catch (error) {
      console.error('Error al obtener los viajes:', error);
      throw error;
    }
  }

  async getTripsReservedByUser(userId: string): Promise<Viaje[]> {
    const tripsCollectionRef = collection(this.firestore, 'viajes');
    const querySnapshot = await getDocs(tripsCollectionRef);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Viaje))
      .filter(trip => trip.reservaciones.includes(userId));
  }

  async getTripsCreatedByUser(userId: string): Promise<Viaje[]> {
    const tripsCollectionRef = collection(this.firestore, 'viajes');
    const querySnapshot = await getDocs(tripsCollectionRef);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Viaje))
      .filter(trip => trip.idCreador === userId);
  }

  // Reservar un viaje
  async reserveTrip(viajeId: string): Promise<void> {
    try {
      const tripDocRef = doc(this.firestore, `viajes/${viajeId}`);
      const tripDocSnapshot = await getDoc(tripDocRef);
  
      if (tripDocSnapshot.exists()) {
        const viaje = tripDocSnapshot.data() as Viaje;
  
        if (viaje.reservaciones.length < viaje.cantPasajeros) {
          viaje.reservaciones.push(this.auth.currentUser?.uid || '');
  
          // Disminuir la cantidad de pasajeros
          const newCantPasajeros = viaje.cantPasajeros - 1;
  
          await updateDoc(tripDocRef, {
            reservaciones: viaje.reservaciones,
            cantPasajeros: newCantPasajeros // Actualizar el número de pasajeros disponibles
          });
  
          console.log('Reserva realizada exitosamente.');
        } else {
          throw new Error('No hay cupos disponibles.');
        }
      } else {
        throw new Error('Viaje no encontrado.');
      }
    } catch (error) {
      console.error('Error al reservar el viaje:', error);
      throw error;
    }
  }
}