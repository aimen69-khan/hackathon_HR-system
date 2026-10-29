// Salary breakup rules live here only to power mock UI; real calculation is a backend job.
export function computePay(gross) {
  const basic = Math.round(gross * 0.6);
  const hra = Math.round(gross * 0.2);
  const medical = Math.round(gross * 0.05);
  const other = gross - basic - hra - medical;
  const pf = Math.round(basic * 0.05);
  const tax = gross > 200000 ? Math.round(gross * 0.12) : gross > 130000 ? Math.round(gross * 0.06) : gross > 100000 ? Math.round(gross * 0.02) : 0;
  const deductions = pf + tax;
  return { basic, hra, medical, other, gross, pf, tax, deductions, net: gross - deductions };
}
