import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageFormConfig, FieldConfig, FormSubmission, PageUpdateRequest, Field } from '../types/page.types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = 'https://my-json-server.typicode.com/MosheHM/learning-angular-db';

  private http = inject(HttpClient);
  /**
   * Generic GET request method
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic PUT request method
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Get page data by page ID
   */
  getPageData(pageId: string, entityId: string): Observable<any> {
    return this.get(`pageData`).pipe(
      map((allData: any) => {
        const pageData = allData[pageId].id === entityId ? allData[pageId] : null;
        return pageData || null;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update page data
   */
  updatePageData(pageId: string, data: any): Observable<PageFormConfig> {
    return {} as Observable<PageFormConfig>;//mock implementation
  }

  /**
   * Get page data by page ID
   */
  getPageById(pageId: string): Observable<PageFormConfig> {
    return this.get<PageFormConfig>(pageId).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handling method
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}