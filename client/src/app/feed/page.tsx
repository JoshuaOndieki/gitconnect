import React from 'react';
import Editor from "@/components/editor";
import Post from "@/components/post";

function Feed(props:any) {
    const posts = [
        {$id: '1', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '2', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '3', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
    ]

    return (
        <section className='max-w-3xl lg:max-w-screen-lg m-auto my-8 md:my-16'>
            <div className='p-2'>
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
                {posts.map(post => <Post post={post} key={post.$id}/>)}
            </div>
        </section>
    );
}

export default Feed;
