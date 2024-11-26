import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Invalid email address" };
    }

    await resend.emails.send({
      from: "truefeedback@resend.dev",
      to: email,
      subject: "Mystry Message - Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error(
      "Error sending verification email",
      error.response?.data || emailError
    );
    return { success: false, message: "Failed to send verification email" };
  }
}
