import { askGemini } from './geminiService.js';

const canned = [
  [/leave today|on leave/, '4 people are on leave today: 2 in Sales, 1 in Engineering and 1 in Support.'],
  [/engineering/, 'Engineering has 7 active employees.'],
  [/late/, 'Talha Khan came in late most often this month, 6 times.'],
  [/attendance rate/, 'This month\'s attendance rate is 93.4%, up 4% from last month.'],
  [/sick/, 'You have 8 sick leave days left out of 10.'],
  [/payroll/, 'Total payroll for this month is PKR 4.41 million across 44 employees.'],
  [/pending/, 'There are 6 leave requests and 2 attendance corrections waiting for review.'],
  [/holiday/, 'The next public holiday is Iqbal Day on 9 November 2026.'],
  [/payslip/, 'Open My Payslips in the menu to see and download your latest payslip.'],
];

export async function askAssistant(role, question) {
  if (!question || !question.trim()) throw new Error('Please ask a question.');
  
  try {
    // Try Gemini first
    const result = await askGemini(question, role);
    return { answer: result.answer, source: 'gemini' };
  } catch (geminiError) {
    console.warn('Gemini failed, using fallback:', geminiError.message);
    
    // Fallback to mock data
    const hit = canned.find(([re]) => re.test(question.toLowerCase()));
    const answer = hit ? hit[1] : 'I could not find that in the data. Try asking about attendance, leave, payroll, or specific employees.';
    return new Promise(r => setTimeout(() => r({ answer, source: 'fallback' }), 1100));
  }
}

export async function getAiSummary(role) {
  const summaries = {
    admin: ['Headcount grew by 3 this month while attrition fell to 4.2%.', 'Engineering carries the largest share of payroll cost, 31% of the total.', 'Attendance improved by 4% compared with September.', 'Casual leave usage is higher than last month, mostly in Sales.'],
    hr: ['Attendance improved by 4% this month.', 'Engineering has the highest number of late arrivals.', 'Casual leave usage is higher than last month.', 'Three leave requests have been pending for over 48 hours.'],
    employee: ['Your attendance this month is 100%.', 'You have 8 sick days and 5 casual days remaining.', 'Your last payslip was processed on 30 September.', 'No pending leave requests or corrections.']
  };
  return new Promise(r => setTimeout(() => r(summaries[role] || summaries.employee), 1400));
}
