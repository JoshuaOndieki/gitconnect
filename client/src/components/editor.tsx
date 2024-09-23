'use client';
import React, {useRef} from 'react';
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

/* eslint-disable react/display-name */
const ReactQuill = dynamic(async ()=> {
    const {default: ReactQuill} = await import("react-quill");
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return ({forwardedRef, ...props}: any) => (
        <ReactQuill ref={forwardedRef} {...props} />
    );
}, {
    ssr: false,
});

function Editor() {
    // const [content, setContent] = React.useState('');
    //
    // const changeContent = (newContent: string) => {
    //     console.log(newContent)
    //     setContent(newContent);
    // }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const quillRef = useRef<any>(null);

    // Custom image handler for ReactQuill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (file) {
                // const fileName = `${Date.now()}_${file.name}`;
                try {
                    // TODO: upload image to Appwrite storage
                    const quill = quillRef?.current?.getEditor();
                    console.log('quill', quill)
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', '/images/gitconnect-logo-with-brandname.png');
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        };
    };

    return (
        <ReactQuill forwardedRef={quillRef} theme='snow'
                    modules={{toolbar: {
                            container: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['code-block']
                            ], handlers: {image: imageHandler}}}}
                    placeholder='write your post here..'/>
    );
}

export default Editor;
