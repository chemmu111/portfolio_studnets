import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const token = searchParams.get('token');

  useEffect(() => {
    // Validate the reset token
    if (token) {
      // In a real app, you would validate the token with your backend
      // For demo purposes, we'll accept any token
      setIsValidToken(true);
    } else {
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]);
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would send the token and new password to your backend
      const success = await updatePassword?.(newPassword);
      
      if (success) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password. Please try again.');
    }

    setLoading(false);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={goToLogin}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
          >
            <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your password has been updated successfully. You will be redirected to the login page shortly.
          </p>
          <button
            onClick={goToLogin}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <span>Go to Login</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="card-bg backdrop-blur-sm rounded-xl p-6 sm:p-8 w-full max-w-md card-border"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-600/20 rounded-full mb-4"
          >
            <Lock className="text-purple-600 dark:text-purple-400" size={24} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Set New Password
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-secondary">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={16} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 input-bg input-border rounded-lg input-focus transition-all duration-300 text-primary placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors duration-300"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={16} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 input-bg input-border rounded-lg input-focus transition-all duration-300 text-primary placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Confirm new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors duration-300"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li className={`flex items-center space-x-2 ${newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                <span>{newPassword.length >= 8 ? '✓' : '•'}</span>
                <span>At least 8 characters</span>
              </li>
              <li className={`flex items-center space-x-2 ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <span>{/(?=.*[a-z])/.test(newPassword) ? '✓' : '•'}</span>
                <span>One lowercase letter</span>
              </li>
              <li className={`flex items-center space-x-2 ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <span>{/(?=.*[A-Z])/.test(newPassword) ? '✓' : '•'}</span>
                <span>One uppercase letter</span>
              </li>
              <li className={`flex items-center space-x-2 ${/(?=.*\d)/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <span>{/(?=.*\d)/.test(newPassword) ? '✓' : '•'}</span>
                <span>One number</span>
              </li>
              <li className={`flex items-center space-x-2 ${/(?=.*[@$!%*?&])/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <span>{/(?=.*[@$!%*?&])/.test(newPassword) ? '✓' : '•'}</span>
                <span>One special character</span>
              </li>
            </ul>
          </div>

          <motion.button
            type="submit"
            disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
            className="w-full px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              'Reset Password'
            )}
          </motion.button>

          <div className="text-center">
            <button
              type="button"
              onClick={goToLogin}
              className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;