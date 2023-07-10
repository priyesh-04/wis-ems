import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { pagination, params } from '../../commonModels';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() pagination: pagination;
  @Input() limit?: number;
  @Output() paramsEvent = new EventEmitter<params>();
  public limits = [5, 10, 25, 50, 100];

  constructor() { }

  ngOnChanges(): void {
    console.log('pagination: ', this.pagination);    
  }

  public onPaginationChange(page: number) {
    this.paramsEvent.emit({
      limit: 5,
      page
    });
  }

  public selectLimit(event) {
    this.paramsEvent.emit({
      limit: event.target.value,
      page: this.pagination.current_page
    });
  }
}
