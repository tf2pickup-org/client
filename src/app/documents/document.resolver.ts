import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentsService } from './documents.service';
import { Document } from './models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentResolver implements Resolve<Document> {

  constructor(
    private documentsService: DocumentsService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Document> {
    return this.documentsService.fetchDocument(route.data.documentName);
  }
}
