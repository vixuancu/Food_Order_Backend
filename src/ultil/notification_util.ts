// Email

//notifications

//OTP
export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP không phải cách thực tế
  let expiry = new Date();
  expiry.setTime(expiry.getTime() + 5 * 60 * 1000); // OTP expires in 5 minutes
  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhonenumber: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error("Twilio credentials not found in environment variables");
  }

  // Format phone number to international format
  let formattedPhone = toPhonenumber;

  // If phone starts with 0, replace with +84 (Vietnam country code)
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+84" + formattedPhone.substring(1);
  }
  // If phone doesn't start with +, add +84
  else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+84" + formattedPhone;
  }

  console.log(`Sending OTP to: ${formattedPhone}`);

  const client = require("twilio")(accountSid, authToken);

  try {
    const response = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`OTP sent successfully: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
//payment notification or email
