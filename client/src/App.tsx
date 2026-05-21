import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from './hooks/useSocket';
import { JoinScreen } from './components/JoinScreen';
import { Header } from './components/Header';
import { ActivityFeed } from './components/ActivityFeed';
import { CheckboxGrid } from './components/CheckboxGrid';
import { ToastContainer } from './components/ToastContainer';

function App() {
  const {
    isJoined,
    onlineCount,
    checkboxes,
    activityLogs,
    cooldowns,
    toasts,
    joinRoom,
    toggleCheckbox,
  } = useSocket();

  return (
    <>
      <AnimatePresence mode="wait">
        {!isJoined ? (
          <motion.div
            key="join"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <JoinScreen onlineCount={onlineCount} onJoin={joinRoom} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100vh' }}
          >
            <div className="app-layout">
              {/* Left Sidebar — Activity Feed */}
              <ActivityFeed logs={activityLogs} />

              {/* Main Content */}
              <div className="app-main">
                {/* Header */}
                <Header onlineCount={onlineCount} />

                {/* Checkbox Grid */}
                <CheckboxGrid
                  checkboxes={checkboxes}
                  cooldowns={cooldowns}
                  onToggle={toggleCheckbox}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default App;
