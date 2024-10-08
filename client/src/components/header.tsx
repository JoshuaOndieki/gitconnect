'use client';
import React, {useEffect} from 'react';
import useGitConnectStore from "@/lib/zustand";
import {account} from "@/lib/config/appwrite";
import {AppwriteException} from "appwrite";


function Header() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initFlowbite = async () => {
                const { initFlowbite } = await import('flowbite');
                initFlowbite();
            };
            initFlowbite();
        }
    }, []);

    const {user, userLoaded, setReloadUser, setUser, setUserLoaded} = useGitConnectStore()
    const signOut = async ()=> {
        try {
            await account.deleteSession('current')
            setReloadUser()
            setTimeout(()=> window.location.reload(), 500)
        } catch(error) {
            if((error as AppwriteException).code == 401) {
                setUser(null)
                setUserLoaded(true)
                setTimeout(()=> window.location.reload(), 500)
            }
        }
    }

    return (
        <header className='sticky top-0 z-50'>
            <nav className="bg-white border-gray-200 px-2 sm:px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <div className='flex items-center gap-1'>
                        <button data-collapse-toggle="mobile-menu-2" type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"></path>
                            </svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <a href="/" className="flex items-center">
                            <img src="/images/logo.png" className="mr-1 sm:mr-3 h-6 sm:h-9"
                                 alt="gitConnect Logo"/>
                            <span
                                className="self-center sm:text-xl font-semibold whitespace-nowrap dark:text-white">gitConnect</span>
                        </a>
                    </div>
                    <div className="flex items-center lg:order-2">
                        {(userLoaded && !user) &&
                            <>
                                <a href="/login"
                                   className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm px-2 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                    Log in
                                </a>
                                <a href="/signup"
                                   className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-sm px-2 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                    Join Us
                                </a>
                            </>
                        }

                        {(userLoaded && user) &&
                            <>
                                <button id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
                                        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-primary-600 dark:hover:text-primary-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                                        type="button">
                                    <span className="sr-only">Open user menu</span>
                                    {user.avatar
                                        ? <img className="w-8 h-8 me-2 rounded-full"
                                               src={user.avatar} alt="user photo"/>
                                        :
                                        <div
                                            className="relative w-8 h-8 me-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <svg className="absolute w-10 h-10 text-gray-400 -left-1"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    }

                                    {user.name.split(' ')[0]}
                                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>

                                <div id="dropdownAvatarName"
                                     className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <div className="font-medium ">{user.name}</div>
                                        <div className="truncate">{user.email}</div>
                                    </div>
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                                        <li>
                                            <a href={"/profiles/" + user.username}
                                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
                                        </li>
                                        <li>
                                            <a href="#"
                                               className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                        </li>
                                    </ul>
                                    <div className="py-2">
                                        <a href="/" onClick={signOut}
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Sign out</a>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                         id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <a href="/"
                                   className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                   aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/profiles"
                                   className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Profiles</a>
                            </li>
                            <li>
                                <a href="/about-us"
                                   className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">About
                                    Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
