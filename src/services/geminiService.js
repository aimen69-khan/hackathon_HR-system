import { GEMINI_API_KEY } from '../config/api.js';

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function askGemini(question, role = 'employee') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured. See .env file.');
  }

  const roleContext = {
    admin: 'You are an HR assistant for an admin. Answer questions about company-wide statistics, payroll, headcount, and organizational metrics.',
    hr: 'You are an HR assistant for HR staff. Answer questions about attendance, leave requests, employee management, and HR operations.',
    employee: 'You are an HR assistant for an employee. Answer questions about their own attendance, leave balance, payslips, and personal benefits.'
  };

  const prompt = `${roleContext[role] || roleContext.employee}\n\nQuestion: ${question}\n\nProvide a concise, helpful answer in 1-2 sentences.`;

  try {
    const res = await fetch(`${GEMINI_API}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error?.message || 'Gemini API error');
    }

    const data = await res.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) throw new Error('No response from Gemini');

    return { answer, source: 'gemini', model: 'gemini-pro' };
  } catch (error) {
    console.error('Gemini error:', error.message);
    throw error;
  }
}
