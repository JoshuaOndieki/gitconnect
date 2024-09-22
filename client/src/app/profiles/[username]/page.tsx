import React from 'react';
import Editor from "@/components/editor";
import Post from "@/components/post";

function Profile() {
    const posts = [
        {$id: '1', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'}
    ]
    return (
        <section className='pt-16 p-3 flex flex-col items-center'>
            <div className='flex flex-wrap justify-between w-full max-w-4xl'>
                <div
                    className="flex flex-col items-center bg-white md:flex-row md:max-w-xl dark:bg-gray-800">
                    <img
                        className="object-cover rounded-full h-96 md:h-auto md:w-48"
                        src="/images/oj.jpg" alt=""/>
                    <div className="py-2 px-5">
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <a href="#">Joshua Ondieki <span className='text-gray-400 text-sm'>@oj</span></a>
                        </h3>
                        <span className="text-gray-500 dark:text-gray-400">Software Engineer</span>
                        <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">Joshua drives
                            the technical strategy of the gitConnect platform and brand.</p>
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

                <div>
                    <button type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className='w-full max-w-screen-xl flex flex-wrap gap-8 md:gap-16 py-8 lg:py-16 items-start'>
                <div className='w-full lg:w-80 text-gray-600 dark:text-white p-3 pt-0 flex flex-wrap gap-2'>
                    <div className='py-2 flex-1 min-w-fit'>
                        <h2 className='text-xl font-medium'>Personal Details</h2>
                        <div className='pl-3 flex gap-1 py-1'>
                            <span>
                                <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            </span>
                            <span>Joined on 19th Sep, 2024</span>
                        </div>
                        <div className='pl-3 flex gap-1 py-1'>
                            <span>
                                <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
                            </svg>
                            </span>
                            <a href={'https://joshuaondieki.com'}
                               className='font-medium text-primary-600 dark:text-primary-500 hover:underline'>
                                https://joshuaondieki.com
                            </a>
                        </div>
                    </div>
                    <div className='py-2 flex-1 min-w-fit'>
                        <h2 className='text-xl font-medium'>Work Experience</h2>
                        <div className='pl-3 py-1'>
                            <div className='flex gap-1'>
                                <span>
                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"/>
                                </svg>
                                </span>
                                <span>Griffin Global Technologies</span>
                            </div>
                            <div className='justify-end text-gray-400 dark:text-gray-300 flex gap-1 items-center'>
                                <span>
                                    <svg className="w-4 h-4 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                    </svg>
                                </span>
                                <span>July, 2023 - Present</span>
                            </div>
                        </div>
                        <div className='pl-3 py-1'>
                            <div className='flex gap-1'>
                                <span>
                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"/>
                                    </svg>
                                </span>
                                <span>Freelance Software Engineer</span>
                            </div>
                            <div className='justify-end text-gray-400 dark:text-gray-300 flex gap-1 items-center'>
                                <span>
                                    <svg className="w-4 h-4 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                    </svg>
                                </span>
                                <span>Jan, 2018 - Present</span>
                            </div>
                        </div>
                    </div>
                    <div className='py-2 flex-1 min-w-fit'>
                        <h2 className='text-xl font-medium'>Education</h2>
                        <div className='pl-3 py-1'>
                            <div className='flex gap-1'>
                                <span>
                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
                                    </svg>
                                </span>
                                <span>The Catholic University Of Eastern Africa</span>
                            </div>
                            <div className='justify-end text-gray-400 dark:text-gray-300 flex gap-1 items-center'>
                                <span>
                                    <svg className="w-4 h-4 dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                    </svg>
                                </span>
                                <span>Jan, 2018 - Present</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1 min-w-80 sm:min-w-[30rem]'>
                    <div>
                        <Editor/>
                        <div className='flex justify-end mt-2'>
                            <button type="button"
                                    className="px-8 py-2 text-xs font-medium text-center text-white bg-primary-700 rounded hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Post
                            </button>
                        </div>
                    </div>
                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

                    <div>
                        <Post post={posts[0]}/>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Profile;