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
    const [loadTopDevsError, setLoadTopDevsError] = useState(false)
    const [loadDevsError, setLoadDevsError] = useState(false)

    useEffect(() => {
        loadDevs()
    }, [searchQuery, pageNumber]);

    useEffect(() => {
        setTimeout(()=>loadTopDevs(), 1000)
    }, []);

    const loadTopDevs = ()=> {
        setLoadTopDevsError(false)
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '', false,
            `/users?topDevelopers=true`, ExecutionMethod.GET)
            .then(
                res => {
                    if(res.responseStatusCode == 200) {
                        const responseBody = JSON.parse(res.responseBody) as UsersResponse
                        setTopDevelopersResponse(responseBody)
                    } else {
                        setLoadTopDevsError(true)
                    }
                },
                () => { setLoadTopDevsError(true) }
            )
    }
    const loadDevs = ()=> {
        setLoadDevsError(false)
        setUsersResponse(null)
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
                } else {
                    setLoadDevsError(true)
                }
            },
            () => {
                setLoadDevsError(true)
            }
        )
    }

    return (
        <section className='p-1 sm:p-3 pt-8 max-w-screen-xl m-auto'>
            <h1 className='text-3xl p-2'>Developer Profiles</h1>
            <div className='flex flex-col items-center py-4'>
                <h2 className='text-xl'>Top Developers</h2>
                {loadTopDevsError ?
                    <button onClick={loadTopDevs}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline">
                        Try again!
                    </button>
                    :
                    topDevelopersResponse ?
                        <section className="p-1">
                            <div className="py-4 px-1 sm:px-4 mx-auto max-w-screen-xl lg:py-6 lg:px-6">
                                <div className="grid gap-8 mb-6 lg:mb-8 md:grid-cols-2 xl:grid-cols-3">
                                    {topDevelopersResponse.results.map(topDev => (
                                        <div key={topDev.$id}
                                             className="items-center bg-gray-50 rounded shadow sm:flex dark:bg-gray-800 dark:border-gray-700">
                                            <a href={'/profiles/' + topDev.username}
                                               className='sm:relative sm:w-full sm:h-full'>
                                                <img
                                                    className="w-full sm:h-full rounded sm:rounded-none sm:rounded-l-lg sm:object-cover max-w-[280px] sm:max-w-auto"
                                                    src={topDev.avatar ?? '/images/logo.png'}
                                                    alt="Dev Avatar"/>
                                            </a>
                                            <div className="py-2 px-5">
                                                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    <a href={'/profiles/' + topDev.username}>{topDev.name} <span
                                                        className='text-gray-400 text-sm'>@{topDev.username}</span></a>
                                                </h3>
                                                <span
                                                    className="text-gray-500 dark:text-gray-400">{topDev.title}</span>
                                                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400 sm:max-w-auto">
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
                <section className="p-1 sm:p-5 w-full">
                    <div className="mx-auto max-w-screen-xl px-1 sm:px-4 lg:px-12">
                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded overflow-hidden">
                            <div
                                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-4">
                                <div className="w-full md:w-1/2">
                                    <form className="flex items-center" onSubmit={(event) => event.preventDefault()}>
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
                            <div className="overflow-x-auto max-w-[85dvw]">
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
                                        {loadDevsError ?
                                            <tr>
                                                <td className='w-full text-center p-2'>
                                                    <button onClick={loadDevs}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                        Try again!
                                                    </button>
                                                </td>
                                            </tr>
                                            :
                                            usersResponse ?
                                                usersResponse?.results.map(dev =>
                                                    <tr className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:underline"
                                                        key={dev.username}>
                                                        <th scope="row">
                                                            <a href={'/profiles/' + dev.username}
                                                               className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                                                {dev.avatar
                                                                    ? <img className="w-8 h-8 me-2 rounded-full"
                                                                           src={dev.avatar} alt="user photo"/>
                                                                    :
                                                                    <div
                                                                        className="relative w-8 h-8 me-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                                        <svg
                                                                            className="absolute w-10 h-10 text-gray-400 -left-1"
                                                                            fill="currentColor" viewBox="0 0 20 20"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path fillRule="evenodd"
                                                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                                  clipRule="evenodd"></path>
                                                                        </svg>
                                                                    </div>
                                                                }
                                                                <span className='ml-2 mr-1 text-lg'>{dev.name}</span>
                                                                <span className='text-gray-400'>@{dev.username}</span>
                                                            </a>
                                                        </th>
                                                        <td className="px-4 py-3">{dev.title}</td>
                                                        <td className="px-4 py-3">{dev.reputation}</td>
                                                        <td className="px-4 py-3">{dateFormatter(dev.joined)}</td>
                                                    </tr>
                                                )
                                                :
                                                <tr>
                                                    <td className='w-full flex items-center justify-center p-4'>
                                                        <div role="status">
                                                            <svg aria-hidden="true"
                                                                 className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                                 viewBox="0 0 100 101" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                    fill="currentColor"/>
                                                                <path
                                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                    fill="currentFill"/>
                                                            </svg>
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                        }
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