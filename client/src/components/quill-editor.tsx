'use client';
import React, {forwardRef, useEffect, useRef, useState} from "react";
import {storage} from "@/lib/config/appwrite";
import env from "@/env";
import {ID} from "appwrite";
import {Button} from "flowbite-react";
import {cn} from "@/lib/utils";
// import hljs from 'highlight.js';

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface QuillEditorProps {
    readOnly?: boolean;
    defaultValue?: string;
    placeholder?: string;
    onTextChange?: (delta: any, oldDelta: any, source: string) => void;
    onSelectionChange?: (range: any, oldRange: any, source: string) => void;
    actions?: { label: string; type: 'primary' | 'alternative'; click: (content: string) => Promise<boolean>}[];
}

const QuillEditor = forwardRef<null, QuillEditorProps>(
    ({actions = [], readOnly = false, defaultValue = "", placeholder = "Type something...",
         onTextChange, onSelectionChange}, ref: any) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const [quill, setQuill] = useState<any | null>(null);
        const [actionResponse, setActionResponse] =
            useState<{success: boolean; message: string} | null>(null)

        const actionClasses = {
            primary:
                'px-8 py-0 text-xs font-medium text-center text-white bg-primary-700 rounded hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
            alternative:
                'py-0 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
        };

        useEffect(() => {
            if (typeof window !== 'undefined' && editorRef.current && !quill) {
                // Dynamically import Quill only on the client
                import('quill').then((Quill) => {
                    const newQuill = new Quill.default(editorRef.current!, {
                        theme: 'snow',
                        modules: {
                            toolbar: {
                                container: [
                                    [{header: [1, 2, false]}],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{list: 'ordered'}, {list: 'bullet'}],
                                    ['link', 'image'],
                                    ['code-block'],
                                ],
                                handlers: {image: imageHandler},
                            },
                        },
                        placeholder
                    });

                    if (defaultValue) {
                        newQuill.clipboard.dangerouslyPasteHTML(defaultValue);
                    }
                    setQuill(newQuill);
                    async function imageHandler() {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();

                        input.onchange = async () => {
                            const file = input.files ? input.files[0] : null;
                            if (file) {
                                try {
                                    const fileResponse = await storage.createFile(env.NEXT_PUBLIC_APPWRITE_STORAGE.NEXT_PUBLIC_APPWRITE_STORAGE_POSTS ?? '', ID.unique(), file)
                                    const fileUrl = `${env.NEXT_PUBLIC_APPWRITE_HOST_URL}/storage/buckets/${fileResponse.bucketId}/files/${fileResponse.$id}/view?project=${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                                    newQuill.insertEmbed(newQuill.selection.lastRange?.index ?? 0, 'image', fileUrl);
                                } catch (error) {
                                    console.error('Error uploading image:', error);
                                }
                            }
                        };
                    }

                    if (typeof ref === 'function') {
                        ref(newQuill);
                    } else if (ref) {
                        ref.current = newQuill;
                    }
                });
            }
        }, [ref, defaultValue, quill]);

        useEffect(() => {
            if (quill) {
                quill.enable(!readOnly);
            }
        }, [quill, readOnly]);

        useEffect(() => {
            if (quill) {
                quill.on('text-change', (delta: any, oldDelta: any, source: string) => {
                    onTextChange?.(delta, oldDelta, source);
                });

                quill.on('selection-change', (range: any, oldRange: any, source: string) => {
                    onSelectionChange?.(range, oldRange, source);
                });

                return () => {
                    quill.off('text-change');
                    quill.off('selection-change');
                };
            }
        }, [quill, onTextChange, onSelectionChange]);

        return (
            <div className='border border-gray-300 dark:border-gray-600 pb-2 rounded-md bg-gray-200 dark:bg-gray-800'>
                <div className="quill-editor">
                    <div ref={editorRef}/>
                </div>
                {actions.length > 0 && actions.map((action, index) => (
                    <div className='flex justify-end mt-2 mr-2' key={index}>
                        <Button onClick={async ()=>{
                            setActionResponse(null)
                            if(!quill?.root) {
                                setActionResponse({success: false, message: 'An error occurred. Reload and try again.'})
                                return
                            } else if(!quill.root.innerText.trim()) {
                                setActionResponse({success: false, message: 'Please type something in order to post.'})
                                return
                            }
                            const success = await action.click(`<div class="ql-editor">${quill?.root?.innerHTML}</div>`);
                            if(success) {
                                setActionResponse({success, message: action.label + ' successful.'})
                                quill.clipboard.dangerouslyPasteHTML('')
                            } else {
                                setActionResponse({success, message: action.label + ' failed. Try again.'})
                            }
                        }} className={actionClasses[action.type]}>
                                {action.label}
                        </Button>
                    </div>
                ))}

                {actionResponse &&
                    <div className={cn('text-center my-2 px-2',
                        actionResponse.success ? 'text-green-400' : 'text-red-400')}>
                        {actionResponse.message}
                    </div>
                }
            </div>
        );
    }
);

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
