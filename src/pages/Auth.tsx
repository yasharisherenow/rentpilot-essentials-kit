import { useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react'; // Add this import for icons

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Update signupSchema to include confirmPassword and match check
const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  role: z.enum(['landlord', 'tenant'], { 
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
  const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[strength]} transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      <p className={`text-xs mt-1 ${colors[strength].replace('bg-', 'text-')}`}>
        {password && labels[strength]}
      </p>
    </div>
  );
};

const PasswordRequirements: React.FC<{ password: string }> = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One number', test: (pw: string) => /[0-9]/.test(pw) },
    { label: 'One special character', test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
  ];

  return (
    <ul className="mt-2 mb-1 text-xs space-y-1">
      {requirements.map((req, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <span className={req.test(password) ? "text-green-400" : "text-slate-400"}>
            {req.test(password) ? "✔" : "✖"}
          </span>
          <span className={req.test(password) ? "text-green-400" : "text-slate-400"}>
            {req.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null); // Add this state
  const navigate = useNavigate(); // Add this line
  const [signupSuccess, setSignupSuccess] = useState(false); // Add this state

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'tenant',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setSignupError(null);
    setSignupSuccess(false);
    try {
      await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      });
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/dashboard'); // Redirect after 2 seconds (change path as needed)
      }, 2000);
    } catch (error: any) {
      if (error?.message) {
        setSignupError(error.message);
      } else {
        setSignupError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 container max-w-md mx-auto">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-slate-700/30 to-slate-800/50 border-b border-slate-700/50">
            <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Welcome to RentPilot
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg">
              Sign in to access your account or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-8 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-semibold transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-semibold transition-all duration-200"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="email@example.com" 
                              type="email" 
                              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium">Password</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John" 
                                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-300 font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Doe" 
                                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="email@example.com" 
                              type="email" 
                              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="••••••••" 
                                type={showSignupPassword ? "text" : "password"}
                                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200 pr-10"
                                {...field} 
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400"
                                onClick={() => setShowSignupPassword((v) => !v)}
                                tabIndex={-1}
                              >
                                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <PasswordRequirements password={field.value} />
                          <PasswordStrength password={field.value} />
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    {/* In the signup form, add the Confirm Password field after the Password field */}
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300 font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="••••••••"
                                type={showSignupPassword ? "text" : "password"}
                                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-yellow-400 focus:ring-yellow-400/20 focus:ring-2 transition-all duration-200 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400"
                                onClick={() => setShowSignupPassword((v) => !v)}
                                tabIndex={-1}
                              >
                                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-slate-300 font-medium">I am a:</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="landlord" 
                                  id="landlord" 
                                  className="border-slate-600 text-yellow-400 focus:ring-yellow-400/20"
                                />
                                <Label htmlFor="landlord" className="text-slate-300 cursor-pointer">Landlord</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="tenant" 
                                  id="tenant" 
                                  className="border-slate-600 text-yellow-400 focus:ring-yellow-400/20"
                                />
                                <Label htmlFor="tenant" className="text-slate-300 cursor-pointer">Tenant</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    {signupSuccess && (
                      <div className="text-green-400 text-sm text-center mb-2">
                        Account created successfully! Redirecting...
                      </div>
                    )}
                    {signupError && (
                      <div className="text-red-400 text-sm text-center mb-2">
                        {signupError}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col bg-slate-900/50 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 text-center">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-yellow-400 transition-colors">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
