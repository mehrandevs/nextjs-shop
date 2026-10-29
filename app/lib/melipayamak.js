// // const MELIPAYAMAK_API_URL =
// //   "https://rest.payamak-panel.com/api/SendSMS/SendOtp";
// // const MELIPAYAMAK_USERNAME = process.env.MELIPAYAMAK_USERNAME;
// // const MELIPAYAMAK_PASSWORD = process.env.MELIPAYAMAK_PASSWORD;

// // export async function sendSms(phone, message) {
// //   const payload = new URLSearchParams({
// //     username: MELIPAYAMAK_USERNAME,
// //     password: MELIPAYAMAK_PASSWORD,
// //     to: phone,
// //     from: process.env.MELIPAYAMAK_FROM_NUMBER,
// //     text: String(message),
// //   });
// //   try {
// //     const response = await fetch(MELIPAYAMAK_API_URL, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/x-www-form-urlencoded",
// //       },
// //       body: payload.toString(),
// //     });
// //     const data = await response.json();
// //     console.log("Melipayamak response:", data);

// //     if (data && data.RetStatus !== 1) {
// //       throw new Error(data.StrRetStatus || "خطا در ارسال");
// //     }

// //     return data;
// //   } catch (error) {
// //     console.log(error);
// //     throw new Error("خطای در ارسال پیامک رخ داده است ");
// //   }
// // }
// // lib/sms.js
// const SMS_IR_API_URL = "https://api.sms.ir/v1/send/verify";

// export async function sendSms(phone, code) {
//   const response = await fetch(SMS_IR_API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "text/plain",
//       "X-API-KEY": process.env.SMS_IR_API_KEY,
//     },
//     body: JSON.stringify({
//       mobile: phone,
//       templateId: Number(process.env.SMS_IR_TEMPLATE_ID),
//       parameters: [{ name: "Code", value: String(code) }],
//     }),
//   });

//   const data = await response.json();
//   console.log(data);

//   if (data?.status !== 1) {
//     throw new Error(data?.message || "خطا در ارسال پیامک");
//   }

//   return data;
// }
