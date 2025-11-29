import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private _server = '';
  private _baseUri = '';
  public _pageSize?: number;

  private get authHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  set(baseUri: string): void {
    this._baseUri = baseUri.startsWith('/')
      ? this._server + baseUri
      : baseUri;
  }

  post<T>(data?: any) {
    return this.http.post<T>(this._baseUri, data ? JSON.stringify(data) : {}, { headers: this.authHeaders })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
  }

  put<T>(data: any) {
    return this.http.put<T>(this._baseUri, JSON.stringify(data), { headers: this.authHeaders })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
  }

  delete<T = void>() {
    return this.http.delete<T>(this._baseUri, { headers: this.authHeaders })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
  }

  // Simple login post without token handling
  loginPost<T>(data: any) {
    return this.http.post<T>(this._baseUri, JSON.stringify(data), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  get() {
    return this.http.get(this._baseUri, { headers: this.authHeaders })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
  }
}
