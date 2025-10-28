// Diagnostic endpoint to check environment variables
export default async function handler(req, res) {
  // Check which environment variables are set (without revealing values)
  const envStatus = {
    EMAIL_SERVICE: !!process.env.EMAIL_SERVICE,
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
    EMAIL_TO: !!process.env.EMAIL_TO,
    // Show first 3 characters of EMAIL_USER if set (for verification)
    EMAIL_USER_PREFIX: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '...' : 'NOT SET',
    EMAIL_TO_PREFIX: process.env.EMAIL_TO ? process.env.EMAIL_TO.substring(0, 3) + '...' : 'NOT SET'
  };

  return res.status(200).json({
    message: 'Environment variable status',
    variables: envStatus,
    allConfigured: envStatus.EMAIL_SERVICE && envStatus.EMAIL_USER && envStatus.EMAIL_PASS && envStatus.EMAIL_TO
  });
}
