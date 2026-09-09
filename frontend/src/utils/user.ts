export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  createdAt: string;
}

const STORAGE_KEY_CURRENT_USER = 'learnwise_current_user';
const STORAGE_KEY_ALL_USERS = 'learnwise_user_profiles';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
];

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load users', e);
  }
  
  const initialUser: UserProfile = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    name: 'Student Learner',
    avatar: DEFAULT_AVATARS[0],
    role: 'Computer Science Student',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify([initialUser]));
  return [initialUser];
}

export function getCurrentUser(): UserProfile {
  const users = getStoredUsers();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      const match = users.find(u => u.id === parsed.id);
      if (match) return match;
    }
  } catch (e) {
    console.error('Failed to get current user', e);
  }
  setCurrentUser(users[0]);
  return users[0];
}

export function setCurrentUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
}

export function createNewUser(name: string, role: string = 'Learner'): UserProfile {
  const users = getStoredUsers();
  const avatar = DEFAULT_AVATARS[users.length % DEFAULT_AVATARS.length];
  const newUser: UserProfile = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    name: name.trim() || `User ${users.length + 1}`,
    avatar,
    role,
    createdAt: new Date().toISOString()
  };
  const updated = [...users, newUser];
  localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(updated));
  setCurrentUser(newUser);
  return newUser;
}
