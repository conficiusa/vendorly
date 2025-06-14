export const QUEUE_URLS = {
  RECOMBEE: `${process.env.BASE_URL}/api/queues/recombee`,
  SMS_NOTIFICATION: `${process.env.BASE_URL}/api/transactions/charge/notifications/sms`,
} as const;


export const ANONYMOUS_COOKIE_NAME = "guest_id";