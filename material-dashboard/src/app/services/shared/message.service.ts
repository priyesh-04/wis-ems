import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MesgageService {
  private toastConfig: object = {
    timeOut: 3000,
    progressBar: true,
  };

  constructor(
    private toastr: ToastrService,
  ) { }

  public showSuccess(message: string, title = 'Success!'): void {
    this.toastr.success(message, title, this.toastConfig);
  }

  public showError(message: string, title = 'Error!'): void {
    this.toastr.error(message, title, this.toastConfig);
  }

  public showInfo(message: string, title = 'Info!'): void {
    this.toastr.info(message, title, this.toastConfig);
  }
}
