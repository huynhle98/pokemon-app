import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  signup(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, password });
  }

  setToken(token: string): void {
    if (!token) return;
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || token === 'undefined' || token === 'null') return false;

    return !this.isTokenExpired(token); // Return false if expired, true if not
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp; // expiration time from token (in seconds)
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return expirationTime < currentTime;
    } catch (error) {
      return false; // If decoding fails, assume the token is invalid or malformed
    }
  }

  getProfile(): any {
    const token = this.getToken();
    if (!token || token === 'undefined' || token === 'null') return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      return null; // If decoding fails, assume the token is invalid or malformed
    }
  }
}
