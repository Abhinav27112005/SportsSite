import { sendOTPEmail } from './utils/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test email sending
async function testEmailSending() {
  console.log('=== EMAIL VERIFICATION TEST ===');
  console.log('Starting email test...');
  
  try {
    // Use the same email as the sender for testing
    const testEmail = process.env.EMAIL_FROM || 'deploymenti000@gmail.com';
    const testName = 'Test User';
    const testOTP = '123456';
    
    console.log(`Sending test email to ${testEmail}...`);
    
    const result = await sendOTPEmail(testEmail, testName, testOTP);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('✅ Email verification should now be working in the application.');
      console.log('✅ Users should receive verification emails when they register.');
    } else {
      console.error('❌ Failed to send test email.');
      console.error('❌ Email verification may still not be working in the application.');
    }
    
    console.log('\nEmail Configuration Summary:');
    console.log('- Primary Email Service: Nodemailer (Gmail SMTP)');
    console.log('- Fallback Email Service: Brevo API');
    console.log('- From Email:', process.env.EMAIL_FROM || 'deploymenti000@gmail.com');
    console.log('- From Name:', process.env.EMAIL_FROM_NAME || 'Sports Club');
    console.log('- SMTP Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
    console.log('- SMTP Port:', process.env.SMTP_PORT || '465');
    console.log('- SMTP Secure:', process.env.SMTP_SECURE || 'true');
    
    console.log('\nTroubleshooting Tips:');
    console.log('1. If emails are still not being received, check spam/junk folders');
    console.log('2. Verify that the Gmail account has "Less secure app access" enabled');
    console.log('3. Ensure the Gmail password is correct and is an "App Password" if 2FA is enabled');
    console.log('4. For Brevo API, generate a new API key from the Brevo dashboard');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testEmailSending();