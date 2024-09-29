'use client';
import React, { forwardRef, useEffect, useRef, useState } from "react";
import Quill from "quill";


interface QuillEditorProps {
    readOnly?: boolean;
    defaultValue?: string;
    onTextChange?: (delta: any, oldDelta: any, source: string) => void;
    onSelectionChange?: (range: any, oldRange: any, source: string) => void;
    actions?: {label: string, type: 'primary' | 'alternative', click: ()=>void}[];
}

const QuillEditor = forwardRef<Quill, QuillEditorProps>(
    ({ actions = [],
         readOnly = false, defaultValue = "",
         onTextChange, onSelectionChange }, ref: any) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const [quill, setQuill] = useState<Quill | null>(null);

        const actionClasses = {
            primary: 'px-8 py-2 text-xs font-medium text-center text-white bg-primary-700 rounded hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800',
            alternative: 'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        }

        useEffect(() => {
            if (typeof window !== 'undefined' && editorRef.current && !quill) {
                const newQuill = new Quill(editorRef.current, {
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: [
                                [{'header': [1, 2, false]}],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                ['link', 'image'],
                                ['code-block']
                            ],
                            handlers: {image: imageHandler}
                        },
                    }
                });

                if (defaultValue) {
                    newQuill.clipboard.dangerouslyPasteHTML(defaultValue);
                }

                setQuill(newQuill);

                if (typeof ref === 'function') {
                    ref(newQuill);
                } else if (ref) {
                    ref.current = newQuill;
                }

                return () => {
                    if (typeof ref === 'function') {
                        ref(null);
                    } else if (ref) {
                        ref.current = null;
                    }
                };
            }
        }, [ref]);

        useEffect(() => {
            if (typeof window !== 'undefined' && quill) {
                quill.enable(!readOnly);
            }
        }, [quill, readOnly]);

        useEffect(() => {
            if (quill) {
                quill.on('text-change', (delta, oldDelta, source) => {
                    onTextChange?.(delta, oldDelta, source);
                });

                quill.on('selection-change', (range, oldRange, source) => {
                    onSelectionChange?.(range, oldRange, source);
                });

                return () => {
                    quill.off('text-change');
                    quill.off('selection-change');
                };
            }
        }, [quill, onTextChange, onSelectionChange]);

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
                        const quill = ref?.current?.getEditor();
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
            <div className='border border-gray-200 dark:border-gray-700 p-2 rounded-md bg-gray-200 dark:bg-gray-800'>
                <div className="quill-editor">
                    <div ref={editorRef} />
                </div>
                { actions.length && actions.map((action, index) =>
                    <div className='flex justify-end mt-2' key={index}>
                        <button type="button" onClick={action.click}
                                className={actionClasses[action.type]}>
                            {action.label}
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
