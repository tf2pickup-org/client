import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesComponent } from './rules/rules.component';
import { DocumentResolver } from './document.resolver';
import { Documents } from './documents';

const routes: Routes = [
  {
    path: 'rules',
    component: RulesComponent,
    data: {
      documentName: Documents.rules,
      animation: 'RulesPage',
      title: 'rules',
    },
    resolve: {
      document: DocumentResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
