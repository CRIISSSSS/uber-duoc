import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapQuestService {
  private baseUrl = 'https://www.mapquestapi.com/geocoding/v1/address';
  private apiKey = 'Q7JK8WIfRGhMUtmQgKuhkILJlgjcSCfP';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene sugerencias de direcciones basadas en la búsqueda del usuario.
   */

  getAddressFromCoordinates(lat: number, lng: number): Observable<string> {
    const url = `${this.baseUrl}/reverse?key=${this.apiKey}&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log('Respuesta de MapQuest:', response);
        const location = response.results[0]?.locations[0];
        if (location && location.street && location.adminArea5 && location.adminArea1) {
          return location.street + ', ' + location.adminArea5 + ', ' + location.adminArea1; 
        } else {
          return 'Dirección desconocida o no disponible para las coordenadas proporcionadas.';
        }
      }),
      catchError((error) => {
        console.error('Error al obtener dirección:', error);
        return of('Error al obtener la dirección');
      })
    );
  }
  getSuggestions(query: string): Observable<any> {
    if (!query || query.trim().length === 0) {
      return of([]); // Retorna un array vacío si no hay texto
    }

    const url = `${this.baseUrl}?key=${this.apiKey}&location=${encodeURIComponent(query)}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error al buscar sugerencias:', error);
        return of([]); // Maneja errores devolviendo un array vacío
      })
    );
  }
}
