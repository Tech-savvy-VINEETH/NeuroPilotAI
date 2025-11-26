import { Brain } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
}

export function LoginScreen({ onContinueAsGuest }: LoginScreenProps) {
  // Features for the left side
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Productivity',
      description: 'Intelligent task management with smart prioritization and time estimation.'
    },
    {
      icon: '📅',
      title: 'Calendar Integration',
      description: 'Seamless Google Calendar sync with focus time analysis.'
    },
    {
      icon: '💬',
      title: 'Smart AI Assistant',
      description: 'Chat with your productivity copilot for personalized insights.'
    },
    {
      icon: '✅',
      title: 'Task Automation',
      description: 'Natural language task creation with automatic categorization.'
    }
  ];

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
              Transform your productivity with AI-powered task management, smart calendar integration, and personalized insights.
            </p>
          </div>
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span className="text-sm text-gray-300">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⚡</span>
              <span className="text-sm text-gray-300">Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✨</span>
              <span className="text-sm text-gray-300">AI-Enhanced</span>
            </div>
          </div>
        </div>
        {/* Right Side - Continue as Guest */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome</h2>
          <p className="text-gray-600 mb-8">Sign in with your Google account or continue as a guest to explore the app.</p>
          <div className="w-full flex flex-col gap-4">
            <GoogleLogin
              onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                  localStorage.setItem('googleAccessToken', credentialResponse.credential);
                  window.location.reload(); // Reload to enter the app as authenticated
                }
              }}
              onError={() => {
                alert('Google Login Failed');
              }}
              useOneTap
            />
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <button
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700"
              onClick={onContinueAsGuest}
            >
              <span>Continue as Guest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}