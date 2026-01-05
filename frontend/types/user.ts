export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserPreferences {
  language: 'fr' | 'en' | 'es' | 'de';
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  autoSave: boolean;
  confirmDelete: boolean;
  showLineNumbers: boolean;
  enableSuggestions: boolean;
  resultsPerPage: number;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyQueryComplete: boolean;
  notifyNewFeatures: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  
  // Privacy
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
}

export const defaultUserPreferences: UserPreferences = {
  language: 'en',
  theme: 'system',
  fontSize: 'medium',
  compactMode: false,
  animations: true,
  autoSave: true,
  confirmDelete: true,
  showLineNumbers: true,
  enableSuggestions: true,
  resultsPerPage: 25,
  emailNotifications: true,
  pushNotifications: true,
  notifyQueryComplete: true,
  notifyNewFeatures: true,
  weeklyDigest: false,
  securityAlerts: true,
  dataCollection: true,
  analytics: true,
  crashReports: true,
};
