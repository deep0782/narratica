'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { BookOpen, Eye, EyeOff, Shield, Heart, CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface PasswordStrength {
  score: number
  feedback: string[]
  isValid: boolean
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    guardianType: 'parent' as 'parent' | 'guardian' | 'educator'
  })
  
  const [agreements, setAgreements] = useState({
    parentGuardian: false,
    ageConfirmation: false,
    privacyPolicy: false,
    childSafety: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClientComponentClient()
  const router = useRouter()

  // Password strength validation with child-safety considerations
  const validatePassword = (password: string): PasswordStrength => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Password must be at least 8 characters long')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include at least one uppercase letter')
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include at least one lowercase letter')
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Include at least one number')
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include at least one special character')
    }

    // Child-safety password checks
    const unsafeWords = ['child', 'kid', 'baby', 'son', 'daughter', 'family']
    const hasUnsafeWords = unsafeWords.some(word => 
      password.toLowerCase().includes(word)
    )
    
    if (hasUnsafeWords) {
      feedback.push('Avoid using family-related words for security')
      score = Math.max(0, score - 1)
    }

    return {
      score,
      feedback,
      isValid: score >= 4 && !hasUnsafeWords
    }
  }

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }))
    setPasswordStrength(validatePassword(password))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!passwordStrength.isValid) {
      setError('Please create a stronger password following the guidelines')
      return
    }

    // Check all agreements
    const allAgreements = Object.values(agreements).every(Boolean)
    if (!allAgreements) {
      setError('Please accept all required agreements to continue')
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            guardian_type: formData.guardianType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user && !data.user.email_confirmed_at) {
        setSuccess('Please check your email and click the verification link to complete your registration.')
      } else {
        router.push('/dashboard')
      }

    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error.message || 'An error occurred during registration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 3) return 'bg-yellow-500'
    if (score <= 4) return 'bg-green-500'
    return 'bg-green-600'
  }

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak'
    if (score <= 2) return 'Weak'
    if (score <= 3) return 'Fair'
    if (score <= 4) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Back to Home */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Narratica
            </span>
          </Link>
          
          {/* Back to Home Link */}
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join thousands of families creating magical stories</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Child-Safe Platform</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>COPPA Compliant</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="rounded-lg"
                  required
                />
              </div>

              {/* Guardian Type */}
              <div className="space-y-2">
                <Label htmlFor="guardianType">I am a *</Label>
                <select
                  id="guardianType"
                  value={formData.guardianType}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="educator">Educator</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-lg"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                            <XCircle className="h-3 w-3 text-red-400" />
                            <span>{feedback}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {passwordStrength.isValid && (
                      <div className="flex items-center space-x-2 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Password meets security requirements</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs text-red-600">
                    <XCircle className="h-3 w-3" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>

              {/* Agreements */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="parentGuardian"
                    checked={agreements.parentGuardian}
                    onCheckedChange={(checked) => 
                      setAgreements(prev => ({ ...prev, parentGuardian: checked as boolean }))
                    }
                  />
                  <Label htmlFor="parentGuardian" className="text-sm leading-relaxed">
                    I confirm that I am a parent, guardian, or educator responsible for the children whose stories I will create
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="ageConfirmation"
                    checked={agreements.ageConfirmation}
                    onCheckedChange={(checked) => 
                      setAgreements(prev => ({ ...prev, ageConfirmation: checked as boolean }))
                    }
                  />
                  <Label htmlFor="ageConfirmation" className="text-sm leading-relaxed">
                    I confirm that I am 18 years of age or older
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="childSafety"
                    checked={agreements.childSafety}
                    onCheckedChange={(checked) => 
                      setAgreements(prev => ({ ...prev, childSafety: checked as boolean }))
                    }
                  />
                  <Label htmlFor="childSafety" className="text-sm leading-relaxed">
                    I understand and agree to the{' '}
                    <Link href="/child-safety" className="text-purple-600 hover:underline">
                      Child Safety Policy
                    </Link>{' '}
                    and will only create age-appropriate content
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyPolicy"
                    checked={agreements.privacyPolicy}
                    onCheckedChange={(checked) => 
                      setAgreements(prev => ({ ...prev, privacyPolicy: checked as boolean }))
                    }
                  />
                  <Label htmlFor="privacyPolicy" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-purple-600 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-purple-600 hover:underline">
                      Terms of Service
                    </Link>
                  </Label>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !Object.values(agreements).every(Boolean) || !passwordStrength.isValid}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg py-3 font-semibold"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-purple-600 hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <Shield className="h-3 w-3 text-green-400 mr-1" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 text-red-400 mr-1" />
              <span>Child-Safe Platform</span>
            </div>
          </div>
        </div>

        {/* Additional Navigation */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Return to Narratica Home
          </Link>
        </div>
      </div>
    </div>
  )
}
