import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

class Response {
  /**
   * check if object is came from Zod
   */
  static isZodError = (obj: any): obj is ZodError => {
    return obj.name === "ZodError" && Array.isArray(obj.issues);
  };

  /**
   * Mapping zod error to be more simple
   */
  static mapZodError = (error: ZodError) => {
    return error.issues.map((issue) => {
      const field = issue.path.join(".");
      const message = issue.message;
      return {
        field,
        message,
      };
    });
  };

  /**
   * Check if error is an instance of AppError
   */
  static isAppError = (error: any): error is AppError => {
    return error instanceof AppError;
  };

  static success = (data: any, statusCode: number = 200) => {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: statusCode }
    );
  };

  static error = (error: any, statusCode?: number) => {
    // Handle Zod validation errors
    if (this.isZodError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: this.mapZodError(error),
          },
        },
        { status: 400 }
      );
    }

    // Handle custom AppErrors
    if (this.isAppError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: error.statusCode }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: statusCode ?? 500 }
    );
  };
}

export default Response;
