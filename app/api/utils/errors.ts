/**
 * Base error class for all custom errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Validation errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * Authentication errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Not authorized") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

/**
 * Not found errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/**
 * Conflict errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class PaymentError extends AppError {
  constructor(message: string = "Payment failed") {
    super(message, 400, "PAYMENT_ERROR");
    this.name = "PaymentError";
  }
}

/**
 * Bad request errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400, "BAD_REQUEST");
    this.name = "BadRequestError";
  }
}

/**
 * Database errors
 * @param message - The error message
 * @param statusCode - The status code
 * @param code - The error code
 * @param details - The error details
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
    this.name = "DatabaseError";
  }
}
