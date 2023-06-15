import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
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

  addNewEmployee(userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/create-user/`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  updateEmployee(id: string, userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/user/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, userData, httpOptions);
  }

  getAllEmployees(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-employee`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  getAllAdmins(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-admin`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  addTimesheet(data): Observable<any> {
    console.log(data, "service data");
    const endpoint = `${this.baseUrl}/timesheet`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  getTimesheet(userID): Observable<any> {
    // console.log(userID, "service data");
    const endpoint = `${this.baseUrl}/timesheet/user/${userID}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  updateTimesheet(taskID, data): Observable<any> {
    // console.log(data, "service data");
    const endpoint = `${this.baseUrl}/timesheet/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
  
  deleteSingleTask(timesheet_id, tasksheet_id, data): Observable<any> {
    console.log(data, "delete service data");
    const endpoint = `${this.baseUrl}/timesheet/single-task/${timesheet_id}/${tasksheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }
}
