export const LoginOTP = ({ token }: { token: string }) => {
  return `Your OTP is ${token}. It is valid for 5 minutes.`;
};
