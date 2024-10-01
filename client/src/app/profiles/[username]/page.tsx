'use client';
import React, {useEffect, useRef, useState} from 'react';
import Post from "@/components/post";
import {useParams} from "next/navigation";
import {functions} from "@/lib/config/appwrite";
import env from "@/env";
import {ExecutionMethod} from "appwrite";
import {PublicProfileResponse} from "@/lib/types";
import Loader from "@/components/loader";
import NotFound from "@/components/not-found";
import useGitConnectStore from "@/lib/zustand";
import {dateFormatter} from "@/lib/utils";
import SocialIcons from "@/components/social-icons";
import QuillEditor from "@/components/quill-editor";

function Profile() {
    const {user} = useGitConnectStore()
    const posts = [
        {
            $id: '1',
            content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'
        }
    ]
    const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)

    const pathParams = useParams<{ username: string }>()

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const quillRef: any = useRef();

    useEffect(() => {
        setLoading(true)
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '',
            false, '/users/profiles/' + pathParams.username, ExecutionMethod.GET)
            .then(
                res => {
                    if (res.responseStatusCode == 200) {
                        setProfile(JSON.parse(res.responseBody))
                        setLoading(false)
                    } else {
                        console.error('unable to fetch profile')
                        setProfile(null)
                        setLoading(false)
                    }
                },
                error => {
                    console.log('profile error', error)
                    setProfile(null)
                    setLoading(false)
                }
            )
    }, [pathParams]);

    return (
        <section className='pt-6 md:pt-12 p-3 flex flex-col items-center justify-center'>
            {loading ?
                <Loader/>
                :
                profile ?
                    <>
                        <div className='flex flex-wrap justify-between w-full max-w-4xl'>
                            <div
                                className="flex flex-col items-center bg-white md:flex-row md:max-w-xl dark:bg-gray-800">
                                {profile.avatar ?
                                    <img
                                        className="object-cover rounded h-72 md:h-auto md:w-48"
                                        src={profile.avatar} alt="user profile picture"/>
                                    :
                                    <div>
                                        <div
                                            className="relative w-72 h-72 md:w-48 md:h-48 me-2 overflow-hidden bg-gray-100 rounded dark:bg-gray-600">
                                            <svg className="absolute text-gray-400 -left-1"
                                                 fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                      clipRule="evenodd"></path>
                                            </svg>
                                        </div>

                                    </div>
                                }
                                <div className="py-2 px-2 sm:px-5">
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        <a href="#">{profile.name} <span
                                            className='text-gray-400 text-sm'>@{profile.username}</span></a>
                                    </h3>
                                    <span className="text-gray-500 dark:text-gray-400">{profile.title}</span>
                                    <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                                        {profile.bio}
                                    </p>

                                    <SocialIcons socials={profile.socials}/>
                                </div>
                            </div>

                            <div>
                                {user?.$id == profile.$id &&
                                    <a href='/edit-profile'
                                            className="hover:cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Edit Profile
                                    </a>
                                }
                            </div>
                        </div>

                        <div
                            className='w-full max-w-screen-xl flex flex-wrap gap-8 md:gap-16 py-8 lg:py-16 items-start'>
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
                                        <span>Joined {dateFormatter(profile.joined)}</span>
                                    </div>
                                    {profile.website &&
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
                                            <a href={profile.website} target='_blank'
                                               className='font-medium text-primary-600 dark:text-primary-500 hover:underline'>
                                                {profile.website}
                                            </a>
                                        </div>
                                    }
                                </div>
                                {profile.work.length > 0 &&
                                    <div className='py-2 flex-1 min-w-fit'>
                                        <h2 className='text-xl font-medium'>Work Experience</h2>
                                        {profile.work.map(work => (
                                            <div className='pl-3 py-1 w-fit' key={work.$id}>
                                                <div className='flex gap-1'>
                                                <span>
                                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         fill="none"
                                                         viewBox="0 0 24 24">
                                                        <path stroke="currentColor" strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth="2"
                                                              d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01"/>
                                                    </svg>
                                                </span>
                                                    <div>
                                                        <span
                                                            className='font-medium'>{work.company}</span> - <span>{work.title}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className='justify-end text-gray-400 dark:text-gray-300 flex gap-1 items-center'>
                                            <span>
                                                <svg className="w-4 h-4 dark:text-white" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     fill="none"
                                                     viewBox="0 0 24 24">
                                                  <path stroke="currentColor" strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                                </svg>
                                            </span>
                                                    <span>{dateFormatter(work.startDate)} - {work.endDate ?? 'Present'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                                {profile.schools.length > 0 &&
                                    <div className='py-2 flex-1 min-w-fit'>
                                        <h2 className='text-xl font-medium'>Education</h2>

                                        {profile.schools.map(school => (
                                            <div className='pl-3 py-1 w-fit' key={school.$id}>
                                                <div className='flex gap-1'>
                                                <span>
                                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true"
                                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         fill="none"
                                                         viewBox="0 0 24 24">
                                                      <path stroke="currentColor" strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
                                                    </svg>
                                                </span>
                                                    <div>
                                                    <span
                                                        className='font-medium'>{school.name}</span> - <span>{school.course}</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className='justify-end text-gray-400 dark:text-gray-300 flex gap-1 items-center'>
                                                <span>
                                                    <svg className="w-4 h-4 dark:text-white" aria-hidden="true"
                                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         fill="none"
                                                         viewBox="0 0 24 24">
                                                      <path stroke="currentColor" strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                                    </svg>
                                                </span>
                                                    <span>{dateFormatter(school.startDate)} - {school.endDate ?? 'Present'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                            <div className='flex-1 min-w-80 sm:min-w-[30rem]'>
                                <QuillEditor
                                    actions={[
                                        {
                                            label: 'Post', type: 'primary',
                                            click: async (content)=>{
                                                try{
                                                    const response = await functions.createExecution(
                                                        env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, JSON.stringify({content}), false,
                                                        '/posts', ExecutionMethod.POST
                                                    )
                                                    return response.responseStatusCode == 201;
                                                } catch (error: any) {
                                                    console.error('Unable to post', error)
                                                    return false
                                                }
                                            }
                                        }
                                    ]}
                                    ref={quillRef}
                                />
                                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                                <div>
                                    <Post post={posts[0]}/>
                                </div>
                            </div>
                        </div>

                    </>
                    :
                    <NotFound/>
            }
        </section>
    );
}

export default Profile;