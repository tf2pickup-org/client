import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '@app/api-url';
import { Observable } from 'rxjs';
import { Document } from './models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchDocument(name: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/documents/${name}`);
  }

  saveDocument(name: string, body: string): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/documents/${name}`, {
      name,
      body,
      language: 'en',
    });
  }

}
