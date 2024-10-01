'use client';
import React, {useEffect, useState} from 'react';
import { z } from 'zod';
import {account} from "@/lib/config/appwrite";
import {AppwriteException, ID} from "appwrite";
import {useRouter} from "next/navigation";
import {Button} from "flowbite-react";


const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

function Signup() {
    const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] =
        useState<{email: string | null, password: string | null, confirmPassword: string | null}>({ email: null, password: null, confirmPassword: null });

    const [signingUp, setSigningUp] = useState(false)
    const [signupError, setSignupError] = useState<string | null>(null)

    const router = useRouter()

    const signup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignupError(null)
        setSigningUp(true)

        const parsed = validateForm()
        if (parsed) {
            const nameMatch = parsed.data.email.match(/^([^@]*)@/);
            const name = nameMatch ? nameMatch[1] : 'User';
            account.create(ID.unique(), parsed.data.email, parsed.data.password, name).then(
                () => {
                    router.push('/login?signupSuccess=true')
                    setSigningUp(false)
                },
                (error: AppwriteException) => {
                    setSignupError(error.message)
                    setSigningUp(false)
                }
            )
        } else {
            setSigningUp(false)
        }
    }

    const validateForm = () => {
        const parsed = signupSchema.safeParse(signupData);
        if (!parsed.success) {
            const formattedErrors = parsed.error.format();
            setErrors({
                email: formattedErrors.email?._errors[0] || null,
                password: formattedErrors.password?._errors[0] || null,
                confirmPassword: formattedErrors.confirmPassword?._errors[0] || null,
            });
            return null
        } else {
            setErrors({email: null, password: null, confirmPassword: null});
            return parsed
        }
    }

    useEffect(() => {
        validateForm()
    }, [signupData]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 my-4">
            {signupError &&
                <div id="alert-border-2"
                     className="z-20 flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
                     role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <div className="ms-3 text-sm font-medium">
                        {signupError}
                    </div>
                    <button type="button"
                            className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                            data-dismiss-target="#alert-border-2" aria-label="Close">
                        <span className="sr-only">Dismiss</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            }

            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-3">
                <div
                    className="w-full bg-white rounded shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={signup}>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       value={signupData.email}
                                       onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="name@company.com"/>
                                {(errors.email && signupData.email) &&
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>
                                }
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       value={signupData.password}
                                       onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"/>
                                {(errors.password && signupData.password) &&
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>
                                }
                            </div>
                            <div>
                                <label htmlFor="confirm-password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                    password</label>
                                <input type="password" name="confirm-password" id="confirm-password"
                                       placeholder="••••••••"
                                       value={signupData.confirmPassword}
                                       onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"/>
                                {(errors.confirmPassword && signupData.confirmPassword) &&
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.confirmPassword}</p>
                                }
                            </div>
                            <Button disabled={!!(errors.email || errors.password || errors.confirmPassword)} isProcessing={signingUp}
                                    type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Create an account
                            </Button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/login"
                                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Login here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;