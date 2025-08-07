'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, ArrowLeft, Home } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

interface PasswordStrength {
  score: number
  feedback: string[]
  isValid: boolean
}

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
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
  const [success, setSuccess] = useState(false)

  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have the necessary tokens from the email link
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [searchParams])

  // Password strength validation (same as signup)
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

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in both password fields')
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

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error: any) {
      console.error('Password reset error:', error)
      setError('Failed to update password. Please try again or request a new reset link.')
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 text-center">
            <CardContent className="p-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h1>
              <p className="text-gray-600 mb-6">
                Your password has been successfully updated. You'll be redirected to your dashboard shortly.
              </p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Create a new secure password for your account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password *</Label>
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
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
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

              {/* Error Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !passwordStrength.isValid || formData.password !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg py-3 font-semibold"
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <Link href="/auth/signin" className="text-purple-600 hover:underline font-semibold">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

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
