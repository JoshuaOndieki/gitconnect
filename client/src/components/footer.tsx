import React from 'react';


function Footer() {
    return (
        <footer className="p-4 bg-white sm:p-6 dark:bg-gray-800">
            <div className="mx-auto max-w-screen-xl">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="/" className="flex items-center justify-center bg-white/50 dark:bg-white rounded">
                            <img src="/images/gitconnect-logo-with-slogan.png" className="mr-3 w-[16rem]"
                                 alt="gitConnect Logo With Slogan"/>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
                            <ul className="text-gray-600 dark:text-gray-400">
                                <li className="mb-4">
                                    <a href="/about-us" className="hover:underline">About Us</a>
                                </li>
                                <li>
                                    <a href="mailto:oj@joshuaondieki.com" className="hover:underline">
                                        oj@joshuaondieki.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow
                                us</h2>
                            <ul className="text-gray-600 dark:text-gray-400">
                                <li className="mb-4">
                                    <a target='_blank' href="https://www.linkedin.com/in/iamoj"
                                       className="hover:underline ">LinkedIn</a>
                                </li>
                                <li className="mb-4">
                                    <a target='_blank' href="https://github.com/JoshuaOndieki"
                                       className="hover:underline ">Github</a>
                                </li>
                                <li>
                                    <a target='_blank' href="https://medium.com/@joshuaondieki" className="hover:underline">Medium</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                            <ul className="text-gray-600 dark:text-gray-400">
                                <li className="mb-4">
                                    <a href="#" className="hover:underline">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
                <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a
                href="/" className="hover:underline">gitConnect™</a>. All Rights Reserved.
            </span>
                    <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;