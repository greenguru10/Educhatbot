import React, { useState } from 'react';
import { User, Plus, Check, X, Shield, Clock } from 'lucide-react';
import { UserProfile, getStoredUsers, setCurrentUser, createNewUser } from '../../utils/user';

interface UserProfileModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserChanged
}) => {
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers());
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Computer Science Student');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSelectUser = (u: UserProfile) => {
    setCurrentUser(u);
    onUserChanged(u);
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const user = createNewUser(newUserName, newUserRole);
    setUsers(getStoredUsers());
    setNewUserName('');
    setIsCreating(false);
    onUserChanged(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-colors">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Learner Profiles</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Each profile maintains isolated chat histories & saved notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Switch Active Profile
            </label>
            <div className="space-y-2">
              {users.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/50 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {u.name}
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{u.role}</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {isCreating ? (
            <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Create New Learner Profile
              </h4>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Learner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Maya Chen"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Field / Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Computer Science Student">Computer Science Student</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Data Science Enthusiast">Data Science Enthusiast</option>
                  <option value="Independent Researcher">Independent Researcher</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                >
                  Save & Switch
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-2 text-xs font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New User Profile
            </button>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Isolated local sessions
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Auto-synced
          </span>
        </div>
      </div>
    </div>
  );
};
