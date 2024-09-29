'use client';
import React, {useRef} from 'react';
import Post from "@/components/post";
import QuillEditor from "@/components/quill-editor";
// import Quill from "quill";


// const Delta = Quill.import('delta');

function Feed() {
    const posts = [
        {$id: '1', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '2', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
        {$id: '3', content: '<p>NextJS Social Network for Developers GitConnect allows developers to create a developer profile/portfolio, share posts and get help from others developers</p><p><br></p><p><img src="/images/gitconnect-logo-with-brandname.png"></p>'},
    ]

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const quillRef: any = useRef();

    return (
        <section className='w-full max-w-3xl lg:max-w-screen-lg m-auto my-4 md:my-8'>
            <div className='p-2'>
                <QuillEditor
                    actions={[{label: 'Post', type: 'primary', click: ()=>{}}]}
                    ref={quillRef}
                />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div>
                {posts.map(post => <Post post={post} key={post.$id}/>)}
            </div>
        </section>
    );
}

export default Feed;
