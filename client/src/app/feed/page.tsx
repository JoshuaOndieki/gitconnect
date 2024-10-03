'use client';
import React, {useEffect, useRef, useState} from 'react';
import Post from "@/components/post";
import QuillEditor from "@/components/quill-editor";
import {AppwriteException, ExecutionMethod} from "appwrite";
import {functions} from "@/lib/config/appwrite";
import env from "@/env";
import {PostData, PostsResponse} from "@/lib/types";
import Loader from "@/components/loader";
import {Button} from "flowbite-react";
// import Quill from "quill";


// const Delta = Quill.import('delta');

function Feed() {
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [postsResponse, setPostsResponse] = useState<PostsResponse | null>(null);
    const [fetchPostsError, setFetchPostsError] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [draftSearchQuery, setDraftSearchQuery] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string | null>(null)
    const [newPosts, setNewPosts] = useState<PostData[]>([])
    const [loadedPosts, setLoadedPosts] = useState<PostData[]>([])

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const quillRef: any = useRef();

    useEffect(() => {
        fetchPosts()
        }, [searchQuery, pageNumber]);

    const fetchPosts = () => {
        const queryParams = new URLSearchParams()
        if(searchQuery) {
            queryParams.set('searchQuery', searchQuery)
            if(searchQuery != postsResponse?.metadata.searchQuery) setPageNumber(1)
        }
        if(pageNumber) {
            queryParams.set('pageNumber', String(pageNumber))
        }
        setLoadingMore(true);
        functions.createExecution(env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, '', false,
            `/posts?${queryParams.toString()}`, ExecutionMethod.GET)
            .then(res => {
                if(res.responseStatusCode == 200) {
                    const data = JSON.parse(res.responseBody) as PostsResponse
                    setPostsResponse(data)
                    setLoadedPosts(current => [...current, ...data.results])
                } else {
                    setPostsResponse(null);
                }
                setLoading(false)
                setLoadingMore(false);
            })
            .catch((err) => {
                setLoading(false)
                setLoadingMore(false);
                console.error('fetch posts error', err)
                setFetchPostsError((err as AppwriteException).message)
            });
    }

    return (
        <section className='w-full max-w-3xl lg:max-w-screen-lg m-auto my-4 md:my-8'>
            <div className='p-2'>
                <QuillEditor
                    actions={[
                        {
                            label: 'Post', type: 'primary',
                            click: async (content) => {
                                try {
                                    const response = await functions.createExecution(
                                        env.NEXT_PUBLIC_APPWRITE_FUNCTIONS.POSTS, JSON.stringify({content}), false,
                                        '/posts', ExecutionMethod.POST
                                    )
                                    if(response.responseStatusCode == 201) {
                                        setNewPosts(state => [JSON.parse(response.responseBody), ...state])
                                    }
                                    return response.responseStatusCode == 201;
                                } catch (error) {
                                    console.error('Unable to post', error)
                                    return false
                                }
                            }
                        }
                    ]}
                    ref={quillRef}
                />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
            <form className="flex items-center mx-auto max-w-2xl px-4 md:px-8"
                  onSubmit={(event)=> {
                      event.preventDefault()
                      setSearchQuery(draftSearchQuery)
                      setPostsResponse(null);
                      setLoadedPosts([])
                      setLoading(true)
                  }}>
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"/>
                        </svg>
                    </div>
                    <input type="text" id="simple-search" name='simple_search'
                           value={draftSearchQuery ?? ''}
                           onChange={(event) => setDraftSearchQuery(event.target.value)}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                           placeholder="Search posts..."/>
                </div>
                <button type="submit"
                        className="p-2.5 ms-2 text-sm font-medium text-white bg-primary-700 rounded-lg border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

            {newPosts.length > 0 &&
                <div>
                    {newPosts.map(post => <Post post={post} key={post.$id} styleClass='bg-amber-100 dark:bg-amber-900'/>)}
                </div>
            }
            {loadedPosts.length > 0 &&
                <div>
                {loadedPosts.map(post => <Post post={post} key={post.$id}/>)}
                </div>
            }
            {fetchPostsError && <div className='text-center text-red-400'>Unable to fetch posts.</div>}
            {loading && <div className='py-2'><Loader/></div>}
            {(!loading && !postsResponse) && <div className='text-center'>No posts found.</div>}
            {(postsResponse && postsResponse.metadata.total.filtered == 10) &&
                <div className='flex items-center justify-center w-full m-2 mt-8'>
                    <Button color='gray' isProcessing={loadingMore}
                            onClick={()=> setPageNumber(current => current + 1)}>
                        Load more posts
                    </Button>
                </div>
            }
        </section>
    );
}

export default Feed;
