import { Pipe, PipeTransform } from '@angular/core';
import { RoleInfo } from '../models/role-info';

@Pipe({
  name: 'sortRoles',
})
export class SortRolesPipe implements PipeTransform {
  transform(roles: RoleInfo[]): RoleInfo[] {
    return roles ? [...roles].sort((a, b) => a.position - b.position) : roles;
  }
}
