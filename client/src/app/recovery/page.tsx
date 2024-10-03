'use client';
import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {account} from "@/lib/config/appwrite";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "flowbite-react";
import useGitConnectStore from "@/lib/zustand";
import {AppwriteException} from "appwrite";
import env from "@/env";


const forgotSchema = z.object({
    email: z.string().email('Invalid email address'),
});
const resetSchema = z.object({
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

function Recovery() {
    const [recoveryData, setRecoveryData] = useState({ email: '', password: '', confirmPassword: '' });
    const [forgotErrors, setForgotErrors] = useState<{email: string | null}>({ email: null});
    const [resetErrors, setResetErrors] =
        useState<{password: string | null, confirmPassword: string | null}>({password: null, confirmPassword: null });

    const [recovering, setRecovering] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [recoveringError, setRecoveringError] = useState<string | null>(null)

    const {user} = useGitConnectStore()

    const queryParams = useSearchParams()
    const router = useRouter()

    const userId = queryParams.get('userId')
    const secret = queryParams.get('secret')

    useEffect(() => {
        if(user) router.push('/feed')
    }, [user]);

    const recover = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRecovering(true)
        setRecoveringError(null)
        setEmailSent(false)

        if(userId && secret) {
            const parsed = validateResetForm();
            if (!parsed) {
                setRecovering(false)
            } else {
                account.updateRecovery(userId, secret, parsed.data.password)
                    .then(()=> {
                        setRecoveringError(null)
                        router.push('/login?reset=true')
                    })
                    .catch(error => {
                        setRecoveringError((error as AppwriteException).message)
                    })
                    .finally(()=> {
                        setRecovering(false)
                    })
            }

        } else {
            const parsed = validateForgotForm();
            if (!parsed) {
                setRecovering(false)
            } else {
                account.createRecovery(parsed.data.email, env.NEXT_PUBLIC_BASE_URL + '/recovery')
                    .then(()=> {
                        setRecoveringError(null)
                        setEmailSent(true)
                    })
                    .catch(error => {
                        setRecoveringError((error as AppwriteException).message)
                    })
                    .finally(()=> {
                        setRecovering(false)
                    })
            }
        }
    }

    const validateForgotForm = () => {
        const parsed = forgotSchema.safeParse(recoveryData);
        if (!parsed.success) {
            const formattedErrors = parsed.error.format();
            setForgotErrors({
                email: formattedErrors.email?._errors[0] || null,
            });
            return null
        } else {
            setForgotErrors({email: null});
            return parsed
        }
    }

    const validateResetForm = () => {
        const parsed = resetSchema.safeParse(recoveryData);
        if (!parsed.success) {
            const formattedErrors = parsed.error.format();
            setResetErrors({
                password: formattedErrors.password?._errors[0] || null,
                confirmPassword: formattedErrors.confirmPassword?._errors[0] || null,
            });
            return null
        } else {
            setResetErrors({password: null, confirmPassword: null});
            return parsed
        }
    }

    useEffect(() => {
        if(userId && secret) {
            validateResetForm()
        } else {
            validateForgotForm()
        }
    }, [recoveryData, userId, secret]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className='fixed w-full top-[60px] z-50'>
                {emailSent &&
                    <div id="alert-border-3"
                         className="z-20 flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
                         role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div className="ms-3 text-sm font-medium">
                            Please check your inbox and spam folder for a password recovery link.
                        </div>
                        <button type="button"
                                className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                                data-dismiss-target="#alert-border-3" aria-label="Close">
                            <span className="sr-only">Dismiss</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                }

                {recoveringError &&
                    <div id="alert-border-2"
                         className="z-20 flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
                         role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div className="ms-3 text-sm font-medium">
                            {recoveringError}
                        </div>
                        <button type="button" onClick={()=> setRecoveringError(null)}
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
            </div>

            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-3">
                <div
                    className="w-full bg-white rounded shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Forgot Password?
                        </h1>
                        <p className='text-center'>Recover Your Account Here.</p>
                        <form className="space-y-4 md:space-y-6" onSubmit={recover}>
                            {(!userId && !secret) &&
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                        email</label>
                                    <input type="email" name="email" id="email"
                                           value={recoveryData.email}
                                           onChange={(e) => setRecoveryData({...recoveryData, email: e.target.value})}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           placeholder="name@company.com"/>
                                    {(forgotErrors.email && recoveryData.email) &&
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{forgotErrors.email}</p>
                                    }
                                </div>
                            }
                            {(userId && secret) &&
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        New Password
                                    </label>
                                    <input type="password" name="password" id="password" placeholder="••••••••"
                                           value={recoveryData.password}
                                           onChange={(e) => setRecoveryData({
                                               ...recoveryData,
                                               password: e.target.value
                                           })}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           required/>
                                </div>
                            }
                            {(userId && secret) &&
                                <div>
                                    <label htmlFor="confirm-password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Confirm New Password
                                    </label>
                                    <input type="password" name="confirm-password" id="confirm-password"
                                           placeholder="••••••••"
                                           value={recoveryData.confirmPassword}
                                           onChange={(e) => setRecoveryData({
                                               ...recoveryData,
                                               confirmPassword: e.target.value
                                           })}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"/>
                                    {(resetErrors.confirmPassword && recoveryData.confirmPassword) &&
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{resetErrors.confirmPassword}</p>
                                    }
                                </div>
                            }
                            <Button
                                disabled={!!(userId && secret ? (resetErrors.password || resetErrors.confirmPassword) : forgotErrors.email)}
                                isProcessing={recovering}
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                {userId && secret ? 'Reset Password' : 'Forgot Password'}
                            </Button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                <a href="/signup"
                                                              className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Sign up</a> or <a href="/login"
                                                  className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Log in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Recovery;
