'use client';
import React, {useEffect, useState} from 'react';
import {UsersResponse} from "@/lib/types";
import {functions} from "@/lib/config/appwrite";
import env from "@/env";
import {ExecutionMethod} from "appwrite";
import {cn, dateFormatter} from "@/lib/utils";
import Loader from "@/components/loader";

function Profiles() {

    const titles = [
        {name: "Software Engineer", $id: "software-engineer"}
    ]

    const [searchQuery, setSearchQuery] = useState<string | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [usersResponse, setUsersResponse] = useState<UsersResponse | null>(null)
    const [topDevelopersResponse, setTopDevelopersResponse] = useState<UsersResponse | null>(null)

    useEffect(() => {
        const queryParams = new URLSearchParams()
        if(searchQuery) {
            queryParams.set('searchQuery', searchQuery)
            if(searchQuery != usersResponse?.metadata.searchQuery) setPageNumber(1)
        }
        if(pageNumber) {
            queryParams.set('pageNumber', String(pageNumber))
        }
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '', false,
            `/users?${queryParams.toString()}`, ExecutionMethod.GET).then(
                res => {
                    if(res.responseStatusCode == 200) {
                        const responseBody = JSON.parse(res.responseBody) as UsersResponse
                        setUsersResponse(responseBody)
                    }
                }
        )
    }, [searchQuery, pageNumber]);

    useEffect(() => {
        setTimeout(()=> functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '', false,
            `/users?topDevelopers=true`, ExecutionMethod.GET).then(
            res => {
                if(res.responseStatusCode == 200) {
                    const responseBody = JSON.parse(res.responseBody) as UsersResponse
                    setTopDevelopersResponse(responseBody)
                }
            }
        ), 500)
    }, []);

    return (
        <section className='p-3 pt-8 max-w-screen-xl m-auto'>
            <h1 className='text-3xl'>Developer Profiles</h1>
            <div className='flex flex-col items-center'>
                <h2 className='text-xl'>Top Developers</h2>
                {topDevelopersResponse ?
                    <section className="">
                        <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6">
                            <div className="grid gap-8 mb-6 lg:mb-8 md:grid-cols-2 xl:grid-cols-3">
                                {topDevelopersResponse.results.map(topDev => (
                                    <div key={topDev.$id}
                                        className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                                        <a href="#" className='sm:relative sm:w-full sm:h-full'>
                                            <img
                                                className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"
                                                src={topDev.avatar ?? '/images/logo.png'}
                                                alt="Dev Avatar"/>
                                        </a>
                                        <div className="py-2 px-5">
                                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                <a href="#">{topDev.name} <span
                                                    className='text-gray-400 text-sm'>@{topDev.username}</span></a>
                                            </h3>
                                            <span
                                                className="text-gray-500 dark:text-gray-400">{topDev.title}</span>
                                            <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">{topDev.name}
                                                drives
                                                the technical strategy of the gitConnect platform and brand.
                                                [Placeholder bio]
                                            </p>
                                            <ul className="flex space-x-4 sm:mt-0 justify-end">
                                                <li>
                                                    <a href="#"
                                                       className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                                             aria-hidden="true">
                                                            <path fillRule="evenodd"
                                                                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                                             aria-hidden="true">
                                                            <path
                                                                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                                                        </svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                                             aria-hidden="true">
                                                            <path fillRule="evenodd"
                                                                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#"
                                                       className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                                             aria-hidden="true">
                                                            <path fillRule="evenodd"
                                                                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {/*<div*/}
                                {/*    className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">*/}
                                {/*    <a href="#" className='sm:relative sm:w-full sm:h-full'>*/}
                                {/*        <img*/}
                                {/*            className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"*/}
                                {/*            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"*/}
                                {/*            alt="Jese Avatar"/>*/}
                                {/*    </a>*/}
                                {/*    <div className="py-2 px-5">*/}
                                {/*        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                                {/*            <a href="#">Jese Leos <span className='text-gray-400 text-sm'>@oj</span></a>*/}
                                {/*        </h3>*/}
                                {/*        <span className="text-gray-500 dark:text-gray-400">CTO</span>*/}
                                {/*        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Jese drives*/}
                                {/*            the*/}
                                {/*            technical strategy of the flowbite platform and brand.</p>*/}
                                {/*        <ul className="flex space-x-4 sm:mt-0 justify-end">*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path*/}
                                {/*                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">*/}
                                {/*    <a href="#" className='sm:relative sm:w-full sm:h-full'>*/}
                                {/*        <img*/}
                                {/*            className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"*/}
                                {/*            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"*/}
                                {/*            alt="Michael Avatar"/>*/}
                                {/*    </a>*/}
                                {/*    <div className="py-2 px-5">*/}
                                {/*        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                                {/*            <a href="#">Michael Gough <span className='text-gray-400 text-sm'>@oj</span></a>*/}
                                {/*        </h3>*/}
                                {/*        <span*/}
                                {/*            className="text-gray-500 dark:text-gray-400">Senior Front-end Developer</span>*/}
                                {/*        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Michael*/}
                                {/*            drives*/}
                                {/*            the technical strategy of the flowbite platform and brand.</p>*/}
                                {/*        <ul className="flex space-x-4 sm:mt-0 justify-end">*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path*/}
                                {/*                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">*/}
                                {/*    <a href="#" className='sm:relative sm:w-full sm:h-full'>*/}
                                {/*        <img*/}
                                {/*            className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"*/}
                                {/*            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png"*/}
                                {/*            alt="Sofia Avatar"/>*/}
                                {/*    </a>*/}
                                {/*    <div className="py-2 px-5">*/}
                                {/*        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                                {/*            <a href="#">Lana Byrd <span className='text-gray-400 text-sm'>@oj</span></a>*/}
                                {/*        </h3>*/}
                                {/*        <span className="text-gray-500 dark:text-gray-400">Marketing & Sale</span>*/}
                                {/*        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Lana drives*/}
                                {/*            the*/}
                                {/*            technical strategy of the flowbite platform and brand.</p>*/}
                                {/*        <ul className="flex space-x-4 sm:mt-0 justify-end">*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path*/}
                                {/*                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">*/}
                                {/*    <a href="#" className='sm:relative sm:w-full sm:h-full'>*/}
                                {/*        <img*/}
                                {/*            className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"*/}
                                {/*            src="/images/oj.jpg"*/}
                                {/*            alt="Joshua Avatar"/>*/}
                                {/*    </a>*/}
                                {/*    <div className="py-2 px-5">*/}
                                {/*        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                                {/*            <a href="#">Joshua Ondieki <span*/}
                                {/*                className='text-gray-400 text-sm'>@oj</span></a>*/}
                                {/*        </h3>*/}
                                {/*        <span className="text-gray-500 dark:text-gray-400">Software Engineer</span>*/}
                                {/*        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Joshua*/}
                                {/*            drives*/}
                                {/*            the technical strategy of the gitConnect platform and brand.</p>*/}
                                {/*        <ul className="flex space-x-4 sm:mt-0 justify-end">*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path*/}
                                {/*                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div*/}
                                {/*    className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">*/}
                                {/*    <a href="#" className='sm:relative sm:w-full sm:h-full'>*/}
                                {/*        <img*/}
                                {/*            className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"*/}
                                {/*            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png"*/}
                                {/*            alt="Sofia Avatar"/>*/}
                                {/*    </a>*/}
                                {/*    <div className="py-2 px-5">*/}
                                {/*        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                                {/*            <a href="#">Lana Byrd <span className='text-gray-400 text-sm'>@oj</span></a>*/}
                                {/*        </h3>*/}
                                {/*        <span className="text-gray-500 dark:text-gray-400">Marketing & Sale</span>*/}
                                {/*        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Lana drives*/}
                                {/*            the*/}
                                {/*            technical strategy of the flowbite platform and brand.</p>*/}
                                {/*        <ul className="flex space-x-4 sm:mt-0 justify-end">*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path*/}
                                {/*                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*            <li>*/}
                                {/*                <a href="#"*/}
                                {/*                   className="text-gray-500 hover:text-gray-900 dark:hover:text-white">*/}
                                {/*                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"*/}
                                {/*                         aria-hidden="true">*/}
                                {/*                        <path fillRule="evenodd"*/}
                                {/*                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
                                {/*                              clipRule="evenodd"/>*/}
                                {/*                    </svg>*/}
                                {/*                </a>*/}
                                {/*            </li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </section>
                    : <div className='py-4 px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6'><Loader/></div>
                }
            </div>

            <div className='flex flex-col items-center mb-16'>
                <h2 className='text-xl'>Explore Developers</h2>
                <section className="p-3 sm:p-5 w-full">
                    <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded overflow-hidden">
                            <div
                                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                <div className="w-full md:w-1/2">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div
                                                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true"
                                                     className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                     fill="currentColor" viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <input type="text" id="simple-search"
                                                   onChange={(event) => setSearchQuery(event.target.value)}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                   placeholder="Search" required/>
                                        </div>
                                    </form>
                                </div>
                                <div
                                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    <div className="flex items-center space-x-3 w-full md:w-auto">
                                        <button id="sortByDropdownButton" data-dropdown-toggle="sortByDropdown"
                                                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                type="button">
                                            <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor"
                                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                                                 aria-hidden="true">
                                                <path clipRule="evenodd" fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                            </svg>
                                            Sort by
                                        </button>
                                        <div id="sortByDropdown"
                                             className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                aria-labelledby="sortByDropdownButton">
                                                <li>
                                                    <a href="#"
                                                       className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                        Name ascending
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="py-1">
                                                <a href="#"
                                                   className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                    Highest No. of Posts
                                                </a>
                                            </div>
                                        </div>
                                        <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown"
                                                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                                                 className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20"
                                                 fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            Filter
                                            <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor"
                                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                                                 aria-hidden="true">
                                                <path clipRule="evenodd" fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                            </svg>
                                        </button>
                                        <div id="filterDropdown"
                                             className="z-10 hidden w-64 p-3 bg-white rounded shadow dark:bg-gray-700">
                                            <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose
                                                title</h6>
                                            <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                                {titles.map(title =>
                                                    <li className="flex items-center" key={title.$id}>
                                                        <input id={title.$id} type="checkbox" value=""
                                                               className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                                        <label htmlFor={title.$id}
                                                               className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {title.name}(56)
                                                        </label>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Name</th>
                                        <th scope="col" className="px-4 py-3">Title</th>
                                        <th scope="col" className="px-4 py-3">Reputation</th>
                                        <th scope="col" className="px-4 py-3">Date Joined</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {usersResponse?.results.map(dev =>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:underline"
                                            key={dev.username}>
                                            <th scope="row">
                                                <a href={'/profiles/' + dev.username}
                                                   className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                                    <img src='/images/oj.jpg' className='h-[48px] w-[48px] rounded-full'
                                                         alt='avatar'/>
                                                    <span className='ml-2 mr-1 text-lg'>{dev.name}</span>
                                                    <span className='text-gray-400'>@{dev.username}</span>
                                                </a>
                                            </th>
                                            <td className="px-4 py-3">{dev.title}</td>
                                            <td className="px-4 py-3">{dev.reputation}</td>
                                            <td className="px-4 py-3">{dateFormatter(dev.joined)}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <nav
                                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                                aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing
                    <span
                        className="font-semibold text-gray-900 dark:text-white"> {(10 * ((pageNumber ?? 1) - 1)) + 1}-{Math.min((10 * ((pageNumber ?? 1) - 1)) + 10, usersResponse?.metadata.total.filtered ?? 0)} </span>
                    of
                    <span
                        className="font-semibold text-gray-900 dark:text-white"> {usersResponse?.metadata.total.filtered}</span>
                </span>
                                <ul className="inline-flex items-stretch -space-x-px">
                                    <li>
                                        <button disabled={pageNumber == 1}
                                                onClick={() => setPageNumber((current) => current - 1)}
                                                className={cn("flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 border border-e-0 border-gray-300 rounded-s-lg dark:border-gray-700 dark:text-gray-400",
                                                    pageNumber == 1 ?
                                                        "cursor-not-allowed" : "bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                                                )}
                                        >Previous
                                        </button>
                                    </li>

                                    <li>
                                        <div>
                                            <input type="text" id="page-number" value={pageNumber}
                                                   onChange={(event) => setPageNumber(+event.target.value)}
                                                   className="block w-16 text-center p-2 text-gray-900 border border-gray-300 bg-gray-50 text-base h-8 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                        </div>
                                    </li>

                                    <li>
                                        <button
                                            disabled={usersResponse ? pageNumber == Math.ceil(usersResponse.metadata.total.filtered / 10) : false}
                                            onClick={() => setPageNumber((current) => current + 1)}
                                            className={cn("flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 rounded-e-lg dark:border-gray-700 dark:text-gray-400",
                                                (usersResponse ? pageNumber == Math.ceil(usersResponse.metadata.total.filtered / 10) : false) ?
                                                    "cursor-not-allowed" : "bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                                            )}>Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default Profiles;