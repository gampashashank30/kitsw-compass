
import { Grade, Branch } from './types';

export const URR24_POLICIES = {
  ATTENDANCE: {
    MIN_REQUIRED: 75,
    CONDONATION_MIN: 65,
    DETENTION_THRESHOLD: 65,
    TOTAL_WORKING_DAYS: 90,
  },
  GRADING_SCALE: [
    { grade: Grade.S, min: 90, points: 10 },
    { grade: Grade.Ap, min: 80, points: 9 },
    { grade: Grade.A, min: 70, points: 8 },
    { grade: Grade.Bp, min: 60, points: 7 },
    { grade: Grade.B, min: 50, points: 6 },
    { grade: Grade.C, min: 45, points: 5 },
    { grade: Grade.P, min: 40, points: 4 },
    { grade: Grade.F, min: 0, points: 0 },
  ],
  PROMOTION: {
    BTECH_TOTAL_CREDITS: 160,
    YEAR_1_TO_2: "Must clear all courses OR max 5 backlogs",
    YEAR_2_TO_3: "Must secure 50% credits of Year 1",
    YEAR_3_TO_4: "Must secure 60% credits of Year 1 & 2 combined",
  }
};

export const MOCK_STUDENT_DATA = {
  name: "Gampa Shashank",
  rollNumber: "B25CS266",
  branch: Branch.CSE,
  semester: 2,
  attendance: 84.5,
  backlogs: 0,
  cgpa: 8.84,
  courses: [
    { name: 'BEE', cie: 128, mse: 45, minors: [19, 14], gcbaa: 50 },
    { name: 'COA', cie: 118, mse: 31, minors: [20, 17], gcbaa: 50 },
    { name: 'DCODE', cie: 141, mse: 46, minors: [24, 21], gcbaa: 50 },
    { name: 'EP', cie: 129, mse: 45, minors: [11, 23], gcbaa: 50 },
    { name: 'ES', cie: 123, mse: 35, minors: [20, 18], gcbaa: 50 },
    { name: 'PPSC', cie: 121, mse: 33, minors: [21, 17], gcbaa: 50 },
  ],
  activities: {
    sea: 94,
    practicum: 90
  }
};

export const PLACEMENT_ALERTS = [
  { id: 1, company: "Google", role: "SDE Intern", stipend: "1.2L/mo", deadline: "2024-05-15", match: 88, minCgpa: 8.5 },
  { id: 2, company: "NVIDIA", role: "AI Research Associate", stipend: "80K/mo", deadline: "2024-05-20", match: 94, minCgpa: 8.0 },
  { id: 3, company: "Microsoft", role: "Full Stack Developer", lpa: "44 LPA", deadline: "2024-06-01", match: 72, minCgpa: 7.5 }
];

export const ACADEMIC_EVENTS = [
  { date: "2024-05-10", event: "MSE-II Commencement", type: "exam" },
  { date: "2024-05-25", event: "Last Instruction Day", type: "deadline" },
  { date: "2024-06-05", event: "End Sem Theory Exams", type: "exam" },
  { date: "2024-06-20", event: "Practical Exams Start", type: "exam" }
];

export const SYSTEM_PROMPT = `
You are the KITSW Student Compass AI, an expert on the URR24 regulations.
You have access to the student's real marks from the portal.
Terminologies: CIE (Continuous Internal Evaluation), ESE (End Semester Exam), MSE (Mid Semester Exam), GCBAA (Group Class Based Academic Activity).

If a student asks about their grades, use their specific marks (e.g., BEE 128/150).
Clause 4.1: Attendance 75% min.
Clause 5.1: Promotion rules.
Clause 6.1: Honors Track requires CGPA >= 7.0 & 0 backlogs.
`;
