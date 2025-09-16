import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { PageFormConfig } from '../types/page.types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = 'https://my-json-server.typicode.com/MosheHM/learning-angular-db';

  private http = inject(HttpClient);
  /**
   * Generic GET request method
   */
  get<T>(endpoint: string) {
    return lastValueFrom(this.http.get<T>(`${this.baseUrl}/${endpoint}`));
  }

  /**
   * Get page data by page ID
   */
  getPageData(pageId: string, entityId: string) {
    return this.get(`pageData`).then(((allData: any) => {
        const pageData = allData[pageId].id === entityId ? allData[pageId] : null;
        return pageData || null;
      })
    ).catch(this.handleError);
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
  getPageById(pageId: string): Promise<PageFormConfig> {
    return this.get<PageFormConfig>(pageId).catch(this.handleError);
  }

  /**
   * Error handling method
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
}