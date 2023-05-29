import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DesignationService {
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

  getDesignationList(): Observable<any> {
    const endpoint = `${this.baseUrl}/designation`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  addDesignation(data): Observable<any> {
    const endpoint = `${this.baseUrl}/designation`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  deleteDesignation(id): Observable<any> {
    const endpoint = `${this.baseUrl}/designation/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }

  updateDesignation(id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/designation/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
}
