import { Component, OnInit, Input} from '@angular/core';
// import { LoaderService } from '../../services/global-loader/loader.service';
export interface pageLoader {
  isLoading: boolean;
}
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})

export class PageLoaderComponent implements OnInit {
  @Input()pageLoader: pageLoader;
 
  constructor() { }

  ngOnInit(): void {
  }

}
