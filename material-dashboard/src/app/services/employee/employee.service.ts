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

  getAllEmployeesSpendTime(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/user-spend-time?start_date=&end_date=`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  getAllAdmins(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-admin`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  addTimesheet(data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  allEditTimesheet(timesheet_id, data): Observable<any> {
    console.log(data , '2222');
    
    const endpoint = `${this.baseUrl}/timesheet/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
  addSingleTask(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  getTimesheet(userID: string, startDate: string, endDate: string, page = 1, limit = 10): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/task-details/user/${userID}?start_date=${startDate}&end_date=${endDate}&limit=${limit}&page=${page}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  updateTimesheet(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }

  updateSingleTask(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
  
  deleteSingleTask(timesheet_id, tasksheet_id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${timesheet_id}/${tasksheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }

  editReqAdmin(timesheet_id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/edit-req/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, {edit_status:'Requested'}, httpOptions);
  }
  allEditReqAdmin(): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/get-all-edit-req-sheet`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }
  actionAdmin(timesheet_id, isApprove): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/active-deactive/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, {edit_status:`${isApprove}`}, httpOptions);
  }  
}