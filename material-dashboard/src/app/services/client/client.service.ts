import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

import { params } from "../../commonModels";

@Injectable({
  providedIn: "root",
})
export class ClientService {
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

  public addClient(data: any): Observable<any> {
    const endpoint = `${this.baseUrl}/client`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  public getClientList(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/client?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public updateClient(id, data: any): Observable<any> {
    const endpoint = `${this.baseUrl}/client/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }

  public deleteClient(id): Observable<any> {
    const endpoint = `${this.baseUrl}/client/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }
}
