import { z } from "zod";

// Define prefixes for each carrier
const carrierPrefixes: Record<string, string[]> = {
  MTN: ["024", "025", "053", "054", "055", "059"],
  AIRTELTIGO: ["026", "027", "056", "057"],
  TELECEL: ["020", "050"],
};

// Create a Zod schema to validate the phone number format
const phoneSchema = z.string().regex(/^(?:\+233|0)\d{9}$/, {
  message: "Phone number must start with +233 or 0 and contain 10 digits.",
});

/**
 * Validates a phone number for a specific carrier.
 * @param carrier - The carrier to validate against (e.g., 'MTN', 'AirtelTigo', 'Vodafone').
 * @param phoneNumber - The phone number to validate.
 * @returns True if the phone number is valid for the carrier, otherwise false.
 */
export const validatePhoneNumber = (
  carrier: string,
  phoneNumber: string
): boolean => {
  // Ensure carrier is valid
  if (!carrierPrefixes[carrier.toUpperCase()]) {
    throw new Error(`Invalid carrier: ${carrier}`);
  }

  // Validate phone number format
  const validation = phoneSchema.safeParse(phoneNumber);
  if (!validation.success) {
    return false;
  }

  // Normalize the phone number (remove +233 if present)
  let normalizedNumber = phoneNumber;
  if (phoneNumber.startsWith("+233")) {
    normalizedNumber = "0" + phoneNumber.slice(4); // Replace +233 with 0
  }

  // Extract the prefix from the normalized phone number
  const prefix = normalizedNumber.slice(0, 3);

  // Check if the prefix matches the carrier
  return carrierPrefixes[carrier].includes(prefix);
};
