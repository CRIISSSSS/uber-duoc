import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; // IMPORTANTE: Esto es lo que faltaba

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    
    HttpClientModule,  // Asegúrate de que esta línea esté presente
  ],
  providers: [
    ...firebaseProviders, 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
