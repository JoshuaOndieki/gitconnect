'use client';
import React, {useEffect, useState} from 'react';
import useGitConnectStore from "@/lib/zustand";
import {PublicProfileResponse, School, Work} from "@/lib/types";
import {functions, storage} from "@/lib/config/appwrite";
import env from "@/env";
import {AppwriteException, ExecutionMethod, ID} from "appwrite";
import {Button, Datepicker} from "flowbite-react";
import Loader from "@/components/loader";
import {z} from 'zod';
import _ from "lodash";


const workSchema = z.object({
    company: z.string().min(1),
    title: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().nullable(),
});

const schoolSchema = z.object({
    name: z.string().min(1),
    course: z.string().min(1),
    startDate: z.string(),
    endDate: z.string().nullable(),
});

const socialSchema = z.object({
    username: z.string().min(1),
    type: z.string(),
});

const profileSchema = z.object({
    name: z.string().min(1),
    username: z.string().min(1),
    title: z.string().nullable(),
    // Avatar can be File (new upload), a string URL (existing avatar), or null
    avatar: z.union([z.instanceof(File), z.string().url()]).nullable(),
    website: z.string().url().nullable(),
    bio: z.string().nullable(),
    work: z.array(workSchema).optional(),
    schools: z.array(schoolSchema).optional(),
    socials: z.array(socialSchema).optional(),
});


function EditProfile() {
    const {user, userLoaded, setReloadUser, hydrated} = useGitConnectStore()
    const [profile, setProfile] = useState<PublicProfileResponse | null>(null)
    const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [errors, setErrors] =
        useState<{ name: string | null, username: string | null,
                    work: { [key: number]: {company: string | null, title: string | null} },
                    schools: { [key: number]: {name: string | null, course: string | null} },
                }>({schools: {}, work: {}, name: null, username: null });
    const [updatingError, setUpdatingError] = useState<string | null>(null)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const addWork = ()=> {
        if(profile) {
            setProfile({...profile, work: [...profile.work, {$id: "", company: "", endDate: null, startDate: "", title: ""}]})
        }
    }
    const deleteWork = (index: number)=> {
        if (profile && profile?.work[index]) {
            setProfile({...profile, work: profile.work.toSpliced(index, 1)})
        }
    }
    const markWorkCurrent = (index: number, current = true) => {
        if(profile && profile.work[index]) {
            const newArray = [...profile.work];
            newArray[index].endDate = current ? null : new Date().toISOString()
            setProfile({...profile, work: newArray})
        }
    }

    const addSchool = ()=> {
        if(profile) {
            setProfile({...profile, schools: [...profile.schools, {$id: "", name: "", endDate: null, startDate: new Date().toISOString(), course: ""}]})
        }
    }
    const deleteSchool = (index: number)=> {
        if (profile && profile?.schools[index]) {
            setProfile({...profile, schools: profile.schools.toSpliced(index, 1)})
        }
    }
    const markSchoolCurrent = (index: number, current = true) => {
        if(profile && profile.schools[index]) {
            const newArray = [...profile.schools];
            newArray[index].endDate = current ? null : new Date().toISOString()
            setProfile({...profile, schools: newArray})
        }
    }

    const updateWork = (index: number, value: Work) => {
        if(profile && profile.work[index]){
            const newWorkArray = [...profile.work]
            newWorkArray[index] = value
            setProfile({...profile, work: newWorkArray})
        }
    }

    const updateSchool = (index: number, value: School) => {
        if(profile && profile.schools[index]){
            const newSchoolArray = [...profile.schools]
            newSchoolArray[index] = value
            setProfile({...profile, schools: newSchoolArray})
        }
    }

    const updateSocial = (type: 'github' | 'linkedin' | 'twitter', username: string) => {
        const index = profile?.socials.findIndex(s => s.type == type)
        if(profile && index){
            const newSocials = [...profile.socials]
            if(index > -1) {
                newSocials[index].username = username
            } else {
                newSocials.push({$id: "", type, username})
            }
            setProfile({...profile, socials: newSocials})
        }
    }

    useEffect(() => {
        setLoading(true)
        if(user) {
            functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS, '',
                false, '/users/profiles/' + user.username, ExecutionMethod.GET)
                .then(
                    res => {
                        if (res.responseStatusCode == 200) {
                            const data = JSON.parse(res.responseBody) as PublicProfileResponse
                            setProfile(data)
                            setFetchedAvatarUrl(data.avatar)
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
        }
    }, [user, hydrated, userLoaded]);

    const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdating(true)
        setUpdatingError(null)
        setUpdateSuccess(false)

        const parsed = validateForm();
        if (!parsed) {
            setUpdating(false)
            console.log('fail')
        } else {
            const fileInput = (document.getElementById('file_input') as HTMLInputElement)
            const file = fileInput && fileInput.files ? fileInput.files[0] : null
            let fileUrl = profile?.avatar
            if(file) {
                const fileResponse = await storage.createFile(env.NEXT_PUBLIC_APPWRITE_STORAGE.NEXT_PUBLIC_APPWRITE_STORAGE_AVATARS ?? '', ID.unique(), file)
                fileUrl = `${env.NEXT_PUBLIC_APPWRITE_HOST_URL}/storage/buckets/${fileResponse.bucketId}/files/${fileResponse.$id}/view?project=${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
            }
            console.log('here')
            functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.USERS,
                JSON.stringify({...profile, avatar: fileUrl}), false, '/users', ExecutionMethod.PUT).then(
                (res) => {
                        setUpdating(false)
                    if(res.responseStatusCode == 200) {
                        setUpdateSuccess(true)
                        setReloadUser(true)
                    } else {
                        setUpdateSuccess(false)
                        setUpdatingError(
                            res.responseStatusCode == 409 ? 'Username ' + profile?.username + ' is taken, please try a different one.'
                            : 'Unable to update profile. Please check your details and try again.')
                    }
                },
                (error: AppwriteException) => {
                    setUpdatingError(error.message)
                    setUpdating(false)
                }
            )
        }
    }

    const validateForm = () => {
        const parsed = profileSchema.safeParse(profile);
        if (!parsed.success) {
            const formattedErrors = parsed.error.format();
            const newErrors = {
                name: formattedErrors.name?._errors[0] || null,
                username: formattedErrors.username?._errors[0] || null,

                work: Object.keys(formattedErrors.work || {}).filter(key => !isNaN(+key)).reduce((acc, key) => {
                    if(formattedErrors.work?.[+key]?.company?._errors[0] || formattedErrors.work?.[+key]?.title?._errors[0]) {
                        acc[Number(key)] = {
                            company: formattedErrors.work?.[+key]?.company?._errors[0] || null,
                            title: formattedErrors.work?.[+key]?.title?._errors[0] || null
                        };
                    }
                    return acc;
                }, {} as { [key: number]: { company: string | null, title: string | null } }),

                schools: Object.keys(formattedErrors.schools || {}).filter(key => !isNaN(+key)).reduce((acc, key) => {
                    if(formattedErrors.schools?.[+key]?.name?._errors[0] || formattedErrors.schools?.[+key]?.course?._errors[0]) {
                        acc[Number(key)] = {
                            name: formattedErrors.schools?.[+key]?.name?._errors[0] || null,
                            course: formattedErrors.schools?.[+key]?.course?._errors[0] || null
                        };
                    }
                    return acc;
                }, {} as { [key: number]: { name: string | null, course: string | null } })
            }
            console.log('new errors', newErrors, parsed)
            setErrors(newErrors);
            return null
        } else {
            setErrors({name: null, schools: {}, username: null, work: {}});
            return parsed
        }
    }

    useEffect(() => {
        if(profile) validateForm()
    }, [profile]);

    return (
        !loading && profile ?
            <section className="bg-white dark:bg-gray-900">
                <div className='fixed w-full top-[60px] z-20'>
                    {updatingError &&
                        <div id="alert-border-2"
                             className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
                             role="alert">
                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <div className="ms-3 text-sm font-medium">
                                {updatingError}
                            </div>
                            <button type="button" onClick={()=> setUpdatingError(null)}
                                    className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                                    data-dismiss-target="#alert-border-2" aria-label="Close">
                                <span className="sr-only">Dismiss</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    }
                    {updateSuccess &&
                        <div id="alert-border-3"
                             className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
                             role="alert">
                            <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                            </svg>
                            <div className="ms-3 text-sm font-medium">
                                Your profile has been updated successfully.
                            </div>
                            <button type="button" onClick={()=> setUpdateSuccess(false)}
                                    className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                                    data-dismiss-target="#alert-border-3" aria-label="Close">
                                <span className="sr-only">Dismiss</span>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                    }
                </div>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update your profile</h2>
                    <form onSubmit={updateProfile}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Name <span className='text-red-400'>*</span>
                                </label>
                                <input type="text" name="name" id="name" defaultValue={profile?.name}
                                       onChange={(event) => setProfile({...profile, name: event.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Type your name"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="username"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Username <span className='text-red-400'>*</span>
                                </label>
                                <input type="text" name="username" id="username" defaultValue={profile?.username}
                                       onChange={(event) => setProfile({...profile, username: event.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="username"/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="title"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                <input type="text" name="title" id="title" defaultValue={profile?.title ?? ''}
                                       onChange={(event) => setProfile({...profile, title: event.target.value})}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Software Engineer"/>
                            </div>

                            <div className="sm:col-span-2 flex gap-2">
                                <div className='flex-1'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                           htmlFor="file_input">
                                        Upload avatar <span className='text-gray-400'>(optional)</span>
                                        <span>
                                            {profile.avatar != fetchedAvatarUrl &&
                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    setProfile({...profile, avatar: fetchedAvatarUrl})
                                                    const file = document.getElementById('file_input');
                                                    if(file) (file as HTMLInputElement).value = '';
                                                }}
                                                        className="text-orange-500 hover:text-orange-700 font-semibold px-4 rounded">
                                                    click to reset
                                                </button>
                                            }
                                        </span>
                                    </label>
                                    <input accept='image/*'
                                        onChange={(event) => {
                                        if (event?.target?.files && event.target.files[0]) {
                                            const reader = new FileReader()
                                            reader.readAsDataURL(event.target.files[0])
                                            reader.onload = (e) => {
                                                console.log('result', e.target)
                                                setProfile({...profile, avatar: e?.target?.result as string})
                                            }
                                        } else {
                                            console.log('no file')
                                        }
                                    }}
                                           className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                           aria-describedby="file_input_help" id="file_input" type="file"/>
                                </div>
                                {profile.avatar ?
                                    <div className='flex flex-col justify-center items-center'>
                                        <img className="w-20 h-20 rounded" src={profile.avatar}
                                             alt="Large avatar"/>
                                            <button type="button" onClick={() => setProfile({...profile, avatar: null})}
                                                    className="mt-1 py-0 px-2 text-sm font-medium text-red-500 focus:outline-none bg-white rounded hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-red-500 dark:hover:text-red-800 dark:hover:bg-gray-700">
                                                delete
                                            </button>
                                    </div>
                                    :
                                    <div
                                        className="relative w-20 h-20 me-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                        <svg className="absolute text-gray-400 -left-1"
                                             fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                }
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor="website"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your Website
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
                                        </svg>
                                    </div>
                                    <input type="text" id="website"
                                           defaultValue={profile?.website ?? ''}
                                           onChange={(event) => setProfile({...profile, website: event.target.value})}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           placeholder="https://example.com"/>
                                </div>
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor="github"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your GitHub Username
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path fillRule="evenodd"
                                                  d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <input type="text" id="github"
                                           defaultValue={profile?.socials.find(s => s.type == 'github')?.username}
                                           onChange={(event) => updateSocial('github', event.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           placeholder="github"/>
                                </div>
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor="linkedin"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your LinkedIn Username
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path fillRule="evenodd"
                                                  d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                                                  clipRule="evenodd"/>
                                            <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
                                        </svg>
                                    </div>
                                    <input type="text" id="linkedin"
                                           defaultValue={profile?.socials.find(s => s.type == 'linkedin')?.username}
                                           onChange={(event) => updateSocial('linkedin', event.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           placeholder="linkedin"/>
                                </div>
                            </div>
                            <div className='sm:col-span-2'>
                                <label htmlFor="twitter"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your Twitter/X Username
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             fill="currentColor"
                                             viewBox="0 0 24 24">
                                            <path fillRule="evenodd"
                                                  d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <input type="text" id="twitter"
                                           defaultValue={profile?.socials.find(s => s.type == 'twitter')?.username}
                                           onChange={(event) => updateSocial('twitter', event.target.value)}
                                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                           placeholder="twitter"/>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="bio"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                                <textarea id="bio" rows={8} defaultValue={profile?.bio ?? ''}
                                          onChange={(event) => setProfile({...profile, bio: event.target.value})}
                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                          placeholder="Your bio here"></textarea>
                            </div>

                            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 sm:col-span-2"/>

                            <div className='sm:col-span-2'>
                                <div>
                                    <span>Work Experience</span>
                                </div>
                                <div>
                                    {profile?.work.map((work, index) => (
                                        <div key={index + work.$id}
                                             className='rounded shadow-sm border border-gray-300 dark:border-gray-700 my-2 p-2'>
                                            <div className="w-full my-2">
                                                <label htmlFor={'work-company-' + work.$id + '-' + index}
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Company Name <span className='text-red-400'>*</span>
                                                </label>
                                                <input type="text" name="work-company"
                                                       id={"work-company-" + work.$id + '-' + index}
                                                       defaultValue={work.company}
                                                       onChange={event => updateWork(index, {
                                                           ...work,
                                                           company: event.target.value
                                                       })}
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="gitConnect Corp"/>
                                            </div>
                                            <div className="w-full my-2">
                                                <label htmlFor={'work-title-' + work.$id + '-' + index}
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Job Title <span className='text-red-400'>*</span>
                                                </label>
                                                <input type="text" name="work-title"
                                                       id={'work-title-' + work.$id + '-' + index} defaultValue={work.title}
                                                       onChange={event => updateWork(index, {
                                                           ...work,
                                                           title: event.target.value
                                                       })}
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="Software Engineer"/>
                                            </div>

                                            <div
                                                className="flex flex-col justify-center sm:flex-row sm:items-center w-full my-4">
                                                <div className="flex-1">
                                                    <Datepicker onSelectedDateChanged={(date) => updateWork(index, {...work, startDate: date.toISOString() })}
                                                        defaultDate={work.startDate ? new Date(work.startDate) : undefined}/>
                                                </div>
                                                <span className="mx-4 text-gray-500">to</span>
                                                <div className="flex-1">
                                                    {work.endDate ?
                                                        <Datepicker onSelectedDateChanged={(date) => updateWork(index, {...work, endDate: date.toISOString() })}
                                                            defaultDate={work.endDate ? new Date(work.endDate) : undefined}/>
                                                        :
                                                        <div
                                                            className='p-2.5 rounded bg-gray-50 dark:bg-gray-700 text-center text-sm border border-gray-300 dark:border-gray-600'>Present</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="flex items-center mb-4 sm:col-span-2">
                                                <input id={'work-current-checkbox-' + work.$id + '-' + index}
                                                       type="checkbox" checked={!work.endDate}
                                                       onChange={(event) => markWorkCurrent(index, event.target.checked)}
                                                       className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor={'work-current-checkbox-' + work.$id + '-' + index}
                                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Mark job as current to remove end date.
                                                </label>
                                            </div>

                                            <div className='flex sm:col-span-2 justify-end items-center'>
                                                <button type="button" onClick={() => deleteWork(index)}
                                                        className="py-1 px-2 me-2 mb-2 text-sm font-medium text-red-500 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-red-500 dark:border-gray-600 dark:hover:text-red-800 dark:hover:bg-gray-700">
                                                    delete
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                                <div className='flex  items-center justify-end sm:col-span-2'>
                                    <button type="button" onClick={addWork}
                                            className="text-center inline-flex items-center py-1 px-3 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        <svg className="w- h-4 text-gray-800 dark:text-white" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="M5 12h14m-7 7V5"/>
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>

                            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 sm:col-span-2"/>
                            <div className='sm:col-span-2'>
                                <div>
                                    <span>Education</span>
                                </div>
                                <div>
                                    {profile?.schools.map((school, index) => (
                                        <div key={index + school.$id}
                                             className='rounded shadow-sm border border-gray-300 dark:border-gray-700 my-2 p-2'>
                                            <div className="w-full my-2">
                                                <label htmlFor={'school-name-' + school.$id + '-' + index}
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    School Name <span className='text-red-400'>*</span>
                                                </label>
                                                <input type="text" name="school-name"
                                                       id={'school-name-' + school.$id + '-' + index}
                                                       defaultValue={school.name}
                                                       onChange={event => updateSchool(index, {
                                                           ...school,
                                                           name: event.target.value
                                                       })}
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="gitConnect Univeristy"/>
                                            </div>
                                            <div className="w-full my-2">
                                                <label htmlFor={'school-course-' + school.$id + '-' + index}
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Course <span className='text-red-400'>*</span>
                                                </label>
                                                <input type="text" name="school-course"
                                                       id={'school-course-' + school.$id + '-' + index}
                                                       defaultValue={school.course}
                                                       onChange={event => updateSchool(index, {
                                                           ...school,
                                                           course: event.target.value
                                                       })}
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="BSc. Computer Science"/>
                                            </div>

                                            <div
                                                className="flex flex-col justify-center sm:flex-row sm:items-center w-full my-4">
                                                <div className="flex-1">
                                                    <Datepicker onSelectedDateChanged={(date) => updateSchool(index, {...school, startDate: date.toISOString() })}
                                                        defaultDate={school.startDate ? new Date(school.startDate) : undefined}/>
                                                </div>
                                                <span className="mx-4 text-gray-500">to</span>
                                                <div className="flex-1">
                                                    {school.endDate ?
                                                        <Datepicker onSelectedDateChanged={(date) => updateSchool(index, {...school, endDate: date.toISOString() })}
                                                            defaultDate={school.endDate ? new Date(school.endDate) : undefined}/>
                                                        :
                                                        <div
                                                            className='p-2.5 rounded bg-gray-50 dark:bg-gray-700 text-center text-sm border border-gray-300 dark:border-gray-600'>Present</div>
                                                    }
                                                </div>
                                            </div>

                                            <div className="flex items-center mb-4 sm:col-span-2">
                                                <input type="checkbox"
                                                       id={'school-current-checkbox-' + school.$id + '-' + index}
                                                       checked={!school.endDate}
                                                       onChange={(event) => markSchoolCurrent(index, event.target.checked)}
                                                       className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor={'school-current-checkbox-' + school.$id + '-' + index}
                                                       className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Mark school as current to remove end date.
                                                </label>
                                            </div>

                                            <div className='flex sm:col-span-2 justify-end items-center'>
                                                <button type="button" onClick={() => deleteSchool(index)}
                                                        className="py-1 px-2 me-2 mb-2 text-sm font-medium text-red-500 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-red-500 dark:border-gray-600 dark:hover:text-red-800 dark:hover:bg-gray-700">
                                                    delete
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                                <div className='flex items-center justify-end sm:col-span-2'>
                                    <button type="button" onClick={addSchool}
                                            className="text-center inline-flex items-center py-1 px-3 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        <svg className="w- h-4 text-gray-800 dark:text-white" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="M5 12h14m-7 7V5"/>
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button disabled={Object.values(errors).some(error => !_.isEmpty(error))}
                                isProcessing={updating}
                                type="submit"
                                className="mt-4 sm:mt-6 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Update Profile
                        </Button>
                    </form>
                </div>
            </section>
            : <div className='flex-1 flex items-center justify-center'><Loader/></div>
    );
}

export default EditProfile;