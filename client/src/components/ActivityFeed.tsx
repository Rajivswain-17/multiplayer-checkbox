import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActivityLog } from '../types/socket';

interface ActivityFeedProps {
  logs: ActivityLog[];
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top on new activity
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <aside className="app-sidebar" id="activity-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span style={{ marginRight: '6px' }}>⚡</span>
          Live Activity
        </div>
      </div>

      <div className="activity-list" ref={listRef}>
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            const key = `${log.username}-${log.checkboxId}-${log.timestamp}-${index}`;
            const time = formatTime(log.timestamp);
            const isChecked = log.action === 'checked';

            return (
              <motion.div
                key={key}
                className="activity-item"
                initial={{ opacity: 0, x: -30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                layout
              >
                <div className="activity-username">{log.username}</div>
                <div className="activity-action">
                  <span
                    className={`activity-badge ${
                      isChecked ? 'activity-badge-checked' : 'activity-badge-unchecked'
                    }`}
                  >
                    {isChecked ? '✓' : '✗'} #{log.checkboxId}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6875rem' }}>
                    {isChecked ? 'checked' : 'unchecked'}
                  </span>
                </div>
                <div className="activity-time">{time}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {logs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
            }}
          >
            No activity yet...
            <br />
            <span style={{ fontSize: '0.75rem' }}>Start clicking checkboxes!</span>
          </motion.div>
        )}
      </div>
    </aside>
  );
}

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}
