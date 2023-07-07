export enum SubmitModes {
  MultipleAdd = 'multiple-add',
  MultipleEdit = 'multiple-edit',
  SingleAdd = 'single-add',
  SingleEdit = 'single-edit'
}

export type SubmitModesType =
  | SubmitModes.MultipleAdd
  | SubmitModes.MultipleEdit
  | SubmitModes.SingleAdd
  | SubmitModes.SingleEdit;
  
export enum EditStatus {
  New = 'New',
  Edited = 'Edited',
  Rejected = 'Rejected',
  Requested = 'Requested',
  Accepted = 'Accepted',
  Initial = 'Initial'
}