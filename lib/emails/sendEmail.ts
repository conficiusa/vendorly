"use server";
import nodemailer from "nodemailer";

type SendEmailProps = {
	recipient: string;
	subject: string;
	body: string;
};
const transporter = nodemailer.createTransport({
	service: "gmail",
	port: 465,
	auth: {
		user: process.env.GMAIL_USER, // Your Gmail address
		pass: process.env.GMAIL_PASSWORD, // Make sure to use an app-specific password or OAuth2 for better security
	},
});
export async function sendEmail({ recipient, subject, body }: SendEmailProps) {
	// Define the email options
	const mailOptions = {
		from: process.env.GMAIL_USER, // Sender's email
		to: recipient, // Recipient's email
		subject: subject, // Subject line
		html: body, // HTML body (can include inline styles)
	};

	// Send the email
	await transporter.sendMail(mailOptions);
}
