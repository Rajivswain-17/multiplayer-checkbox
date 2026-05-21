
 export interface CheckBoxState {
    id: number;
    checked: boolean;
    lastClickedBy: string;
    lastClickedAt: Date;

 }

 export interface UserMap {
    [socketId: string]: string
 }

 export interface CooldownMap {
    [checkBoxId: number]: number
 }

 export interface checkboxChangePayload {
    id: number;
    checked: boolean
 }

 export interface ActivityLog {
    username: string;
    checkboxId: number;
    action: "checked" | "unchecked";
    timestamp: number;
 }