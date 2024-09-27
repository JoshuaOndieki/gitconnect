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

function Editor({actions}: {actions: {label: string, type: 'primary' | 'alternative', click: ()=>void}[]}) {
    // const [content, setContent] = React.useState('');
    //
    // const changeContent = (newContent: string) => {
    //     console.log(newContent)
    //     setContent(newContent);
    // }

    const actionClasses = {
        primary: 'px-8 py-2 text-xs font-medium text-center text-white bg-primary-700 rounded hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
        alternative: 'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
    }

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
        <>
            <ReactQuill forwardedRef={quillRef} theme='snow'
                        modules={{
                            toolbar: {
                                container: [
                                    [{'header': [1, 2, false]}],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{'list': 'ordered'}, {'list': 'bullet'}],
                                    ['link', 'image'],
                                    ['code-block']
                                ], handlers: {image: imageHandler}
                            }
                        }}
                        placeholder='write your post here..'/>
            { actions.map((action, index) =>
                <div className='flex justify-end mt-2' key={index}>
                    <button type="button" onClick={action.click}
                            className={actionClasses[action.type]}>
                        {action.label}
                    </button>
                </div>
            )}
        </>
    );
}

export default Editor;
