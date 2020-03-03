import { InjectionToken } from '@angular/core';
import { HttpParams } from '@angular/common/http';

export const HTTP_PARAMS = new InjectionToken<HttpParams>('httpParams');
