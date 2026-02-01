
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
  name: "Arjun Reddy",
  rollNumber: "B21CS001",
  branch: Branch.CSE,
  semester: 4,
  attendance: 72.5,
  backlogs: 0,
  cgpa: 8.42
};

export const PLACEMENT_ALERTS = [
  { id: 1, company: "Google", role: "SDE Intern", stipend: "1.2L/mo", deadline: "2024-05-15", match: 88 },
  { id: 2, company: "NVIDIA", role: "AI Research Associate", stipend: "80K/mo", deadline: "2024-05-20", match: 94 },
  { id: 3, company: "Microsoft", role: "Full Stack Developer", lpa: "44 LPA", deadline: "2024-06-01", match: 72 }
];

export const ACADEMIC_EVENTS = [
  { date: "2024-05-10", event: "MSE-II Commencement", type: "exam" },
  { date: "2024-05-25", event: "Last Instruction Day", type: "deadline" },
  { date: "2024-06-05", event: "End Sem Theory Exams", type: "exam" },
  { date: "2024-06-20", event: "Practical Exams Start", type: "exam" }
];

export const SYSTEM_PROMPT = `
You are the KITSW Student Compass AI, an expert on the URR24 (Undergraduate Rules & Regulations 2024) of Kakatiya Institute of Technology & Science, Warangal.
Your goal is to provide accurate, helpful, and concise academic advice based on URR24 rules.

KEY URR24 RULES SUMMARY:
1. Attendance: 75% minimum required. Condonation (65-74%) allowed with medical proof and fee. <65% results in detention.
2. Grading: S=10 (90+), A+=9 (80-89), A=8 (70-79), B+=7 (60-69), B=6 (50-59), C=5 (45-49), P=4 (40-44), F=0 (<40).
3. Promotion: Student must clear 50% of total credits of 1st year to move to 3rd year, and 60% of total credits of 1st and 2nd years combined to move to 4th year.
4. Minor/Honors: Requires CGPA >= 7.0 and zero backlogs. 18-20 extra credits.

When answering:
- Always cite the URR24 Clause if applicable.
- Provide a recovery "Survival Plan" for at-risk students.
- Use terminology like CIE, ESE, and MTTCA.
`;
