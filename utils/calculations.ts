import { Grade } from '../types';
import { URR24_POLICIES } from '../constants';

export interface Course {
  name: string;
  cie: number; // Total CIE out of 150
  mse?: number; // MSE marks out of 50
  minors?: number[]; // Minor-I and Minor-II marks
  gcbaa?: number; // GCBAA marks
  ese?: number; // ESE marks out of 100
  credits?: number;
}

/**
 * Calculate final marks from CIE and ESE
 * CIE (150 marks) + ESE (100 marks) = Total (250 marks)
 * Convert to percentage: (Total/250) * 100
 */
export const calculateFinalMarks = (cie: number, ese: number): number => {
  const total = cie + ese;
  return (total / 250) * 100;
};

/**
 * Get grade from percentage marks based on URR24 grading scale
 */
export const calculateGrade = (percentage: number): { grade: Grade; points: number } => {
  const scale = URR24_POLICIES.GRADING_SCALE;
  const gradeInfo = scale.find(g => percentage >= g.min) || scale[scale.length - 1];
  return { grade: gradeInfo.grade, points: gradeInfo.points };
};

/**
 * Calculate SGPA for a semester
 * SGPA = Σ(grade_points * credits) / Σ(credits)
 */
export const calculateSGPA = (courses: Course[]): number => {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    if (course.ese !== undefined && course.credits) {
      const percentage = calculateFinalMarks(course.cie, course.ese);
      const { points } = calculateGrade(percentage);
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

/**
 * Calculate CGPA from multiple semesters
 */
export const calculateCGPA = (semesters: { sgpa: number; credits: number }[]): number => {
  let totalPoints = 0;
  let totalCredits = 0;

  semesters.forEach(sem => {
    totalPoints += sem.sgpa * sem.credits;
    totalCredits += sem.credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

/**
 * Calculate attendance required to reach target percentage
 */
export const calculateAttendanceRequired = (
  currentAttendance: number,
  targetAttendance: number,
  totalWorkingDays: number = URR24_POLICIES.ATTENDANCE.TOTAL_WORKING_DAYS
): number => {
  const currentClasses = (currentAttendance / 100) * totalWorkingDays;
  const targetClasses = (targetAttendance / 100) * totalWorkingDays;
  return Math.ceil(targetClasses - currentClasses);
};

/**
 * Predict final grade based on CIE and expected ESE
 */
export const predictFinalGrade = (cie: number, expectedESE: number): { grade: Grade; percentage: number; points: number } => {
  const percentage = calculateFinalMarks(cie, expectedESE);
  const { grade, points } = calculateGrade(percentage);
  return { grade, percentage, points };
};

/**
 * Check if student is eligible for promotion based on URR24 rules
 */
export const checkPromotionEligibility = (studentData: {
  semester: number;
  backlogs: number;
  creditsEarned: number;
}): { eligible: boolean; reason: string } => {
  const { semester, backlogs, creditsEarned } = studentData;

  // Year 1 to Year 2
  if (semester === 2) {
    if (backlogs === 0 || backlogs <= 5) {
      return { eligible: true, reason: URR24_POLICIES.PROMOTION.YEAR_1_TO_2 };
    }
    return { eligible: false, reason: `You have ${backlogs} backlogs. ${URR24_POLICIES.PROMOTION.YEAR_1_TO_2}` };
  }

  // Year 2 to Year 3
  if (semester === 4) {
    const year1Credits = 40; // Assuming 20 credits per semester
    const requiredCredits = year1Credits * 0.5;
    if (creditsEarned >= requiredCredits) {
      return { eligible: true, reason: URR24_POLICIES.PROMOTION.YEAR_2_TO_3 };
    }
    return { eligible: false, reason: `You need ${requiredCredits} credits from Year 1. Currently: ${creditsEarned}` };
  }

  // Year 3 to Year 4
  if (semester === 6) {
    const year1And2Credits = 80;
    const requiredCredits = year1And2Credits * 0.6;
    if (creditsEarned >= requiredCredits) {
      return { eligible: true, reason: URR24_POLICIES.PROMOTION.YEAR_3_TO_4 };
    }
    return { eligible: false, reason: `You need ${requiredCredits} credits from Year 1 & 2. Currently: ${creditsEarned}` };
  }

  return { eligible: true, reason: 'No promotion check required for this semester' };
};

/**
 * Calculate CIE total from components
 * CIE = Minor1 + Minor2 + MSE + GCBAA (total 150)
 */
export const calculateCIETotal = (minor1: number, minor2: number, mse: number, gcbaa: number): number => {
  return minor1 + minor2 + mse + gcbaa;
};

/**
 * Get attendance status color
 */
export const getAttendanceStatus = (attendance: number): { status: 'success' | 'warning' | 'danger'; color: string } => {
  if (attendance >= 75) {
    return { status: 'success', color: '#10b981' };
  } else if (attendance >= 65) {
    return { status: 'warning', color: '#f59e0b' };
  }
  return { status: 'danger', color: '#ef4444' };
};

/**
 * Calculate how many classes can be missed to maintain 75%
 */
export const calculateMaxMissableClasses = (
  currentAttendance: number,
  totalWorkingDays: number = URR24_POLICIES.ATTENDANCE.TOTAL_WORKING_DAYS
): number => {
  const currentClasses = (currentAttendance / 100) * totalWorkingDays;
  const requiredClasses = 0.75 * totalWorkingDays;
  const remainingClasses = totalWorkingDays - currentClasses;
  const maxMissable = requiredClasses - currentClasses;
  return Math.max(0, Math.floor(maxMissable));
};
