'use client';
import React, {useEffect} from 'react';
import DOMPurify from 'dompurify';


function Post({post}: { post: {$id: string, content: string} }) {
    const [content, setContent] = React.useState('');

    useEffect(() => {
        if(typeof window !== 'undefined') {
            setContent(DOMPurify.sanitize(post.content))
        }
    }, [post]);

    return (
        <div className='border border-gray-200 dark:border-gray-700 rounded p-2 m-2'>
            <div className='flex justify-between'>
                <div className="flex items-center gap-4">
                    <img className="w-10 h-10 rounded-full"
                         src="/images/oj.jpg" alt=""/>
                    <div className="font-medium dark:text-white">
                        <div>Joshua Ondieki <span className='text-gray-400'>@oj</span></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            1 min ago
                        </div>
                    </div>
                </div>
                <div>
                    <button data-dropdown-toggle={"dropdownPost-" + post.$id}
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 16 3">
                            <path
                                d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                        </svg>
                        <span className="sr-only">Post settings</span>
                    </button>
                    <div id={"dropdownPost-" + post.$id}
                         className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownMenuIconHorizontalButton">
                            <li>
                                <a href="#"
                                   className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                            </li>
                            <li>
                                <a href="#"
                                   className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='px-10 py-2' dangerouslySetInnerHTML={{__html: content}}>
            </div>
            <div className='flex justify-end gap-2'>
                <div
                    className='flex items-center text-gray-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer'>
                    <span>469</span>
                    <button type="button"
                            className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                        <svg className="w-6 h-6" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"/>
                        </svg>
                        <span className="sr-only">comments</span>
                    </button>
                </div>
                <div
                    className='flex items-center text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 cursor-pointer'>
                    <span>13</span>
                    <button type="button"
                            className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"/>
                        </svg>
                        <span className="sr-only">dislike</span>
                    </button>
                </div>
                <div className='flex items-center text-gray-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer'>
                    <span>1k</span>
                    <button type="button"
                            className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                        <svg className="w-6 h-6" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"/>
                        </svg>
                        <span className="sr-only">like</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;