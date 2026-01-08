export enum EscalationState {
  IDLE = 'IDLE',
  CHECK_IN = 'CHECK_IN',
  ALERT_PRIMARY = 'ALERT_PRIMARY',
  ALERT_SECONDARY = 'ALERT_SECONDARY',
  RESOLVED = 'RESOLVED'
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY';
}

export interface EscalationConfig {
  checkInDuration: number; // seconds
  primaryAlertDuration: number; // seconds
}

export interface AlertLog {
  timestamp: Date;
  state: EscalationState;
  message: string;
}