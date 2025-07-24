import Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize Brevo client
let apiInstance;
let apiKey;

try {
  apiInstance = new Brevo.TransactionalEmailsApi();
  apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.EMAIL_API_KEY;
  console.log('Brevo API client initialized successfully');
} catch (error) {
  console.error('Error initializing Brevo API client:', error);
}

// Fallback nodemailer configuration
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send OTP email using Brevo API
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - One-time password
 * @returns {Promise<boolean>} - Success status
 */
// export const sendOTPEmail = async (email, name, otp,retries=2) => {
//   try {
//     console.log('Attempting to send OTP email to:', email);
//     console.log('Email configuration:', {
//       apiKey: process.env.EMAIL_API_KEY ? `Set (hidden, starts with: ${process.env.EMAIL_API_KEY.substring(0, 10)}...)` : 'Not set',
//       from: process.env.EMAIL_FROM,
//       fromName: process.env.EMAIL_FROM_NAME,
//       smtpHost: process.env.SMTP_HOST,
//       smtpUser: process.env.SMTP_USER ? 'Set (hidden)' : 'Not set',
//       smtpPass: process.env.SMTP_PASS ? 'Set (hidden)' : 'Not set'
//     });
    
//     // Check if API key has the correct format
//     if (!process.env.EMAIL_API_KEY.startsWith('xkeysib-')) {
//       console.warn('WARNING: Brevo API key does not start with "xkeysib-". This may cause authentication issues.');
//       console.warn('Current API key format:', process.env.EMAIL_API_KEY.substring(0, 10) + '...');
//     }
    
//     // Log Brevo authentication details
//     console.log('Brevo authentication:', {
//       apiKeySet: apiKey && apiKey.apiKey ? 'Yes' : 'No',
//       apiKeyStartsWith: apiKey && apiKey.apiKey ? apiKey.apiKey.substring(0, 10) + '...' : 'N/A'
//     });
    
//     // Prepare email content
//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
//           <h1 style="color: #003973; text-align: center;">Email Verification</h1>
//           <p>Hello ${name},</p>
//           <p>Thank you for registering with Sports Club. To complete your registration, please use the following verification code:</p>
//           <div style="text-align: center; margin: 30px 0;">
//             <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; display: inline-block;">${otp}</div>
//           </div>
//           <p>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
//           <p>If you did not request this verification, please ignore this email.</p>
//           <p>Best regards,<br>${process.env.EMAIL_FROM_NAME || 'Sports Club'} Team</p>
//         </div>
//       </body>
//       </html>
//     `;
    
//     // Check if Nodemailer transporter is available and use it first since it's working
//     if (transporter) {
//       try {
//         console.log('Attempting to send email via Nodemailer...');
//         const info= await transporter.sendMail({
//           from: `"${process.env.EMAIL_FROM_NAME || 'Sports Club'}" <${process.env.EMAIL_FROM || 'noreply@sportsclub.com'}>`,
//           to: email,
//           subject: 'Verify Your Email Address',
//           html: htmlContent,
//           priority: 'high'
//         });
//         console.log('Email sent via Nodemailer:', info.messageId);
//         console.log('Email sent successfully via Nodemailer!');
//         return true;
//       } catch (nodemailerError) {

//         console.error('Nodemailer email sending failed:', nodemailerError);
//         console.error('Nodemailer error details:', JSON.stringify(nodemailerError, null, 2));
//          if (retries > 0) {
//           console.log(`Retrying with Nodemailer (${retries} attempts left)`);
//           return sendOTPEmail(email, name, otp, retries - 1);
//         }

//         // If Nodemailer fails, try Brevo as fallback
//       }
//     }
    
//     // Try Brevo if Nodemailer is not available or failed
//     if (apiInstance && apiKey) {
//       try {
//         const sendSmtpEmail = new Brevo.SendSmtpEmail({
//           sender: { 
//             email: process.env.EMAIL_FROM || "noreply@sportsclub.com", 
//             name: process.env.EMAIL_FROM_NAME || "Sports Club" 
//           },
//           subject: "Verify Your Email Address",
//           htmlContent: htmlContent,
//           to: [{ email, name }]
//         });
//         console.log('Sending email via Brevo API...');
//         await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log('Email sent successfully via Brevo!');
//         return true;
//       } catch (brevoError) {
//         console.error('Brevo email sending failed:', brevoError);
//         console.error('Brevo error details:', JSON.stringify(brevoError, null, 2));
        
//         // Log more specific error information
//         if (brevoError.response) {
//           console.error('Brevo API response error:', {
//             status: brevoError.response.status,
//             statusText: brevoError.response.statusText,
//             data: brevoError.response.data
//           });
//         } else if (brevoError.request) {
//           console.error('Brevo API request error (no response received):', brevoError.request);
//         } else {
//           console.error('Brevo API setup error:', brevoError.message);
//         }
        
//         // Check common authentication issues
//         if (brevoError.message && brevoError.message.includes('authentication')) {
//           console.error('This appears to be an authentication issue. Please verify your Brevo API key.');
//         }
        
//         // If we've already tried Nodemailer and it failed, we'll reach this point
//         // and return false since both methods failed
//         console.log("Both method failed");
//         return false;
//       }
//     } else {
//       console.error('Brevo API client not properly initialized');
//       return false;
//     }
//   } catch (error) {
//     console.error('Unexpected error in sendOTPEmail:', error);
//     return false;
//   }
// };
export const sendOTPEmail = async (email, name, otp, retries = 2) => {
  // Prepare email content
  // const htmlContent = `
  //   <!DOCTYPE html>
  //   <html>
  //   <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  //     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
  //       <h1 style="color: #003973; text-align: center;">Email Verification</h1>
  //       <p>Hello ${name},</p>
  //       <p>Thank you for registering with Sports Club. To complete your registration, please use the following verification code:</p>
  //       <div style="text-align: center; margin: 30px 0;">
  //         <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; display: inline-block;">${otp}</div>
  //       </div>
  //       <p>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
  //       <p>If you did not request this verification, please ignore this email.</p>
  //       <p>Best regards,<br>${process.env.EMAIL_FROM_NAME || 'Sports Club'} Team</p>
  //     </div>
  //   </body>
  //   </html>
  // `;
  const htmlContent = `
      '<!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h1 style="color: #003973; text-align: center;">Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Thank you for registering with Sports Club. To complete your registration, please use the following verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; display: inline-block;">${otp}</div>
          </div>
          <p>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>${process.env.EMAIL_FROM_NAME || 'Sports Club'} Team</p>
        </div>
      </body>
      </html>'`;

  // Try Nodemailer first
  if (transporter) {
    try {
      console.log('Attempting to send email via Nodemailer...');
      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Sports Club'}" <${process.env.EMAIL_FROM || 'noreply@sportsclub.com'}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: htmlContent,
        priority: 'high'
      });
      console.log('Email sent via Nodemailer:', info.messageId);
      return true;
    } catch (nodemailerError) {
      console.error('Nodemailer email sending failed:', nodemailerError);
      if (retries > 0) {
        console.log(`Retrying with Nodemailer (${retries} attempts left)`);
        return sendOTPEmail(email, name, otp, retries - 1);
      }
      // If Nodemailer fails, try Brevo next
    }
  }

  // Try Brevo if Nodemailer is not available or failed
  if (apiInstance && apiKey) {
    try {
      const sendSmtpEmail = new Brevo.SendSmtpEmail({
        sender: {
          email: process.env.EMAIL_FROM || "noreply@sportsclub.com",
          name: process.env.EMAIL_FROM_NAME || "Sports Club"
        },
        subject: "Verify Your Email Address",
        htmlContent: htmlContent,
        to: [{ email, name }]
      });
      console.log('Sending email via Brevo API...');
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent successfully via Brevo!');
      return true;
    } catch (brevoError) {
      console.error('Brevo email sending failed:', brevoError);
      return false;
    }
  } else {
    console.error('Brevo API client not properly initialized');
    return false;
  }
};
/**
 * Generate a random OTP with configurable length
 * @returns {string} - OTP with length specified in environment variables
 */
export const generateOTP = () => {
  const length = parseInt(process.env.OTP_LENGTH || 6, 10);
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Calculate OTP expiry time based on environment variables
 * @returns {Date} - OTP expiry date
 */
export const calculateOTPExpiry = () => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || 10, 10);
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
  return expiry;
};