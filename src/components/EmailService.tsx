import React from 'react';
import toast from 'react-hot-toast';

interface EmailServiceProps {
  to: string;
  subject: string;
  body: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Email service component for handling password reset emails
export class EmailService {
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      // In a real application, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer with SMTP
      
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
      
      const emailContent = {
        to: email,
        subject: 'Tech School - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7c3aed; margin: 0;">Tech School</h1>
              <p style="color: #666; margin: 5px 0;">Portfolio Management System</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #666; line-height: 1.6;">
                We received a request to reset your password for your Tech School admin account.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                This link will expire in 24 hours for security reasons.
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© 2025 Tech School. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        `
      };

      // For demo purposes, we'll simulate the email sending
      console.log('Sending password reset email:', emailContent);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In demo mode, show the reset information
      toast.success('Password reset email sent successfully!');
      
      // For demo purposes, show the reset credentials after a delay
      setTimeout(() => {
        toast.success('Demo Mode: Your password is "admin@123"', { 
          duration: 8000,
          icon: '🔑'
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      toast.error('Failed to send password reset email');
      return false;
    }
  }

  static async sendWelcomeEmail(email: string, tempPassword: string): Promise<boolean> {
    try {
      const emailContent = {
        to: email,
        subject: 'Welcome to Tech School - Your Admin Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7c3aed; margin: 0;">Welcome to Tech School</h1>
              <p style="color: #666; margin: 5px 0;">Portfolio Management System</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Your Admin Account is Ready!</h2>
              <p style="color: #666; line-height: 1.6;">
                Your admin account has been created successfully. Here are your login credentials:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #7c3aed;">
                <p style="margin: 0; color: #333;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0 0 0; color: #333;"><strong>Temporary Password:</strong> ${tempPassword}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Please log in and change your password immediately for security reasons.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/login" 
                   style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Login Now
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© 2025 Tech School. All rights reserved.</p>
            </div>
          </div>
        `
      };

      console.log('Sending welcome email:', emailContent);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Welcome email sent successfully!');
      return true;
    } catch (error) {
      console.error('Welcome email error:', error);
      toast.error('Failed to send welcome email');
      return false;
    }
  }
}

export default EmailService;