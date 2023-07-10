import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { params } from "../../commonModels";

@Injectable({
  providedIn: "root",
})
export class DesignationService {
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

  public getDesignationList(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/designation?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public addDesignation(data): Observable<any> {
    const endpoint = `${this.baseUrl}/designation`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  public deleteDesignation(id): Observable<any> {
    const endpoint = `${this.baseUrl}/designation/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }

  public updateDesignation(id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/designation/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
}
