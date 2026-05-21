import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

interface JoinScreenProps {
  onlineCount: number;
  onJoin: (username: string) => void;
}

export function JoinScreen({ onlineCount, onJoin }: JoinScreenProps) {
  const [name, setName] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="join-container">
      {/* Animated Background */}
      <div className="animated-bg" />
      <div className="grid-bg" />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'rgba(34, 197, 94, 0.15)'
              : 'rgba(20, 184, 166, 0.12)',
            zIndex: 0,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), -20 * (i % 2 === 0 ? -1 : 1), 0],
            y: [0, -40 * (i % 2 === 0 ? 1 : -1), 25 * (i % 2 === 0 ? -1 : 1), 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{
            top: `${15 + i * 13}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      <motion.form
        onSubmit={handleSubmit}
        className="join-card glass-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}
          animate={{ rotate: isHovering ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(20, 184, 166, 0.2))',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ☑
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="join-title" style={{ textAlign: 'center' }}>
          <span className="join-title-accent">1 Million</span>
          <br />
          Checkboxes
        </h1>

        <p className="join-subtitle" style={{ textAlign: 'center' }}>
          Click. Check. Compete. In real time.
        </p>

        {/* Online Badge */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="online-badge">
            <span className="online-dot" />
            <AnimatedNumber value={onlineCount} /> users online
          </div>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <input
            id="username-input"
            type="text"
            className="join-input"
            placeholder="Enter your username..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
            autoComplete="off"
          />
        </motion.div>

        {/* Join Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <button
            id="join-btn"
            type="submit"
            className="join-btn"
            disabled={!name.trim()}
          >
            Join the Grid
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '20px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          30×30 grid • Real-time sync • 3s cooldown
        </motion.p>
      </motion.form>
    </div>
  );
}

// Animated number component for the join screen
function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
    >
      {value}
    </motion.span>
  );
}
