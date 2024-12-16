import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  userName: string = ''; // Para almacenar el nombre de usuario si lo necesitas

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async login() {
    try {
      // Eliminamos el .toPromise() y usamos await directamente
      const userCredential = await this.firebaseService.login(this.email, this.password);

      // Si el login es exitoso, accedemos al usuario autenticado
      const user = userCredential.user;
      console.log('Usuario autenticado:', user);

      // Verificamos que el usuario esté autenticado
      if (user) {
        // Opcional: Podemos almacenar el nombre de usuario o cualquier otra propiedad si lo deseamos
        this.userName = user.displayName || 'Usuario sin nombre';
        console.log(`Bienvenido, ${this.userName}`);

        // Redirigimos al usuario a la página principal después del login exitoso
        this.router.navigate(['/home']);
      }
    } catch (error) {
      // Si ocurre algún error, lo mostramos en consola
      console.error('Error al iniciar sesión:', error);
    }
  }
  
}

