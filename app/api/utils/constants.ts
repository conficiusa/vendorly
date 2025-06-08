export const QUEUE_URLS = {
  RECOMBEE: `https://vendorly-omega.vercel.app/api/queues/recombee`,
  SMS_NOTIFICATION: `${process.env.BASE_URL}/api/transactions/charge/notifications/sms`,
} as const;
