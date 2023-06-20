import { Component, Inject, OnInit } from "@angular/core";
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
  timesheetForm: FormGroup;
  taskForm: FormGroup;
  timesheetData: any;
  clientList: any;
  selectedClient: any;
  taskList = [];
  taskButton = "Add Task";

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<TimesheetListComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData
  ) {}

  ngOnInit(): void {
    this.timesheetForm = this.fb.group({
      date: ["", [Validators.required]],
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

    if (this.timesheetDialogData.mode === "edit") {
      this.getClientList();
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.selectedClient = taskDetails.client._id;
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
      });
      this.taskForm.patchValue({
        client: taskDetails.client._id,
        project_name: taskDetails.project_name,
        start_time: getFormattedDatetime(taskDetails.start_time),
        end_time: getFormattedDatetime(taskDetails.end_time),
        description: taskDetails.description,
      });
    } else if (this.timesheetDialogData.mode === "all-edit") {

      this.getClientList();      
      this.taskList = this.timesheetDialogData.timesheetData.task_details;
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
    } else if (this.timesheetDialogData.mode === "add") {
      this.getClientList();
    } else if (this.timesheetDialogData.mode === "single-Task-add") {
      this.getClientList();     
    } else if (this.timesheetDialogData.mode === "Task-add") {
      this.getClientList();
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
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
    const client = this.clientList.filter(value => { return value._id === clientId });
    return client.length ? client[0].client_name : '-';
  }

  public showAddTaskForm() {
    this.taskForm.reset();
    this.taskButton = "Save Task";
    document.getElementById("addTaskForm").classList.remove("d-none");
  }

  public addNewTask() {
    const taskData = {
      _id: this.taskForm.value._id,
      client: this.getClientName(this.taskForm.value.client),
      project_name: this.taskForm.value.project_name,
      start_time: this.taskForm.value.start_time,
      end_time: this.taskForm.value.end_time,
      description: this.taskForm.value.description,
    };
    if (this.taskForm.value._id) {
      taskData["_id"] = this.taskForm.value._id;
    } else {
      taskData["_id"] = this.taskList.length;
    }
    if (this.taskList.find((task) => task._id === taskData._id)) {
      this.taskList[taskData._id] = taskData;
    } else {
      this.taskList.push(taskData);
    }
    document.getElementById("addTaskForm").classList.add("d-none");
    this.taskForm.reset();
  }

  public editTask(index) {
    const taskDetails = this.taskList[index];
    this.selectedClient = taskDetails.client;
    this.taskForm.patchValue({
      _id: taskDetails._id,
      client: taskDetails.client,
      project_name: taskDetails.project_name,
      start_time: getFormattedDatetime(taskDetails.start_time),
      end_time: getFormattedDatetime(taskDetails.end_time),
      description: taskDetails.description,
    });
    this.taskButton = "Update Task";
    document.getElementById("addTaskForm").classList.remove("d-none");
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
    this.timesheetData = timesheetForm.value;
    this.taskList.forEach((task) => {
      delete task._id;
    });
    const myData = {
      date: this.timesheetData.date,
      in_time: this.timesheetData.in_time,
      out_time: this.timesheetData.out_time,
      task_details: this.taskList,
    };

    if (this.timesheetDialogData.mode === "edit") {
      // delete myData.date;
      // delete myData.in_time;
      // delete myData.out_time;
      myData.task_details[0]["_id"] = this.timesheetDialogData.taskID;
      this._employeeService
        .updateTimesheet(this.timesheetDialogData.taskID, myData)
        .subscribe(
          (res) => {
            // Display proper response message here
            this.dialogRef.close("success");
          },
          (err) => {
            // Display proper error message here not alert message
            alert(err.error.detail);
          }
        );
    } else if (this.timesheetDialogData.mode === "all-edit") {
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
    } else if (this.timesheetDialogData.mode === "single-Task-add") {      
      this._employeeService.addSingleTask(this.timesheetDialogData.taskID, myData).subscribe(
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
