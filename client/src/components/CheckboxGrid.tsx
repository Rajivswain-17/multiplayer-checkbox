import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import type { CheckboxData } from '../types/socket';

interface CooldownInfo {
  remaining: number;
  total: number;
  message: string;
}

interface CheckboxGridProps {
  checkboxes: CheckboxData[];
  cooldowns: { [id: number]: CooldownInfo };
  onToggle: (id: number, checked: boolean) => void;
}

export function CheckboxGrid({ checkboxes, cooldowns, onToggle }: CheckboxGridProps) {
  return (
    <div className="grid-container" id="checkbox-grid-container">
      <div className="checkbox-grid">
        {checkboxes.map((cb) => (
          <CheckboxCell
            key={cb.id}
            checkbox={cb}
            cooldown={cooldowns[cb.id]}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

interface CheckboxCellProps {
  checkbox: CheckboxData;
  cooldown?: CooldownInfo;
  onToggle: (id: number, checked: boolean) => void;
}

const CheckboxCell = memo(function CheckboxCell({
  checkbox,
  cooldown,
  onToggle,
}: CheckboxCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isDisabled = !!cooldown;

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onToggle(checkbox.id, !checkbox.checked);
    }
  }, [checkbox.id, checkbox.checked, isDisabled, onToggle]);

  // Calculate cooldown progress (0 to 1, where 1 = full, 0 = done)
  const cooldownProgress = cooldown
    ? cooldown.remaining / cooldown.total
    : 0;

  // SVG circle math for cooldown ring
  const ringSize = 30;
  const ringRadius = 13;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - cooldownProgress);

  return (
    <div
      className="checkbox-cell"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Cooldown Ring */}
      {isDisabled && (
        <svg
          className="cooldown-ring"
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.05s linear',
              opacity: 0.8,
            }}
          />
        </svg>
      )}

      {/* Checkbox Button */}
      <motion.button
        className={`checkbox-btn ${checkbox.checked ? 'checked' : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
        whileTap={isDisabled ? {} : { scale: 0.85 }}
        animate={
          checkbox.checked
            ? { scale: [1, 1.2, 1] }
            : { scale: 1 }
        }
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 15,
        }}
        aria-label={`Checkbox ${checkbox.id}, ${checkbox.checked ? 'checked' : 'unchecked'}`}
        id={`checkbox-${checkbox.id}`}
      >
        {checkbox.checked && (
          <svg
            className="checkbox-tick"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.button>

      {/* Tooltip */}
      {showTooltip && checkbox.lastClickedBy && (
        <motion.div
          className="checkbox-tooltip"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          Last clicked by <strong>{checkbox.lastClickedBy}</strong>
        </motion.div>
      )}
    </div>
  );
});
