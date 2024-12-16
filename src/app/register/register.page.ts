import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { GeoPoint } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = '';
  apellido: string = '';
  sexo: string = '';
  locacion: GeoPoint = new GeoPoint(0, 0); // Locación inicial

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      console.log('Intentando registrar al usuario...');
      const userCredential = await this.firebaseService.registerUserWithDetails(
        this.email,
        this.password,
        this.nombre,
        this.apellido,
        this.sexo,
        this.locacion
      );

      console.log('Usuario registrado exitosamente:', userCredential);
      this.router.navigate(['/login']); // Redirige al login después de registrarse
    } catch (error) {
      console.error('Error al registrar al usuario:', error);
    }
  }
}
