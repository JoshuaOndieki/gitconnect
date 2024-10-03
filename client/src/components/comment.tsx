'use client';
import React from 'react';
import {CommentData} from "@/lib/types";
import {Dropdown} from "flowbite-react";
import useGitConnectStore from "@/lib/zustand";
import {dateFormatter} from "@/lib/utils";


function Comment({comment}: {comment: CommentData}) {
    const {user} = useGitConnectStore()
    return (
        <div className='border border-gray-200 dark:border-gray-700 rounded p-2 m-2'>
            <div className='flex justify-between'>
                <div className="flex items-center gap-1">
                    <a href={'/profiles/' + comment.user.username}>
                        {comment.user.avatar
                            ? <img className="w-10 h-10 me-2 rounded-full"
                                   src={comment.user.avatar} alt="user photo"/>
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
                        <a href={'/profiles/' + comment.user.username}>{comment.user.name} <span
                            className='text-gray-400'>@{comment.user.username}</span></a>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {dateFormatter(comment.$createdAt)}
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
                                      <span className="sr-only">Comment settings</span>
                                  </button>
                              )}>
                        {(comment.userId == user?.$id) && <Dropdown.Item>Edit</Dropdown.Item>}
                        {(comment.userId == user?.$id) && <Dropdown.Item>Remove</Dropdown.Item>}
                        <Dropdown.Item>Report</Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
            <div className='px-10 py-2'>
                {comment.content}
            </div>
        </div>
    );
}

export default Comment;