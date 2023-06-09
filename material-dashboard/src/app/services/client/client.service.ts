import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  baseUrl = environment.base_api_url;

  constructor(private http: HttpClient) {}

  createHeaders(token?: string) {
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

  addClient(data: any): Observable<any> {
    const endpoint = `${this.baseUrl}/client`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  getClientList(): Observable<any> {
    const endpoint = `${this.baseUrl}/client`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  updateClient(id, data: any): Observable<any> {
    const endpoint = `${this.baseUrl}/client/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }

  deleteClient(id): Observable<any> {
    const endpoint = `${this.baseUrl}/client/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }
}
