export const LoginOTP = ({ token }: { token: string }) => {
  return `Your OTP is ${token}. It is valid for 5 minutes.`;
};

export const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  return `Your order with ID ${orderId} has been confirmed. You can track it on your dashboard`;
};

export const OrderFailed = ({ orderId }: { orderId: string }) => {
  return `We could not confirm your order with ID ${orderId}. If you have made a payment, please contact support.`;
};
