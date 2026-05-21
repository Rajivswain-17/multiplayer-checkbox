// Socket event types for 1 Million Checkboxes

export interface CheckboxData {
  id: number;
  checked: boolean;
  lastClickedBy: string | null;
  lastClickedAt: string | null;
}

export interface ActivityLog {
  username: string;
  checkboxId: number;
  action: 'checked' | 'unchecked';
  timestamp: string;
}

export interface StateInit {
  checkboxes: CheckboxData[];
  activityLogs: ActivityLog[];
  totalCheckboxes: number;
}

export interface CheckboxUpdated {
  id: number;
  checked: boolean;
  lastClickedBy: string;
  lastClickedAt: string;
  cooldownMs: number;
}

export interface CheckboxCooldown {
  id: number;
  remaining: number;
  message: string;
}

export interface ActivityNew {
  username: string;
  checkboxId: number;
  action: 'checked' | 'unchecked';
  timestamp: string;
}

export interface UserEvent {
  username: string;
  onlineCount: number;
}

export interface SocketError {
  message: string;
}

export interface CheckboxChangePayload {
  id: number;
  checked: boolean;
}

// Server -> Client events
export interface ServerToClientEvents {
  'state:init': (data: StateInit) => void;
  'checkbox:updated': (data: CheckboxUpdated) => void;
  'checkbox:cooldown': (data: CheckboxCooldown) => void;
  'activity:new': (data: ActivityNew) => void;
  'user:joined': (data: UserEvent) => void;
  'user:left': (data: UserEvent) => void;
  'error': (data: SocketError) => void;
}

// Client -> Server events
export interface ClientToServerEvents {
  'user:join': (username: string) => void;
  'checkbox:change': (data: CheckboxChangePayload) => void;
}
