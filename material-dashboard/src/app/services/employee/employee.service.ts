import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

import { params } from "../../commonModels";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
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

  public addNewEmployee(userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/create-user/`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  public updateEmployee(id: string, userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/user/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, userData, httpOptions);
  }

  public getAllEmployees(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-employee?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }
  public employeeStatus(id, is_active): Observable<any> {
    const endpoint = `${this.baseUrl}/user/active-deactive/${id}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, {is_active: !is_active}, httpOptions);
  }

  public getAllEmployeesSpendTime(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/user/user-spend-time?start_date=&end_date=&limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public getAllAdmins(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-admin?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public addTimesheet(data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  public allEditTimesheet(timesheet_id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }

  public addSingleTask(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, data, httpOptions);
  }

  public getTimesheet(userID: string, startDate: string, endDate: string, clientid:string='', page = 1, limit = 10): Observable<any> {
    let endpoint='';
    if(clientid){
    endpoint = `${this.baseUrl}/timesheet/task-details/user/${userID}?start_date=${startDate}&end_date=${endDate}&limit=${limit}&page=${page}&clientid=${clientid}`;
    }else{
    endpoint = `${this.baseUrl}/timesheet/task-details/user/${userID}?start_date=${startDate}&end_date=${endDate}&limit=${limit}&page=${page}`;
    }
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

 

  public updateTimesheet(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }

  public updateSingleTask(taskID, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${taskID}`;
    const httpOptions = this.createHeaders();
    return this.http.put(endpoint, data, httpOptions);
  }
  
  public deleteSingleTask(timesheet_id, tasksheet_id, data): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/single-task/${timesheet_id}/${tasksheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.delete(endpoint, httpOptions);
  }

  public editReqAdmin(timesheet_id, reason): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/edit-req/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, {edit_status:'Requested', reason}, httpOptions);
  }

  public allEditReqAdmin(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/get-all-edit-req-sheet?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public actionAdmin(timesheet_id, isApprove): Observable<any> {
    const endpoint = `${this.baseUrl}/timesheet/active-deactive/${timesheet_id}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, {edit_status:`${isApprove}`}, httpOptions);
  }  

  public getAllEmployeesFromThirdParty(params?: params): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-third-party-user?limit=${params ? params.limit : ''}&page=${params ? params.page : ''}`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }


  ///////////////////////////////////////////////////////////////////
  public getAllEmployeeWithoutPagination(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/all-employee-without-pagination`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public getAllEmployeeSpendTimeWithoutPagination(): Observable<any> {
    const endpoint = `${this.baseUrl}/user/user-spend-time-without-pagination`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }
}