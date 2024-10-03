'use client';
import React, {useEffect, useState} from 'react';
import useGitConnectStore from "@/lib/zustand";
import {account, functions} from "@/lib/config/appwrite";
import env from "@/env";
import {Button} from "flowbite-react";
import {ExecutionMethod} from "appwrite";
import {UserProfile} from "@/lib/types";
import {useRouter, useSearchParams} from "next/navigation";
import Loader from "@/components/loader";

function Verification() {
    const {user, setUser, hydrated, reset, setUserLoaded} = useGitConnectStore()

    const queryParams = useSearchParams()
    const router = useRouter()
    const userId = queryParams.get('userId')
    const secret = queryParams.get('secret')

    useEffect(() => {
        if(userId && secret) {
            account.updateVerification(userId, secret).then(
                () => {
                    setTimeout(()=> {
                        setUserLoaded(false)
                        router.push('/feed')
                    }, 3000)
                },
                () => {
                    setUserLoaded(false)
                    router.push('/feed')
                }
            )
        }
    }, [userId, secret]);

    const secondsSinceLastSent = (date: string)=> {
        const now = new Date();
        const past = new Date(date);
        const differenceInMilliseconds = +now - +past;
        return Math.floor(differenceInMilliseconds / 1000);
    }
    const [resendIntervalId, setResendIntervalId] = useState< NodeJS.Timeout | string | number | undefined>(undefined);
    const [secondsToResend, setSecondsToResend] = useState<number>(
        user?.lastVerificationEmailDate ? Math.max(120 - secondsSinceLastSent(user.lastVerificationEmailDate), 0) : 0
    )

    const startResendInterval = ()=> {
        if(resendIntervalId) {
            clearInterval(resendIntervalId)
        }
        setResendIntervalId(
            setInterval(()=> setSecondsToResend(
                (current) => Math.max(current - 1, 0)), 1000)
        )
    }

    useEffect(() => {
        startResendInterval()
        return ()=> clearInterval(resendIntervalId)
    }, []);

    const sendVerificationEmail = () => {
        account.createVerification(env.NEXT_PUBLIC_BASE_URL + '/verification').then(
            () => {
                setSecondsToResend(120)
                startResendInterval()
            },
            () => {
                setUserLoaded(false)
            }
        )
    }

    const fetchProfile = () => {
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS,
            '', false, '/users/authenticated', ExecutionMethod.GET)
            .then(
                res => {
                    if(res.responseStatusCode == 200) {
                        const profile = JSON.parse(res.responseBody) as UserProfile
                        setUser({...user!, ...profile})
                        setSecondsToResend(
                            profile.lastVerificationEmailDate ? Math.max(120 - secondsSinceLastSent(profile.lastVerificationEmailDate), 0) : 0)
                    } else {
                        reset()
                    }
                },
                () => {
                    reset()
                }
            )
    }

    useEffect(() => {
        if(user?.emailVerification) {
            router.push('/feed')
        } else {
            account.get().then(
                res => {
                    setUser({...user!, ...res})
                    if(user?.emailVerification) {
                        router.push('/feed')
                    }
                }
            )
            fetchProfile()
        }
    }, []);

    useEffect(() => {
        if(hydrated && user && !user.lastVerificationEmailDate) {
            sendVerificationEmail()
            setTimeout(()=> {
                fetchProfile()
            }, 6000) // Fetch profile after 6 seconds. TODO: find a way to know when the profile update trigger has completed to fetch
        }
    }, [hydrated]);

    return (
        <section className='flex items-center justify-center flex-1'>
            { queryParams.get('secret') ?
                <Loader/>
                :
                <div id="alert-additional-content-3"
                     className="w-[90%] md:w-[36rem] p-4 mb-4 text-green-800 border border-green-300 rounded bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                     role="alert">
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <h3 className="text-lg font-medium">Just one last step.</h3>
                    </div>
                    <div className="mt-2 mb-4 text-sm">
                        <p>Hi {user?.name},</p>
                        <p>
                            We&apos;ve sent a verification email to {user?.email}.
                            Please check your inbox and follow the instructions to verify your account.
                            If you don&apos;t see the email, check your spam folder or try resending the verification.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={secondsToResend > 0} onClick={sendVerificationEmail}
                                color='gray'>
                            Resend email {secondsToResend ? 'in ' + secondsToResend + ' seconds' : ''}
                        </Button>
                    </div>
                </div>
            }
        </section>
    );
}

export default Verification;