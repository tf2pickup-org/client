import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentsService } from './documents.service';
import { Document } from './models/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentResolver {
  constructor(private documentsService: DocumentsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Document> {
    const documentName = route.data.documentName ?? route.params.documentName;
    return this.documentsService.fetchDocument(documentName);
  }
}
