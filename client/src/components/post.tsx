'use client';
import React, {useEffect, useState} from 'react';
import DOMPurify from 'dompurify';
import {PostData, ReactionActionType} from "@/lib/types";
import {cn, dateFormatter} from "@/lib/utils";
import { Dropdown } from 'flowbite-react';
import useGitConnectStore from "@/lib/zustand";
import {functions} from "@/lib/config/appwrite";
import env from "@/env";
import {ExecutionMethod} from "appwrite";


function Post({post, styleClass}: { post: PostData, styleClass?:string }) {
    const [content, setContent] = React.useState('');
    const {user} = useGitConnectStore()
    const [postUpdated, setPostUpdated] = useState(post)
    const [postDeleted, setPostDeleted] = useState(false)

    useEffect(() => {
        if(typeof window !== 'undefined') {
            setContent(DOMPurify.sanitize(postUpdated.content))
        }
    }, [postUpdated]);

    const fetchPost = ()=> {
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, '', false,
            '/posts/' + postUpdated.$id, ExecutionMethod.GET)
            .then(res => {
                if(res.responseStatusCode == 200) {
                    setPostUpdated(JSON.parse(res.responseBody))
                } else {
                }
            })
    }

    const reactOnPost = (reaction: ReactionActionType) => {
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, '', false,
            `/posts/${postUpdated.$id}/reactions/?reaction=${reaction}`, ExecutionMethod.POST)
            .then(res => {
                if(res.responseStatusCode == 201) {
                    fetchPost()
                } else {

                }
            })
    }

    const deletePost = ()=> {
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, '', false,
            '/posts/' + post.$id, ExecutionMethod.DELETE)
            .then(res => {
                if(res.responseStatusCode == 204)
                    setPostDeleted(true)
            })
    }

    return (
        content && !postDeleted ?
            <div className={cn('border border-gray-200 dark:border-gray-700 rounded p-2 mx-2 my-4', styleClass)}>
                <div className='flex justify-between'>
                    <div className="flex items-center gap-1">
                        <a href={'/profiles/' + postUpdated.user.username}>
                            {postUpdated.user.avatar
                                ? <img className="w-10 h-10 me-2 rounded-full"
                                       src={postUpdated.user.avatar} alt="user photo"/>
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
                        </a>
                        <div className="font-medium dark:text-white">
                            <a href={'/profiles/' + postUpdated.user.username}>{postUpdated.user.name} <span className='text-gray-400'>@{postUpdated.user.username}</span></a>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {dateFormatter(postUpdated.$createdAt)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Dropdown label="Dropdown button" dismissOnClick={false}
                                  renderTrigger={()=> (
                                      <button className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                              type="button">
                                          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                               fill="currentColor" viewBox="0 0 16 3">
                                              <path
                                                  d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                          </svg>
                                          <span className="sr-only">Post settings</span>
                                      </button>
                                  )}>
                            {(postUpdated.userId == user?.$id) && <Dropdown.Item>Edit</Dropdown.Item>}
                            {(postUpdated.userId == user?.$id) && <Dropdown.Item onClick={deletePost}>Remove</Dropdown.Item>}
                            <Dropdown.Item>Report</Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                <div className='px-10 py-2' dangerouslySetInnerHTML={{__html: content}}>
                </div>
                <div className='flex justify-end gap-2'>
                    <div
                        className='flex items-center text-gray-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer'>
                        <span>{postUpdated.interactions.commentsCount}</span>
                        <a type="button" href={'/posts/' + postUpdated.$id}
                                className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                            <svg className="w-6 h-6" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"/>
                            </svg>
                            <span className="sr-only">comments</span>
                        </a>
                    </div>
                    <div
                        className={cn('flex items-center cursor-pointer',
                            postUpdated.interactions.userReaction == 'like' ? 'text-primary-500' : 'text-gray-800 dark:text-white hover:text-primary-500 dark:hover:text-primary-500')}>
                        <span>{postUpdated.interactions.likesCount}</span>
                        <button type="button"
                                onClick={() => reactOnPost(postUpdated.interactions.userReaction == 'like' ? 'undo-like' : 'like')}
                                className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                            {postUpdated.interactions.userReaction == 'like' ?
                                <svg className="w-6 h-6"
                                     aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
                                          clipRule="evenodd"/>
                                </svg>
                                :
                                <svg className="w-6 h-6" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"/>
                                </svg>
                            }
                            <span className="sr-only">like</span>
                        </button>
                    </div>
                    <div
                        className={cn('flex items-center cursor-pointer',
                            postUpdated.interactions.userReaction == 'dislike' ? 'text-red-500' : 'text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500')}>
                        <span>{postUpdated.interactions.dislikesCount}</span>
                        <button type="button"
                                onClick={() => reactOnPost(postUpdated.interactions.userReaction == 'dislike' ? 'undo-dislike' : 'dislike')}
                                className="focus:outline-none font-medium rounded-full text-sm p-2.5 pl-1 text-center inline-flex items-center">
                            {postUpdated.interactions.userReaction == 'dislike' ?
                                <svg className="w-6 h-6"
                                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
                                          clipRule="evenodd"/>
                                </svg>
                                :
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"/>
                                </svg>
                            }
                            <span className="sr-only">dislike</span>
                        </button>
                    </div>
                </div>
            </div>
            :
            postDeleted ?
                <div id="toast-simple"
                     className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
                     role="alert">
                    <svg className="w-5 h-5 text-red-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                         viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                    <div className="ps-4 text-sm font-normal text-red-400">Post deleted.</div>
                </div>
                : <></>
    );
}

export default Post;