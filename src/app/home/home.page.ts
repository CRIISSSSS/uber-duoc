import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { User } from '@angular/fire/auth'; // Asegúrate de importar User
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string | null = null; // Definir la propiedad 'userName'

  constructor(private firebaseService: FirebaseService,  private router: Router) {}

  ngOnInit() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      // Intentamos obtener el displayName o el nombre desde Firestore si no está definido
      this.userName = user.displayName || 'Invitado'; 
      if (!user.displayName) {
        // Si el displayName no está disponible, intentamos obtenerlo de Firestore
        this.loadUserDetails();
      }
    } else {
      this.userName = 'Invitado'; // Usuario no autenticado
  }
}
  logout() {
    this.firebaseService.logout().subscribe(() => {
      console.log('Sesión cerrada');
      this.router.navigate(['/login']); // Redirigir a la pantalla de login
    });
  }
  async loadUserDetails() {
    try {
      const userDetails = await this.firebaseService.getUserDetails();
      this.userName = userDetails.nombre || 'Invitado';  // Usamos el nombre desde Firestore
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
    }
  }
}