// Shared OTP store — single source of truth
declare global { var vendraOtpStore: Map<string, { otp: string; expires: number }> }
if (!global.vendraOtpStore) global.vendraOtpStore = new Map();
export const otpStore = global.vendraOtpStore;

export function setOtp(email: string, otp: string) {
  global.vendraOtpStore.set(email.toLowerCase().trim(), {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
  });
}

export function verifyOtp(email: string, otp: string): { success: boolean; error?: string } {
  const key = email.toLowerCase().trim();
  const stored = global.vendraOtpStore.get(key);
  if (!stored) return { success: false, error: 'No code found. Please request a new one.' };
  if (Date.now() > stored.expires) {
    global.vendraOtpStore.delete(key);
    return { success: false, error: 'Code expired. Please request a new one.' };
  }
  if (stored.otp !== otp.trim()) return { success: false, error: 'Incorrect code. Please try again.' };
  global.vendraOtpStore.delete(key);
  return { success: true };
}