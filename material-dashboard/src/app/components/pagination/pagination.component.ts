import { Component, EventEmitter, Input, Output } from '@angular/core';

import { pagination, params } from '../../commonModels';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() pagination: pagination;
  @Input() limit?: number;
  @Output() paramsEvent = new EventEmitter<params>();
  public limits = [5, 10, 25, 50, 100];

  constructor() { }

  public onPaginationChange(page: number) {
    this.paramsEvent.emit({
      limit: this.pagination.limit,
      page
    });
  }

  public selectLimit(event) {
    this.paramsEvent.emit({
      limit: event.target.value,
      page: 1
    });
  }
}
