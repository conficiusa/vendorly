export const sendSMS = async (phoneNumber: string, content: string) => {
  const BASE_URL = process.env.HUBTEL_SMS_URL;
  const CLIENT_ID = process.env.HUBTEL_CLIENT_ID;
  const CLIENT_SECRET = process.env.HUBTEL_CLIENT_SECRET;
  const SENDER_ID = process.env.HUBTEL_SENDER_ID;

  // Validate environment variables
  if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !SENDER_ID) {
    console.error("Missing Hubtel environment variables:", {
      BASE_URL: !!BASE_URL,
      CLIENT_ID: !!CLIENT_ID,
      CLIENT_SECRET: !!CLIENT_SECRET,
      SENDER_ID: !!SENDER_ID,
    });
    throw new Error("Missing required Hubtel configuration");
  }

  const baseurl = `${BASE_URL}?clientsecret=${CLIENT_SECRET}&clientid=${CLIENT_ID}&from=${SENDER_ID}&to=${phoneNumber}&content=${encodeURIComponent(content)}`;
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await fetch(baseurl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SMS sending failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `SMS sending failed: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};
