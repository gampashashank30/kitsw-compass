
export enum Branch {
  CSE = 'CSE',
  CSM = 'CSM',
  CSO = 'CSO',
  CSD = 'CSD',
  ECE = 'ECE',
  EEE = 'EEE',
  ME = 'ME',
  CE = 'CE',
  IT = 'IT'
}

export enum Grade {
  S = 'S',
  Ap = 'A+',
  A = 'A',
  Bp = 'B+',
  B = 'B',
  C = 'C',
  P = 'P',
  F = 'F'
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade?: Grade;
  difficulty: number; // 1-10
}

export interface SemesterData {
  semesterNumber: number;
  subjects: Subject[];
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  branch: Branch;
  semester: number;
  attendance: number; // percentage
  backlogs: number;
  cgpa: number;
  creditsEarned: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
