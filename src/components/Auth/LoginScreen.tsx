import React, { useState } from 'react';
import { Brain, Calendar, MessageCircle, CheckSquare, Sparkles, Shield, Zap, AlertCircle, X, RefreshCw, Mail, Lock, User, Eye, EyeOff, Send } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onLoginWithRedirect: () => void;
  onEmailLogin: (email: string, password: string) => void;
  onEmailSignUp: (data: { email: string; password: string; displayName: string }) => void;
  onPasswordReset: (email: string) => Promise<boolean>;
  onSendEmailLink: (email: string) => Promise<boolean>;
  loading: boolean;
  authError: string | null;
  onClearError: () => void;
  isDomainAuthorized: boolean;
}

export function LoginScreen({ 
  onLogin, 
  onLoginWithRedirect, 
  onEmailLogin,
  onEmailSignUp,
  onPasswordReset,
  onSendEmailLink,
  loading, 
  authError, 
  onClearError,
  isDomainAuthorized
}: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset' | 'emaillink'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Productivity',
      description: 'Intelligent task management with smart prioritization and time estimation'
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Seamless Google Calendar sync with focus time analysis'
    },
    {
      icon: MessageCircle,
      title: 'Smart AI Assistant',
      description: 'Chat with your productivity copilot for personalized insights'
    },
    {
      icon: CheckSquare,
      title: 'Task Automation',
      description: 'Natural language task creation with automatic categorization'
    }
  ];

  const isPopupError = authError?.toLowerCase().includes('popup');
  const isDomainError = authError?.toLowerCase().includes('domain') || authError?.toLowerCase().includes('unauthorized');
  const isTemporaryError = authError?.toLowerCase().includes('temporarily') || authError?.toLowerCase().includes('invalid action');

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!emailForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (authMode !== 'reset' && authMode !== 'emaillink') {
      if (!emailForm.password) {
        errors.password = 'Password is required';
      } else if (emailForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
    }
    
    if (authMode === 'signup') {
      if (!emailForm.displayName.trim()) {
        errors.displayName = 'Full name is required';
      }
      
      if (emailForm.password !== emailForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (authMode === 'reset') {
      const success = await onPasswordReset(emailForm.email);
      if (success) {
        setResetEmailSent(true);
      }
      return;
    }

    if (authMode === 'emaillink') {
      const success = await onSendEmailLink(emailForm.email);
      if (success) {
        setEmailLinkSent(true);
      }
      return;
    }

    if (authMode === 'signup') {
      onEmailSignUp({
        email: emailForm.email,
        password: emailForm.password,
        displayName: emailForm.displayName
      });
    } else {
      onEmailLogin(emailForm.email, emailForm.password);
    }
  };

  const resetForm = () => {
    setEmailForm({
      email: '',
      password: '',
      displayName: '',
      confirmPassword: ''
    });
    setResetEmailSent(false);
    setEmailLinkSent(false);
    setFormErrors({});
  };

  const switchAuthMode = (mode: 'signin' | 'signup' | 'reset' | 'emaillink') => {
    setAuthMode(mode);
    resetForm();
    onClearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">NeuroPilot AI</h1>
                <p className="text-blue-200">Your Intelligent Productivity Copilot</p>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Transform your productivity with AI-powered task management, 
              smart calendar integration, and personalized insights.
            </p>
          </div>

          <div className="grid gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">AI-Enhanced</span>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {authMode === 'signin' ? 'Welcome Back' : 
                 authMode === 'signup' ? 'Create Account' : 
                 authMode === 'reset' ? 'Reset Password' :
                 'Passwordless Sign-In'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'signin' ? 'Sign in to access your personalized productivity dashboard' :
                 authMode === 'signup' ? 'Join NeuroPilot to boost your productivity' :
                 authMode === 'reset' ? 'Enter your email to receive a password reset link' :
                 'We\'ll send you a secure sign-in link via email'}
              </p>
            </div>

            {/* Domain Authorization Warning */}
            {!isDomainAuthorized && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-800 font-medium">Domain Not Authorized</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Google Sign-In may not work from this domain. Please use email authentication below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{authError}</p>
                    {isTemporaryError && (
                      <p className="text-xs text-red-600 mt-1">
                        This is usually temporary. Please wait 30 seconds and try again.
                      </p>
                    )}
                    {isPopupError && (
                      <p className="text-xs text-red-600 mt-1">
                        Try using the redirect method below, or enable popups for this site in your browser settings.
                      </p>
                    )}
                    {isDomainError && (
                      <p className="text-xs text-red-600 mt-1">
                        Please use email authentication below or access the app from an authorized domain.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClearError}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Success Messages */}
            {resetEmailSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">Reset Email Sent</p>
                    <p className="text-sm text-green-700 mt-1">
                      Check your email for password reset instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {emailLinkSent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <Send className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Sign-In Link Sent</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Check your email and click the link to sign in securely.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Google Sign-In Buttons - Only show if domain is authorized */}
              {isDomainAuthorized && authMode === 'signin' && (
                <div className="space-y-4">
                  <button
                    onClick={onLogin}
                    disabled={loading}
                    className={`w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                      loading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* Redirect Method */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {isPopupError ? 'Popup blocked? Use the redirect method:' : 'Alternative sign-in method:'}
                      </p>
                    </div>
                    <button
                      onClick={onLoginWithRedirect}
                      disabled={loading}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 ${
                        isPopupError 
                          ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                      } text-white rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Redirecting...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          <span>Sign in with Redirect</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Authentication Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={emailForm.email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="displayName"
                        type="text"
                        required
                        value={emailForm.displayName}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, displayName: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white ${
                          formErrors.displayName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {formErrors.displayName && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.displayName}</p>
                    )}
                  </div>
                )}

                {authMode !== 'reset' && authMode !== 'emaillink' && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={emailForm.password}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white ${
                          formErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                    )}
                  </div>
                )}

                {authMode === 'signup' && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={emailForm.confirmPassword}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white ${
                          formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>
                      {authMode === 'signin' ? 'Sign In' :
                       authMode === 'signup' ? 'Create Account' :
                       authMode === 'reset' ? 'Send Reset Email' :
                       'Send Sign-In Link'}
                    </span>
                  )}
                </button>
              </form>

              {/* Auth Mode Switcher */}
              <div className="text-center space-y-2">
                {authMode === 'signin' && (
                  <>
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => switchAuthMode('signup')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      Forgot your password?{' '}
                      <button
                        onClick={() => switchAuthMode('reset')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Reset it
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      Prefer passwordless?{' '}
                      <button
                        onClick={() => switchAuthMode('emaillink')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Email link sign-in
                      </button>
                    </p>
                  </>
                )}
                {authMode === 'signup' && (
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => switchAuthMode('signin')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {(authMode === 'reset' || authMode === 'emaillink') && (
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <button
                      onClick={() => switchAuthMode('signin')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-xs text-gray-500">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">4.9★</div>
                  <div className="text-xs text-gray-500">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}