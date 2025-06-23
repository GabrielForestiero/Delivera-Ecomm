import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    address: string;
    phone: string;
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);

  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStoredToken();
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.userSubject.next(response.user);
          }
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.userSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkStoredToken(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.userSubject.next({ authenticated: true });
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });
  }

  getCurrentUser(): Observable<any> {
    return this.user$;
  }
}
