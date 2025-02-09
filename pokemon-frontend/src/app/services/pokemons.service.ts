import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private http = inject(HttpClient);

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
}
