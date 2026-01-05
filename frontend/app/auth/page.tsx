'use client'
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Github } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { loginTranslations } from '@/i18n/translations-login';
import { LanguageSelector } from '@/components/layouts/LanguageSelector';
import {useState} from "react";
import {Logo} from "@/components/layouts/Logo";


type LoginMode = 'signin' | 'signup';

export function LoginPage() {
  const { language } = useTranslation();
  const { login } = useUser();
  const t = loginTranslations[language].login;

  const [mode, setMode] = useState<LoginMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError(t.errors.requiredField);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t.errors.invalidEmail);
      return false;
    }

    if (formData.password.length < 8) {
      setError(t.errors.passwordTooShort);
      return false;
    }

    if (mode === 'signup') {
      if (!formData.firstName || !formData.lastName) {
        setError(t.errors.requiredField);
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError(t.errors.passwordMismatch);
        return false;
      }

      if (!formData.agreeTerms) {
        setError(t.errors.requiredField);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(t.errors.loginFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    console.log(`Login with ${provider}`);
    // TODO: Implement OAuth
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-primary/5 via-background to-chart-3/5">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center flex flex-col items-center space-y-4 mb-8">
            <Logo/>
            <h1 className="text-foreground mb-2">
              {mode === 'signin' ? t.title : t.signUpTitle}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signin' ? t.subtitle : t.signUpSubtitle}
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <LanguageSelector />
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sign Up Fields */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.firstName}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        required={mode === 'signup'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.lastName}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                        required={mode === 'signup'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-12 py-2.5 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Remember Me / Terms */}
              {mode === 'signin' ? (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-sm text-muted-foreground">{t.rememberMe}</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
              ) : (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    required
                  />
                  <span className="text-sm text-muted-foreground">
                    {t.termsAgree}{' '}
                    <a href="#" className="text-primary hover:underline">{t.termsLink}</a>
                    {' '}{language === 'fr' ? 'et la' : 'and'}{' '}
                    <a href="#" className="text-primary hover:underline">{t.privacyLink}</a>
                  </span>
                </label>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t.signingIn : (mode === 'signin' ? t.signIn : t.signUp)}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">{t.orContinueWith}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex w-full items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/80 border border-border rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm text-foreground">Google</span>
                </button>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? t.noAccount : t.haveAccount}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary w-full hover:underline font-medium"
                >
                  {mode === 'signin' ? t.signUp : t.signIn}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary to-chart-3 p-12 items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-4xl mb-6">DataSpeak</h2>
          <p className="text-xl text-white/90 mb-8">
            {language === 'fr'
              ? 'Transformez vos données en conversations intelligentes'
              : language === 'es'
                ? 'Transforma tus datos en conversaciones inteligentes'
                : language === 'de'
                  ? 'Verwandeln Sie Ihre Daten in intelligente Gespräche'
                  : 'Transform your data into intelligent conversations'
            }
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
