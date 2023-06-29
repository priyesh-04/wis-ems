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