'use client';
import React, {useEffect} from 'react';
import {account, functions} from "@/lib/config/appwrite";
import useGitConnectStore from "@/lib/zustand";
import {useRouter, usePathname} from "next/navigation";
import Loader from "@/components/loader";
import {AppwriteException, ExecutionMethod} from "appwrite";
import env from "@/env";
import {UserProfile} from "@/lib/types";


function App({children}: Readonly<{ children: React.ReactNode }>) {
    const {user, setUser, userLoaded, setUserLoaded, hydrated, reloadUser, setReloadUser} = useGitConnectStore()

    const route = usePathname()
    const router = useRouter()

    const PATHS = {
        allowedPaths: ['/login', '/signup', '/profiles', '/', '/profiles/*'],
        authenticatedDisallowedPaths: ['/login', '/signup', '/']
    }

    useEffect( () => {
        if(typeof window !== 'undefined' && hydrated && (reloadUser || !userLoaded)) {
            account.get().then(
                u => {
                    functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS,
                        '', false, '/users/authenticated', ExecutionMethod.GET)
                        .then(
                            res => {
                                if(res.responseStatusCode == 200) {
                                    const profile = JSON.parse(res.responseBody) as UserProfile
                                    setUser({...u, ...profile})
                                    setUserLoaded(true)
                                    setReloadUser(false)
                                } else {
                                    setUserLoaded(true)
                                    setReloadUser(false)
                                }
                            },
                            () => {
                                setUserLoaded(true)
                            }
                        )
                },
                (error: AppwriteException) => {
                    if (error.code == 401) {
                        setUserLoaded(true)
                    }
                }
            )
        }
        if(!hydrated) {
            useGitConnectStore.persist.rehydrate()
        }
    }, [hydrated, userLoaded, reloadUser]);

    const matchPath = (routerPath: string, comparePath: string) => {
        const regexPattern = comparePath.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(routerPath);
    }

    const canActivate = (path: string)=> {
        if(user){
            return !PATHS.authenticatedDisallowedPaths.some((path1) => matchPath(path, path1))
        } else {
            return PATHS.allowedPaths.some(path1 => matchPath(path, path1))
        }
    }

    useEffect(() => {
        if(userLoaded) {
            if(user && !user.emailVerification) {
                if(route != '/verification') router.push('/verification')
            }
            if(!canActivate(route.toLowerCase())) {
                if(user) {
                    router.push('/feed')
                } else {
                    router.push('/login')
                }
            }
        }
    }, [route, userLoaded, user]);

    return (hydrated && userLoaded && typeof window !== 'undefined' && canActivate(route.toLowerCase()) ? <>{children}</> : <div className='flex-1 flex items-center justify-center'><Loader/></div>)
}

export default App;