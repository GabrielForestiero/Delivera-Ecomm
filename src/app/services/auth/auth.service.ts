import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  address: string;
  phone: string;
  cartId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private userUrl = `${environment.apiBaseUrl}/api/user`;
  private tokenKey = 'auth_token';

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkStoredToken();
  }

  initializeUser() {
    const token = this.getToken();

    if (!token) {
      this.logout();
      return;
    }

    const headers = this.getAuthHeaders();

    this.http.get<User>(this.userUrl, { headers }).subscribe({
      next: user => {
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      },
      error: () => {
        this.logout();
      }
    });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      switchMap(response =>
        this.fetchUserProfile().pipe(
          map(() => response),
          catchError(err => {
            this.logout();
            return throwError(() => err);
          })
        )
      )
    );
  }

  private fetchUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(this.userUrl, { headers }).pipe(
      tap(user => this.userSubject.next(user)),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }


  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('searchName');
    localStorage.removeItem('selectedCategory');
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkStoredToken() {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      this.fetchUserProfile().subscribe({
        next: (user) => {
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => this.logout()
      });
    } else {
      this.isAuthenticatedSubject.next(false);
      this.userSubject.next(null);
    }
  }

  isAdmin(): boolean {
    const user = this.userSubject.getValue();
    return user?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, { headers }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      switchMap(response =>
        this.fetchUserProfile().pipe(
          map(() => response),
          catchError(err => {
            this.logout();
            return throwError(() => err);
          })
        )
      )
    );
  }


  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'x-api-key': 'my-secret-api-key',
      'Content-Type': 'application/json'
    });
  }
}