import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  headers = {
    Authorization: 'Bearer ' + this.authService.getToken(),
  };

  private apiUrl = `${environment.apiUrl}/pokemons`;

  constructor() {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getList(queryparams: any): Observable<any> {
    return this.http.get(`${this.apiUrl}?${queryparams}`);
  }

  getTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/types`);
  }

  addFavorite(userId: string, pokemonId: string): Observable<any> {
    const apiUrl = `${environment.apiUrl}/auth`;
    return this.http.post(
      `${apiUrl}/favorites/${pokemonId}`,
      { userId },
      { headers: { ...this.headers } }
    );
  }

  removeFavorite(userId: string, pokemonId: string): Observable<any> {
    const apiUrl = `${environment.apiUrl}/auth`;
    return this.http.delete(`${apiUrl}/favorites/${pokemonId}`, {
      headers: { ...this.headers },
      body: { userId },
    });
  }

  getFavorites(userId: string): Observable<any> {
    const apiUrl = `${environment.apiUrl}/auth`;
    return this.http.get(`${apiUrl}/favorites/${userId}`, {
      headers: { ...this.headers },
    });
  }
}
