import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

import { params } from "../../commonModels";

@Injectable({
    providedIn: "root",
})
export class HolidaysService {
    private baseUrl = environment.base_api_url;
  
    constructor(private http: HttpClient) {}

    private createHeaders(token?: string) {
      const data = {
        "Content-Type": "application/json",
      };
      if (token) {
        data["Authorization"] = `Bearer ${token}`;
      }
      const httpOptions = {
        headers: new HttpHeaders(data),
      };
      return httpOptions;
    }

    public getHolidaysList(params?: params): Observable<any> {
      const endpoint = `${this.baseUrl}/holiday?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
      const httpOptions = this.createHeaders();
      return this.http.get(endpoint, httpOptions);
    }

    public deleteHoliday(id): Observable<any> {
      const endpoint = `${this.baseUrl}/holiday/${id}`;
      const httpOptions = this.createHeaders();
      return this.http.delete(endpoint, httpOptions);
    }

    public addHoliday(data): Observable<any> {
      const endpoint = `${this.baseUrl}/holiday`;
      const httpOptions = this.createHeaders();
      return this.http.post(endpoint, data, httpOptions);
    }
    
    public updateHoliday(id, data): Observable<any> {
      const endpoint = `${this.baseUrl}/holiday/${id}`;
      const httpOptions = this.createHeaders();
      return this.http.put(endpoint, data, httpOptions);
    }
}