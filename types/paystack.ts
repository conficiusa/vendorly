export interface PaystackAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string | null;
  account_name: string | null;
  receiver_bank_account_number: string | null;
  receiver_bank: string | null;
}

export interface PaystackCustomer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: any | null;
  risk_action: string;
  international_format_phone: string | null;
}

export interface PaystackSource {
  type: string;
  source: string;
  entry_point: string;
  identifier: string | null;
}

export interface PaystackFeesBreakdown {
  amount: string;
  formula: string | null;
  type: string;
}

export interface PaystackMetadata {
  orderId: string;
  userId: string;
  phoneNumber: string;
  email: string;
}

export interface PaystackTransactionData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: PaystackMetadata;
  fees_breakdown: PaystackFeesBreakdown;
  log: any | null;
  fees: number;
  fees_split: any | null;
  authorization: PaystackAuthorization;
  customer: PaystackCustomer;
  plan: Record<string, any>;
  subaccount: Record<string, any>;
  split: Record<string, any>;
  order_id: string | null;
  paidAt: string;
  requested_amount: number;
  pos_transaction_data: any | null;
  source: PaystackSource;
}

export interface PaystackWebhookEvent {
  event: string;
  data: PaystackTransactionData;
}
