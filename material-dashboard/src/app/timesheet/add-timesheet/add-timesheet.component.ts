import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  getFormattedDate,
  getFormattedDatetime,
} from "../../utils/custom-validators";
import { EmployeeService } from "../../services/employee/employee.service";
import { TimesheetListComponent } from "../timesheet-list/timesheet-list.component";
import { ClientService } from "../../services/client/client.service";

@Component({
  selector: "app-add-timesheet",
  templateUrl: "./add-timesheet.component.html",
  styleUrls: ["./add-timesheet.component.css"],
})
export class AddTimesheetComponent implements OnInit {
  private currentDate: string;
  public timesheetForm: FormGroup;
  public taskForm: FormGroup;
  public clientList: any;
  public taskList = [];
  public taskButton = "Save Task";
  public displayTaskform = true;

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    private datepipe: DatePipe,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<TimesheetListComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData
  ) {}

  ngOnInit(): void {
    this.currentDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.getClientList();

    this.timesheetForm = this.fb.group({
      date: { disabled: true, value: this.currentDate },
      in_time: ["", [Validators.required]],
      out_time: ["", [Validators.required]],
    });
    this.taskForm = this.fb.group({
      _id: [""],
      client: ["", [Validators.required]],
      project_name: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.timesheetDialogData.mode === "all-edit") {
      this.displayTaskform = false;
      this.taskList = this.timesheetDialogData.timesheetData.task_details;
      console.log('this.taskList: ', this.taskList);
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
        _id : this.timesheetDialogData.timesheetData._id

      });      
    }
  }

  private getClientList() {
    this._clientService.getClientList().subscribe(
      (res) => {
        this.clientList = res.result;
      },
      (err) => {
        // Display proper error message here
      }
    );
  }

  private getClientName(clientId: string) {
    console.log('clientId: ', clientId);    
    const client = this.clientList.filter(value => { return value._id === clientId });
    return client.length ? client[0].company_name : '-';
  }

  public showAddTaskForm() {
    this.taskForm.reset();
    this.taskButton = "Save Task";
    this.displayTaskform = true;
    // document.getElementById("addTaskForm").classList.remove("d-none");
  }

  public addNewTask() {
    const taskData = {
      _id: this.taskForm.value._id,
      client: this.taskForm.value.client,
      clientName: this.getClientName(this.taskForm.value.client),
      project_name: this.taskForm.value.project_name,
      start_time: this.taskForm.value.start_time,
      end_time: this.taskForm.value.end_time,
      description: this.taskForm.value.description,
    };

    const index = this.taskList.findIndex(task => task._id === this.taskForm.value._id);
    if (index >= 0) {
      this.taskList[index] = taskData;
    } else {
      this.taskList.push(taskData);
    }
    this.displayTaskform = false;
    // document.getElementById("addTaskForm").classList.add("d-none");
    this.taskForm.reset();
  }

  public editTask(index) {
    const taskDetails = this.taskList[index];
    this.taskForm.patchValue({
      _id: taskDetails._id,
      client: taskDetails.client._id ? taskDetails.client._id : taskDetails.client,
      project_name: taskDetails.project_name,
      start_time: getFormattedDatetime(taskDetails.start_time),
      end_time: getFormattedDatetime(taskDetails.end_time),
      description: taskDetails.description,
    });
    this.taskButton = "Update Task";
    this.displayTaskform = true;
    // document.getElementById("addTaskForm").classList.remove("d-none");
  }

  public deleteTask(index) {
    this.taskList.splice(index, 1);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public submitTimesheetForm() {
    this.onSubmit(this.timesheetForm);
  }

  public onSubmit(timesheetForm: FormGroup) {
    const timeSheetFormData = timesheetForm.value;
    const taskList = [];
    this.taskList.forEach((task) => {
      taskList.push({
        client: task.client._id ? task.client._id : task.client,
        description: task.description,
        start_time: task.start_time,
        end_time: task.end_time,
        project_name: task.project_name,
      });
    });
    const myData = {
      date: this.currentDate,
      in_time: timeSheetFormData.in_time,
      out_time: timeSheetFormData.out_time,
      task_details: taskList,
    };
    console.log('myData: ', myData);    

    if (this.timesheetDialogData.mode === "all-edit") {
      delete myData.date;
      this._employeeService.allEditTimesheet(this.timesheetDialogData.timesheetData._id, myData).subscribe(
        (res) => {
          // Display proper response message here
          this.dialogRef.close("success");
        },
        (err) => {
          // Display proper error message here not alert message
          alert(err.error.detail);
        }
      );
    } else if (this.timesheetDialogData.mode === "add" || "Task-add") {
      this._employeeService.addTimesheet(myData).subscribe(
        (res) => {
          // Display proper response message here
          this.dialogRef.close("success");
        },
        (err) => {
          // Display proper error message here not alert message
          alert(err.error.detail);
        }
      );
    }
  }
}
