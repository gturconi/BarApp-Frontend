import { Observable, Subject } from 'rxjs';
import { EntityListResponse } from './entity.list.response';

export interface Dropdown {
  title: string;
  fields: Observable<EntityListResponse<any>>;
  defaultValue?: Observable<string>;
  isMultiple?: boolean;
}

export interface DropdownParam {
  title: string;
  fields: Subject<any>;
  defaultValue?: Subject<any>;
  isMultiple?: boolean;
}
