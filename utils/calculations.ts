import { URR24_POLICIES } from '../constants';
import { Grade as GradeEnum } from '../types';

export interface Course {
  name: string;
  cie: number; // Total CIE out of 150
  mse: number; // MSE marks out of 50
  minors: [number, number]; // Minor1, Minor2
  gcbaa: number; // GCBAA out of 50
  ese?: number; // ESE marks out of 100 (optional for predictions)
  credits?: number; // Course credits (default 3)
}

/**
 * Calculate final marks from CIE and ESE
 * CIE = Minor1 + Minor2 + MSE + GCBAA (max 150)
 * ESE = ESE marks (max 100)
 * Total = CIE + ESE (max 250)
 */
export const calculateFinalMarks = (course: Course): number => {
  const cieTotal = course.minors[0] + course.minors[1] + course.mse + course.gcbaa;
  const ese = course.ese || 0;
  return cieTotal + ese;
};

/**
 * Calculate percentage from total marks (out of 250)
 */
export const calculatePercentage = (totalMarks: number): number => {
  return (totalMarks / 250) * 100;
};

/**
 * Get grade from percentage based on URR24 grading scale
 */
export const calculateGrade = (percentage: number): GradeEnum => {
  const scale = URR24_POLICIES.GRADING_SCALE;
  for (let i = 0; i < scale.length; i++) {
    if (percentage >= scale[i].min) {
      return scale[i].grade;
    }
  }
  return GradeEnum.F;
};

/**
 * Get grade points from grade
 */
export const getGradePoints = (grade: GradeEnum): number => {
  const scale = URR24_POLICIES.GRADING_SCALE;
  const gradeInfo = scale.find(g => g.grade === grade);
  return gradeInfo?.points || 0;
};

/**
 * Calculate SGPA for a semester
 * SGPA = Σ(grade_points * credits) / Σ(credits)
 */
export const calculateSGPA = (courses: Course[]): number => {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const credits = course.credits || 3;
    const finalMarks = calculateFinalMarks(course);
    const percentage = calculatePercentage(finalMarks);
    const grade = calculateGrade(percentage);
    const gradePoints = getGradePoints(grade);

    totalPoints += gradePoints * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

/**
 * Calculate CGPA from multiple semesters
 * CGPA = Σ(SGPA * credits) / Σ(credits)
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
  currentPercentage: number,
  targetPercentage: number,
  totalWorkingDays: number = URR24_POLICIES.ATTENDANCE.TOTAL_WORKING_DAYS
): number => {
  const currentAttended = (currentPercentage / 100) * totalWorkingDays;
  const targetAttended = (targetPercentage / 100) * totalWorkingDays;
  return Math.ceil(targetAttended - currentAttended);
};

/**
 * Predict final grade based on CIE and expected ESE
 */
export const predictFinalGrade = (cie: number, expectedESE: number): { grade: GradeEnum; percentage: number; totalMarks: number } => {
  const totalMarks = cie + expectedESE;
  const percentage = calculatePercentage(totalMarks);
  const grade = calculateGrade(percentage);
  return { grade, percentage, totalMarks };
};

/**
 * Check if student is eligible for promotion based on URR24 rules
 */
export const checkPromotionEligibility = (studentData: {
  semester: number;
  backlogs: number;
  cgpa: number;
  creditsEarned: number;
}): { eligible: boolean; reason: string; requirements: string[] } => {
  const { semester, backlogs, creditsEarned } = studentData;
  const requirements: string[] = [];
  let eligible = true;

  // Year 1 to Year 2
  if (semester === 2) {
    if (backlogs > 5) {
      eligible = false;
      requirements.push(`Must clear all courses OR max 5 backlogs (Current: ${backlogs})`);
    } else {
      requirements.push(`✓ Cleared backlogs requirement (${backlogs} backlogs)`);
    }
  }

  // Year 2 to Year 3
  if (semester === 4) {
    const year1Credits = 32; // Approximate credits for Year 1
    const requiredCredits = year1Credits * 0.5;
    if (creditsEarned < requiredCredits) {
      eligible = false;
      requirements.push(`Must secure 50% credits of Year 1 (Required: ${requiredCredits}, Earned: ${creditsEarned})`);
    } else {
      requirements.push(`✓ Secured 50% credits of Year 1 (${creditsEarned} credits)`);
    }
  }

  // Year 3 to Year 4
  if (semester === 6) {
    const year1And2Credits = 64; // Approximate credits for Year 1 & 2
    const requiredCredits = year1And2Credits * 0.6;
    if (creditsEarned < requiredCredits) {
      eligible = false;
      requirements.push(`Must secure 60% credits of Year 1 & 2 combined (Required: ${requiredCredits}, Earned: ${creditsEarned})`);
    } else {
      requirements.push(`✓ Secured 60% credits of Year 1 & 2 (${creditsEarned} credits)`);
    }
  }

  return {
    eligible,
    reason: eligible ? 'Eligible for promotion' : 'Not eligible for promotion',
    requirements
  };
};

/**
 * Check if attendance is eligible for condonation (65-75%)
 */
export const checkCondonationEligibility = (attendance: number): { eligible: boolean; reason: string } => {
  const { CONDONATION_MIN, MIN_REQUIRED } = URR24_POLICIES.ATTENDANCE;
  
  if (attendance >= MIN_REQUIRED) {
    return { eligible: false, reason: 'Attendance is above minimum requirement. No condonation needed.' };
  }
  
  if (attendance >= CONDONATION_MIN && attendance < MIN_REQUIRED) {
    return { eligible: true, reason: `Eligible for condonation (${attendance}% is between 65-75%)` };
  }
  
  return { eligible: false, reason: `Attendance too low (${attendance}%). Minimum 65% required for condonation.` };
};

/**
 * Calculate how many classes to attend to reach target attendance
 */
export const calculateClassesToAttend = (
  currentAttendance: number,
  targetAttendance: number,
  totalWorkingDays: number = URR24_POLICIES.ATTENDANCE.TOTAL_WORKING_DAYS,
  classesAttended: number
): { classesNeeded: number; daysRemaining: number } => {
  const currentAttended = (currentAttendance / 100) * totalWorkingDays;
  const targetAttended = (targetAttendance / 100) * totalWorkingDays;
  const classesNeeded = Math.ceil(targetAttended - currentAttended);
  
  // Estimate days remaining (assuming 5 classes per week, 18 weeks total)
  const daysRemaining = Math.ceil(classesNeeded / 5) * 7;
  
  return { classesNeeded, daysRemaining };
};

/**
 * Predict CGPA after semester
 */
export const predictCGPA = (
  currentCGPA: number,
  currentCredits: number,
  predictedSGPA: number,
  semesterCredits: number
): number => {
  const currentPoints = currentCGPA * currentCredits;
  const semesterPoints = predictedSGPA * semesterCredits;
  const totalCredits = currentCredits + semesterCredits;
  
  return totalCredits > 0 ? (currentPoints + semesterPoints) / totalCredits : currentCGPA;
};
