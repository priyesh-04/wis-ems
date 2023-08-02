import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  formatDateToDDMMYYYY,
  getFormattedDate,
  getFormattedDatetime,
  getMaxDateTime,
  getMinDateTime,
  getTodayDateTime,
} from "../../utils/custom-validators";
import { EmployeeService } from "../../services/employee/employee.service";
import { ClientService } from "../../services/client/client.service";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MesgageService } from "../../services/shared/message.service";
import { SubmitModes } from "../utils/TimesheetConstants";
import { ListTimesheetComponent } from "../list-timesheet/list-timesheet.component";

@Component({
  selector: "app-add-timesheet",
  templateUrl: "./add-timesheet.component.html"
})
export class AddTimesheetComponent implements OnInit {
  public timesheetForm: FormGroup;
  public taskForm: FormGroup;
  public clientList = [];
  public taskList = [];
  public taskButton = "Save Task";
  public displayTaskform = true;
  public SubmitModes = SubmitModes;
  public minDateTime:string='';
  public maxDateTime:string='';

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    private _mesgageService: MesgageService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ListTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData,
  ) {}

  ngOnInit(): void {
    this.getClientList();
    this.minDateTime=getMinDateTime(1);
    this.maxDateTime=getMaxDateTime(1);

    const currentDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.timesheetForm = this.fb.group({
      date: [currentDate, [Validators.required]],
      in_time: [getTodayDateTime(), [Validators.required]],
      out_time: [getTodayDateTime()],
    });
    this.taskForm = this.fb.group({
      _id: [""],
      client: ["", [Validators.required]],
      project_name: ["", [Validators.required]],
      start_time: [getTodayDateTime(), [Validators.required]],
      end_time: [getTodayDateTime(), [Validators.required]],
      description: ["", [Validators.required]],
    });


    if (this.timesheetDialogData.mode === SubmitModes.MultipleEdit) {
      this.timesheetForm.get('out_time').addValidators(Validators.required);
      this.displayTaskform = false;
      this.taskList = this.timesheetDialogData.timesheetData.task_details;
      this.timesheetForm.patchValue({
        // date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        date: formatDateToDDMMYYYY(this.timesheetDialogData.timesheetData.date),
        // in_time: getFormattedDatetime(
        //   this.timesheetDialogData.timesheetData.in_time
        // ),
        in_time: new Date(this.timesheetDialogData.timesheetData.in_time).toISOString().slice(0, 16),
        _id : this.timesheetDialogData.timesheetData._id
      });
      if (this.timesheetDialogData.timesheetData.out_time) {
        this.timesheetForm.patchValue({
          // out_time: getFormattedDatetime(
          //   this.timesheetDialogData.timesheetData.out_time
          // ),
          out_time: new Date(this.timesheetDialogData.timesheetData.out_time).toISOString().slice(0, 16),
        });
      }
      this.timesheetForm.get('date').disable();
    }
  }

  private getClientList() {
    this._clientService.getClientList().subscribe(
      (res) => {
        this.clientList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch client list');
      }
    );
  }

  private getClientName(clientId: string) {
    const client = this.clientList.filter(value => { return value._id === clientId });
    return client.length ? client[0].company_name : '-';
  }

  public showAddTaskForm() {
    this.taskForm.reset();
    this.taskButton = "Save Task";
    this.displayTaskform = true;
  }

  public addNewTask() {
    const taskData = {
      _id: this.taskForm.value._id,
      client: this.taskForm.value.client,
      clientName: this.getClientName(this.taskForm.value.client),
      project_name: this.taskForm.value.project_name,
      start_time: this.taskForm.value.start_time +":00+05:30",
      end_time: this.taskForm.value.end_time + ":00+05:30",
      description: this.taskForm.value.description,
    };
    const index = this.taskList.findIndex(task => task._id === this.taskForm.value._id);
    if (index >= 0) {
      this.taskList[index] = taskData;
    } else {
      this.taskList.push(taskData);
    }
    this.displayTaskform = false;
    this.taskForm.reset();
  }

  public editTask(index) {
    const taskDetails = this.taskList[index];
    //console.log(taskDetails.start_time)
    this.taskForm.patchValue({
      _id: taskDetails._id,
      client: taskDetails.client._id ? taskDetails.client._id : taskDetails.client,
      project_name: taskDetails.project_name,
      start_time: new Date(taskDetails.start_time).toISOString().slice(0, 16),
      end_time: new Date(taskDetails.end_time).toISOString().slice(0, 16),
      description: taskDetails.description,
    });
    this.taskButton = "Update Task";
    this.displayTaskform = true;
  }

  public deleteTask(index) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Your Task",
        message: "Are you sure you want to delete this Task ?",
        index:index,
        callingFrom: "deleteTask",
      },
    });
    deleteDialogRef.afterClosed().subscribe(() => {
      this.taskList.splice(index, 1);      
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public submitTimesheetForm() {
    this.onSubmit(this.timesheetForm);
  }

  public onSubmit(timesheetForm: FormGroup) {
    if (this.displayTaskform) {
      this._mesgageService.showInfo(this.timesheetDialogData.mode === SubmitModes.MultipleEdit ? 'Update current task' : 'Save current task');
      return;
    } else if (!this.taskList.length) {
      this._mesgageService.showInfo('Complete atleast one task');
      return;
    }
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
      date: timeSheetFormData.date  +"T00:00:00+05:30",
      in_time: timeSheetFormData.in_time + ":00+05:30",
      out_time: timeSheetFormData.out_time + ":00+05:30",
      task_details: taskList,
    };
    console.log(myData);
    if (this.timesheetDialogData.mode === SubmitModes.MultipleEdit) {
      delete myData.date;
      this._employeeService.allEditTimesheet(this.timesheetDialogData.timesheetData._id, myData).subscribe(
        (res) => {
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    } else if (this.timesheetDialogData.mode === SubmitModes.MultipleAdd) {
      this._employeeService.addTimesheet(myData).subscribe(
        (res) => {
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
  
}
