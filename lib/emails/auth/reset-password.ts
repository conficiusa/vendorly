export const resetPasswordEmail = ({ link }: { link: string }) => {
	// IMPORTANT: Replace 'https://yourdomain.com/logo.png' with the actual public URL of your logo
	// The image file needs to be hosted somewhere publicly accessible.
	// If your 'public' folder is served statically, the URL might be like 'http://localhost:3000/logo.png' during development
	// or 'https://your-production-domain.com/logo.png' in production.
	const logoUrl = "http://localhost:3000/logo.png"; // <-- UPDATE THIS URL

	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Reset Your Vendorly Password</title>
  </head>
  <body
    style='background-color:rgb(245,245,245);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding-top:40px;padding-bottom:40px'>
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Reset your Vendorly password to regain access to your account
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:600px;margin-left:auto;margin-right:auto;background-color:rgb(255,255,255);border-radius:8px;overflow:hidden">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="border-bottom-width:1px;border-color:rgb(230,230,230);padding-top:32px;padding-bottom:32px;padding-left:24px;padding-right:24px">
              <tbody>
                <tr>
                  <td>
                    <!-- Logo Added Here -->
                    <img
                      src="${logoUrl}"
                      alt="Vendorly Logo"
                      width="150" <!-- Adjust width as needed -->
                      height="auto" <!-- Adjust height as needed, or let it scale automatically -->
                      style="display:block; border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; margin-bottom: 16px;"
                    />
                    <!-- You can remove the h1 below if the logo replaces the text title -->
                    <!-- <h1
                      style="font-size:24px;font-weight:700;color:rgb(219,39,119);margin:0px">
                      Vendorly
                    </h1> -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding-left:24px;padding-right:24px;padding-top:32px;padding-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:20px;font-weight:700;color:rgb(51,51,51);margin-bottom:16px">
                      Password Reset Request
                    </h1>
                    <p
                      style="font-size:16px;line-height:24px;color:rgb(51,51,51);margin-bottom:24px;margin-top:16px">
                      We received a request to reset your password for your
                      Vendorly account. To create a new password, click the
                      button below:
                    </p>
                    <a
                      href=${link}
                      style="background-color:rgb(219,39,119);color:rgb(255,255,255);border-radius:4px;padding-top:12px;padding-bottom:12px;padding-left:24px;padding-right:24px;font-weight:500;font-size:16px;text-decoration-line:none;text-align:center;display:block;box-sizing:border-box;line-height:100%;text-decoration:none;max-width:100%;mso-padding-alt:0px;padding:12px 24px 12px 24px"
                      target="_blank"
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                        >Reset Password</span
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                      ></a
                    >
                    <p
                      style="font-size:16px;line-height:24px;color:rgb(51,51,51);margin-top:24px;margin-bottom:8px">
                      This link will expire in 10 minutes. If you didn&#x27;t
                      request a password reset, you can safely ignore this
                      email.
                    </p>
                    <p
                      style="font-size:16px;line-height:24px;color:rgb(51,51,51);margin-bottom:24px;margin-top:16px">
                      For security reasons, this link can only be used once. If
                      you need to reset your password again, please return to
                      Vendorly and request another reset.
                    </p>

                    <p
                      style="font-size:16px;line-height:24px;color:rgb(51,51,51);margin-bottom:16px;margin-top:16px">
                      Thank you for using Vendorly, your trusted marketplace for
                      vendors and buyers.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(249,249,249);padding-left:24px;padding-right:24px;padding-top:32px;padding-bottom:32px;text-align:center">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;line-height:20px;color:rgb(102,102,102);margin:0px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      ©
                      <!-- -->2025<!-- -->
                      Vendorly. All rights reserved.
                    </p>
                    <p
                      style="font-size:14px;line-height:20px;color:rgb(102,102,102);margin-top:8px;margin-bottom:8px">
                      Our marketplace connecting vendors and buyers
                    </p>
                    <p
                      style="font-size:14px;line-height:20px;color:rgb(102,102,102);margin:0px;margin-bottom:0px;margin-top:0px;margin-left:0px;margin-right:0px">
                      123 Market Street, Suite 100, Accra, Ghana
                    </p>
                    <p
                      style="font-size:14px;line-height:20px;color:rgb(102,102,102);margin-top:16px;margin-bottom:16px">
                      <a
                        href="https://vendorly.com/unsubscribe"
                        style="color:rgb(102,102,102);text-decoration-line:underline"
                        target="_blank"
                        >Unsubscribe</a
                      >
                      •
                      <a
                        href="https://vendorly.com/privacy"
                        style="color:rgb(102,102,102);text-decoration-line:underline"
                        target="_blank"
                        >Privacy Policy</a
                      >
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
  </body>
</html>
`;
};
