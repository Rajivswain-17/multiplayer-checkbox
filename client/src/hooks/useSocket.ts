import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '../lib/socket';
import type {
  CheckboxData,
  ActivityLog,
  StateInit,
  CheckboxUpdated,
  CheckboxCooldown,
  ActivityNew,
  UserEvent,
  SocketError,
} from '../types/socket';

interface CooldownState {
  [id: number]: {
    remaining: number;
    total: number;
    message: string;
    timerId: ReturnType<typeof setTimeout>;
  };
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'cooldown' | 'error';
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [checkboxes, setCheckboxes] = useState<CheckboxData[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [cooldowns, setCooldowns] = useState<CooldownState>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cooldownTimersRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map());

  const addToast = useCallback((message: string, type: 'cooldown' | 'error' = 'cooldown') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  const joinRoom = useCallback((name: string) => {
    setUsername(name);
    socket.connect();
    socket.emit('user:join', name);
  }, []);

  const toggleCheckbox = useCallback((id: number, checked: boolean) => {
    socket.emit('checkbox:change', { id, checked });
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onStateInit(data: StateInit) {
      setCheckboxes(data.checkboxes);
      setActivityLogs(data.activityLogs.slice(0, 20));
      setIsJoined(true);
    }

    function onCheckboxUpdated(data: CheckboxUpdated) {
      setCheckboxes(prev =>
        prev.map(cb =>
          cb.id === data.id
            ? {
                ...cb,
                checked: data.checked,
                lastClickedBy: data.lastClickedBy,
                lastClickedAt: data.lastClickedAt,
              }
            : cb
        )
      );
    }

    function onCheckboxCooldown(data: CheckboxCooldown) {
      const { id, remaining, message } = data;

      // Clear existing timer for this id
      const existingTimer = cooldownTimersRef.current.get(id);
      if (existingTimer) {
        clearInterval(existingTimer);
      }

      // Set cooldown state
      const startTime = Date.now();
      const totalMs = remaining;

      setCooldowns(prev => ({
        ...prev,
        [id]: {
          remaining,
          total: totalMs,
          message,
          timerId: setTimeout(() => {}, 0), // placeholder
        },
      }));

      // Update progress every 50ms
      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const left = Math.max(0, totalMs - elapsed);

        if (left <= 0) {
          clearInterval(intervalId);
          cooldownTimersRef.current.delete(id);
          setCooldowns(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        } else {
          setCooldowns(prev => ({
            ...prev,
            [id]: {
              ...prev[id]!,
              remaining: left,
            },
          }));
        }
      }, 50);

      cooldownTimersRef.current.set(id, intervalId);

      addToast(message, 'cooldown');
    }

    function onActivityNew(data: ActivityNew) {
      setActivityLogs(prev => [data, ...prev].slice(0, 20));
    }

    function onUserJoined(data: UserEvent) {
      setOnlineCount(data.onlineCount);
    }

    function onUserLeft(data: UserEvent) {
      setOnlineCount(data.onlineCount);
    }

    function onError(data: SocketError) {
      setError(data.message);
      addToast(data.message, 'error');
      setTimeout(() => setError(null), 3000);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state:init', onStateInit);
    socket.on('checkbox:updated', onCheckboxUpdated);
    socket.on('checkbox:cooldown', onCheckboxCooldown);
    socket.on('activity:new', onActivityNew);
    socket.on('user:joined', onUserJoined);
    socket.on('user:left', onUserLeft);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state:init', onStateInit);
      socket.off('checkbox:updated', onCheckboxUpdated);
      socket.off('checkbox:cooldown', onCheckboxCooldown);
      socket.off('activity:new', onActivityNew);
      socket.off('user:joined', onUserJoined);
      socket.off('user:left', onUserLeft);
      socket.off('error', onError);

      // Clean up cooldown timers
      cooldownTimersRef.current.forEach(timer => clearInterval(timer));
      cooldownTimersRef.current.clear();
    };
  }, [addToast]);

  return {
    isConnected,
    isJoined,
    username,
    onlineCount,
    checkboxes,
    activityLogs,
    cooldowns,
    toasts,
    error,
    joinRoom,
    toggleCheckbox,
  };
}
