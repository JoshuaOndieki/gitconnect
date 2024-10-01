import React from 'react';


function Comment({comment}: {comment: {$id: string, content: string}}) {
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
                    <button data-dropdown-toggle={"dropdownComment-" + comment.$id}
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="currentColor" viewBox="0 0 16 3">
                            <path
                                d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                        </svg>
                        <span className="sr-only">Comment settings</span>
                    </button>
                    <div id={"dropdownComment-" + comment.$id}
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
            <div className='px-10 py-2'>
                {comment.content}
            </div>
        </div>
    );
}

export default Comment;