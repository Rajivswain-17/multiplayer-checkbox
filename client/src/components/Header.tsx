import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onlineCount: number;
}

export function Header({ onlineCount }: HeaderProps) {
  return (
    <header className="app-header" id="app-header">
      <div className="header-title">
        <span className="header-title-accent">1M</span> Checkboxes
      </div>

      <div className="header-online">
        <span className="online-dot" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={onlineCount}
            initial={{ y: -12, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--color-accent-green)',
              display: 'inline-block',
              minWidth: '20px',
              textAlign: 'right',
            }}
          >
            {onlineCount}
          </motion.span>
        </AnimatePresence>
        <span>users online</span>
      </div>
    </header>
  );
}
