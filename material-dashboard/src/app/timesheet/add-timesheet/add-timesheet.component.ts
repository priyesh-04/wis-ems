import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  formatDateToDDMMYYYY,
  formatToDateTime,
  getMaxDate,
  getMaxDateTime,
  getMinDate,
  getMinDateTime,
  getTodayDateTime,
} from "../../utils/custom-validators";
import { EmployeeService } from "../../services/employee/employee.service";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MesgageService } from "../../services/shared/message.service";
import { SubmitModes } from "../utils/TimesheetConstants";
import { ListTimesheetComponent } from "../list-timesheet/list-timesheet.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-add-timesheet",
  templateUrl: "./add-timesheet.component.html"
})
export class AddTimesheetComponent implements OnInit, AfterViewInit {
  @ViewChild('endDate') endDate: ElementRef<HTMLInputElement>;
  public timesheetForm: FormGroup;
  public taskForm: FormGroup;
  public clientList = [];
  public taskList = [];
  public taskButton = "Save Task";
  public displayTaskform = true;
  public SubmitModes = SubmitModes;
  public minDateTime = '';
  public maxDateTime = '';
  public minDate = '';
  public maxDate = '';
  public isSubmitting = false;
  private lastUpdatedIndex = -1;

  constructor(
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ListTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getClientList();
    this.minDateTime = getMinDateTime(1);
    this.maxDateTime = getMaxDateTime(0);
    this.minDate = getMinDate(1);
    this.maxDate = getMaxDate(0);

    const currentDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.timesheetForm = this.fb.group({
      date: [currentDate, [Validators.required]],
      in_time: [getTodayDateTime(), [Validators.required]],
      out_time: [""],
    });
  
    this.taskForm = this.fb.group({
      _id: [""],
      client: ["", [Validators.required]],
      start_time: [getTodayDateTime(), [Validators.required]],
      end_time: [getTodayDateTime(), [Validators.required]],
      description: ["", [Validators.required]],
    });
  }

  ngAfterViewInit() {
    if (this.timesheetDialogData.mode === SubmitModes.MultipleEdit) {
      this.minDateTime = getMinDateTime(this.calculateDiff(this.timesheetDialogData.timesheetData.date));
      this.taskList = this.timesheetDialogData.timesheetData.task_details;    
      this.timesheetForm.patchValue({
        date: formatDateToDDMMYYYY(this.timesheetDialogData.timesheetData.date),
        in_time: formatToDateTime(this.timesheetDialogData.timesheetData.in_time ? this.timesheetDialogData.timesheetData.in_time : getTodayDateTime()),
        _id : this.timesheetDialogData.timesheetData._id
      });
      if (this.timesheetDialogData.timesheetData.out_time) {  
        this.timesheetForm.patchValue({          
          out_time: formatToDateTime(this.timesheetDialogData.timesheetData.out_time),
        });
        this.endDate.nativeElement.focus();
      }
      this.timesheetForm.get('date').disable();
      this.displayTaskform = this.taskList.length ? false : true;
    }
  }

  private calculateDiff(data){
    let date = new Date(data);
    let currentDate = new Date();

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    return days + 1;
  }

  private getClientList() {
    // this._clientService.getClientList().subscribe(
    //   (res) => {
    //     this.clientList = res.result;
    //   },
    //   (err) => {
    //     this._mesgageService.showError(err.error.message || 'Unable to fetch client list');
    //   }
    // );
    this._authService.getProfile().subscribe(
      (res) => {
        this.clientList = res.result.assigned_client;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch data');
      }
    );
  }

  private getClientName(clientId: string) {
    const client = this.clientList.filter(value => { return value._id === clientId });
    return client.length ? client[0].client_name : '-';
  }

  private isAlreadySubmittedThisDate() {
    const submittedDate = new Date(this.timesheetForm.value.date +"T00:00:00+05:30");
    let dateFound = false;
    this.timesheetDialogData.timesheetList.forEach(list => {
      const prevDate = new Date(list.date);
      prevDate.setHours(prevDate.getHours() + 5.5);
      if(prevDate.toDateString() === submittedDate.toDateString()) {
        dateFound = true;
      }
    });
    return dateFound;
  }

  public showAddTaskForm() {
    this.taskForm.reset();
    this.taskButton = "Save Task";
    this.displayTaskform = true;
    this.taskForm.get('start_time').setValue(getTodayDateTime());
    this.taskForm.get('end_time').setValue(getTodayDateTime());
  }

  public addNewTask() {
    const taskData = {
      _id: this.taskForm.value._id,
      client: this.taskForm.value.client,
      clientName: this.getClientName(this.taskForm.value.client),
      start_time: this.taskForm.value.start_time +":00+05:30",
      end_time: this.taskForm.value.end_time + ":00+05:30",
      description: this.taskForm.value.description,
    };
    if (this.lastUpdatedIndex > -1) {
      this.taskList[this.lastUpdatedIndex] = taskData;
    } else {
      this.taskList.push(taskData);
    }
    this.lastUpdatedIndex = -1;
    this.displayTaskform = false;
    this.taskForm.reset();
  }

  public editTask(index) {
    this.lastUpdatedIndex = index;
    const taskDetails = this.taskList[index];
    this.taskForm.patchValue({
      _id: taskDetails._id,
      client: taskDetails.client._id ? taskDetails.client._id : taskDetails.client,
      start_time:formatToDateTime(taskDetails.start_time),
      end_time: formatToDateTime(taskDetails.end_time),
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
    if (this.timesheetDialogData.mode === SubmitModes.MultipleAdd && this.isAlreadySubmittedThisDate()) {
      this._mesgageService.showError('You have already created a tasksheet.');
    } else {
      this.onSubmit(this.timesheetForm);
    }
  }

  public onSubmit(timesheetForm: FormGroup) {
    if (this.displayTaskform) {
      this._mesgageService.showInfo(this.timesheetDialogData.mode === SubmitModes.MultipleEdit ? 'Update current task' : 'Save current task');
      return;
    } else if (!this.taskList.length) {
      this._mesgageService.showInfo('Complete atleast one task');
      return;
    }
    this.isSubmitting = true;
    const timeSheetFormData = timesheetForm.value;
    const taskList = [];
    this.taskList.forEach((task) => {
      taskList.push({
        client: task.client._id ? task.client._id : task.client,
        description: task.description,
        start_time: task.start_time,
        end_time: task.end_time,
      });
    });
    const myData = {
      date:timeSheetFormData.date +"T09:00:00+05:30",
      in_time: timeSheetFormData.in_time + ":00+05:30",
      out_time: timeSheetFormData.out_time ? timeSheetFormData.out_time + ":00+05:30" : '',
      task_details: taskList,
    };

    if (this.timesheetDialogData.mode === SubmitModes.MultipleEdit) {
      delete myData.date;
      this._employeeService.allEditTimesheet(this.timesheetDialogData.timesheetData._id, myData).subscribe(
        (res) => {
          this.isSubmitting = false;
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this.isSubmitting = false;
          this._mesgageService.showError(err.error.message);
        }
      );
    } else if (this.timesheetDialogData.mode === SubmitModes.MultipleAdd) {
      this._employeeService.addTimesheet(myData).subscribe(
        (res) => {
          this.isSubmitting = false;
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this.isSubmitting = false;
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }

  

  







  
}
