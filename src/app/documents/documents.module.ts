import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { RulesComponent } from './rules/rules.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [RulesComponent],
  imports: [CommonModule, DocumentsRoutingModule, MarkdownModule.forChild()],
})
export class DocumentsModule {}
