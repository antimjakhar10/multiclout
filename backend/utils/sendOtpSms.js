const axios = require("axios");

const sendOtpSms = async ({ mobile, otp, purpose = "access" }) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: `91${mobile}`,
            OTP: otp,
          },
        ],
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 success:", response.data);

    return {
      success: true,
      provider: "msg91",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "MSG91 Error:",
      error?.response?.data || error.message || error
    );

    return {
      success: false,
      provider: "msg91",
      error: error?.response?.data || error.message || "MSG91 request failed",
    };
  }
};

module.exports = sendOtpSms;