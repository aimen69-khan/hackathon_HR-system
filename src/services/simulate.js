// Wraps mock data in a promise so pages behave like real API calls.
export const simulate = (data, ms = 450) =>
  new Promise((resolve) => setTimeout(() => resolve(typeof data === 'function' ? data() : data), ms));
export const simulateError = (message, ms = 400) => new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
