'use client';
import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {account} from "@/lib/config/appwrite";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "flowbite-react";
import useGitConnectStore from "@/lib/zustand";
import {AppwriteException} from "appwrite";


const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
});

function Login() {
    const [signinData, setSigninData] = useState({ email: '', password: '' });
    const [errors, setErrors] =
        useState<{email: string | null, password: string | null}>({ email: null, password: null });

    const [signingIn, setSigningIn] = useState(false)
    const [signinError, setSigninError] = useState<string | null>(null)

    const {setReloadUser} = useGitConnectStore()

    const router = useRouter()
    const params = useSearchParams()

    const signin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSigningIn(true)
        setSigninError(null)

        const parsed = validateForm();
        if (!parsed) {
            setSigningIn(false)
        } else {
            account.createEmailPasswordSession(parsed.data.email, parsed.data.password).then(
                () => {
                    setReloadUser()
                    setSigningIn(false)
                    setTimeout(()=> window.location.reload(), 500)
                },
                (error: AppwriteException) => {
                    // const errorMessage = error.code == 400
                    //     ? "Invalid credentials. Please check the email and password." : error.message
                    setSigninError(error.message)
                    setSigningIn(false)
                }
            )
        }
    }

    const validateForm = () => {
        const parsed = signinSchema.safeParse(signinData);
        if (!parsed.success) {
            const formattedErrors = parsed.error.format();
            setErrors({
                email: formattedErrors.email?._errors[0] || null,
                password: formattedErrors.password?._errors[0] || null,
            });
            return null
        } else {
            setErrors({email: null, password: null});
            return parsed
        }
    }

    useEffect(() => {
        validateForm()
    }, [signinData]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className='fixed w-full top-[60px] z-50'>
                {params.get('signupSuccess') &&
                    <div id="alert-border-3"
                         className="z-20 flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
                         role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div className="ms-3 text-sm font-medium">
                            Thanks for signing up. Please log in to start posting and networking. 🎉
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

                {signinError &&
                    <div id="alert-border-2"
                         className="z-20 flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
                         role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div className="ms-3 text-sm font-medium">
                            {signinError}
                        </div>
                        <button type="button" onClick={()=> setSigninError(null)}
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
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={signin}>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       value={signinData.email}
                                       onChange={(e) => setSigninData({...signinData, email: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="name@company.com" required/>
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       value={signinData.password}
                                       onChange={(e) => setSigninData({...signinData, password: e.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       required/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    {/*<div className="flex items-center h-5">*/}
                                    {/*    <input id="remember" aria-describedby="remember" type="checkbox"*/}
                                    {/*           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"*/}
                                    {/*           required/>*/}
                                    {/*</div>*/}
                                    {/*<div className="ml-3 text-sm">*/}
                                    {/*    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember*/}
                                    {/*        me</label>*/}
                                    {/*</div>*/}
                                </div>
                                <a href="#"
                                   className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot
                                    password?</a>
                            </div>
                            <Button disabled={!!(errors.email || errors.password)} isProcessing={signingIn}
                                    type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Log in
                            </Button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="/signup"
                                                              className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;