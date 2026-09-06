import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LogOut, MessageSquare, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Session } from '../types';

interface CommandPaletteProps {
  sessions: Session[];
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onToggleZenMode: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CommandPalette({ sessions, onSelectSession, onNewSession, onToggleZenMode, open, setOpen }: CommandPaletteProps) {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-xl shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white"
          >
            <Command 
              className="w-full bg-transparent flex flex-col"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center border-b border-slate-200 px-4">
                <Search className="w-5 h-5 text-slate-500 mr-2" />
                <Command.Input 
                  placeholder="Search sessions, or type a command..." 
                  className="w-full bg-transparent text-slate-900 placeholder-[#9ca3af] h-14 outline-none text-[15px]"
                  autoFocus
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                <Command.Empty className="text-center py-6 text-slate-500 text-[14px]">No results found.</Command.Empty>

                <Command.Group heading="Suggestions" className="text-xs font-medium text-slate-500 px-2 py-1.5 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2">
                  <Command.Item 
                    onSelect={() => {
                      onNewSession();
                      setOpen(false);
                    }}
                    className="flex items-center px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-100 text-slate-900 transition-colors aria-selected:bg-slate-100"
                  >
                    <Plus className="w-4 h-4 mr-3 text-blue-600" />
                    New Entry
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => {
                      setOpen(false);
                      onToggleZenMode();
                    }}
                    className="flex items-center px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-100 text-slate-900 transition-colors aria-selected:bg-slate-100"
                  >
                    <Moon className="w-4 h-4 mr-3 text-slate-500" />
                    Toggle Zen Mode
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Recent Entries" className="text-xs font-medium text-slate-500 px-2 py-1.5 mt-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2">
                  {sessions.slice(0, 5).map(session => (
                    <Command.Item 
                      key={session.id}
                      onSelect={() => {
                        onSelectSession(session.id);
                        setOpen(false);
                      }}
                      className="flex items-center px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-100 text-slate-900 transition-colors aria-selected:bg-slate-100"
                    >
                      <MessageSquare className="w-4 h-4 mr-3 text-slate-500" />
                      <span className="truncate">{session.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Account" className="text-xs font-medium text-slate-500 px-2 py-1.5 mt-2 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2">
                  <Command.Item 
                    onSelect={() => {
                      setOpen(false);
                      logOut();
                      navigate('/login');
                    }}
                    className="flex items-center px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-100 text-red-400 transition-colors aria-selected:bg-slate-100"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
