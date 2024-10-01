'use client';
import React, {useEffect, useState} from 'react';
import {UsersResponse} from "@/lib/types";
import {functions} from "@/lib/config/appwrite";
import env from "@/env";
import {ExecutionMethod} from "appwrite";
import {cn, dateFormatter} from "@/lib/utils";
import Loader from "@/components/loader";
import SocialIcons from "@/components/social-icons";

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
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '', false,
            `/users?topDevelopers=true`, ExecutionMethod.GET).then(
            res => {
                if(res.responseStatusCode == 200) {
                    const responseBody = JSON.parse(res.responseBody) as UsersResponse
                    setTopDevelopersResponse(responseBody)
                }
            })
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
                                        <a href={'/profiles/'+topDev.username} className='sm:relative sm:w-full sm:h-full'>
                                            <img
                                                className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover"
                                                src={topDev.avatar ?? '/images/logo.png'}
                                                alt="Dev Avatar"/>
                                        </a>
                                        <div className="py-2 px-5">
                                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                <a href={'/profiles/'+topDev.username}>{topDev.name} <span
                                                    className='text-gray-400 text-sm'>@{topDev.username}</span></a>
                                            </h3>
                                            <span
                                                className="text-gray-500 dark:text-gray-400">{topDev.title}</span>
                                            <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                                                {topDev.bio}
                                            </p>
                                            {topDev.socials && <SocialIcons socials={topDev.socials}/>}
                                        </div>
                                    </div>
                                ))}
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
                                    <form className="flex items-center" onSubmit={(event)=> event.preventDefault()}>
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
                                        <button id="sortByDropdownButton" data-dropdown-toggle="sortByDropdown" disabled
                                                className="w-full md:w-auto disabled:cursor-not-allowed flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                                        <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" disabled
                                                className="w-full md:w-auto disabled:cursor-not-allowed flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                                                   onChange={(event) => setPageNumber(Math.min(Math.max(1, +event.target.value), Math.ceil(usersResponse ? usersResponse.metadata.total.filtered / 10 : Number.MAX_SAFE_INTEGER)))}
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