'use client';
import React from 'react';
import Editor from "@/components/editor";
import Post from "@/components/post";

function Feed() {
    const posts = [
        {$id: '1', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '2', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '3', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
    ]

    return (
        <section className='w-full max-w-3xl lg:max-w-screen-lg m-auto my-8 md:my-16'>
            <div className='p-2'>
                <Editor actions={[{label: 'Post', type: 'primary', click: ()=>{}}]}/>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div>
                {posts.map(post => <Post post={post} key={post.$id}/>)}
            </div>
        </section>
    );
}

export default Feed;
