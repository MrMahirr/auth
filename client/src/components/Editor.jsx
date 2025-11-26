import React, { useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, $getRoot } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Code, Undo, Redo,
    AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Eraser
} from 'lucide-react';
import { mergeRegister } from '@lexical/utils';

const theme = {
    paragraph: 'mb-2 text-gray-200 leading-relaxed',
    heading: {
        h1: 'text-3xl font-bold text-white mt-6 mb-4 border-b border-white/10 pb-2',
        h2: 'text-2xl font-bold text-white mt-5 mb-3',
    },
    list: {
        ul: 'list-disc ml-6 mb-4 text-gray-300',
        ol: 'list-decimal ml-6 mb-4 text-gray-300',
        listitem: 'mb-1',
    },
    text: {
        bold: 'font-bold text-cyan-300',
        italic: 'italic text-purple-300',
        underline: 'underline decoration-cyan-500/50 underline-offset-4',
        strikethrough: 'line-through text-gray-500',
        code: 'bg-black/50 text-cyan-400 font-mono text-sm px-1.5 py-0.5 rounded border border-white/10',
    },
    quote: 'border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-cyan-900/10 text-gray-300 italic rounded-r-lg',
};

const Toolbar = () => {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        setIsBold(selection.hasFormat('bold'));
                        setIsItalic(selection.hasFormat('italic'));
                        setIsUnderline(selection.hasFormat('underline'));
                        setIsStrikethrough(selection.hasFormat('strikethrough'));
                    }
                });
            })
        );
    }, [editor]);

    const formatText = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    const formatHeading = (tag) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(tag));
            }
        });
    };

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    const ToolbarBtn = ({ icon: Icon, onClick, isActive, title }) => (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center ${isActive
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-black/40 sticky top-0 z-10">
            <ToolbarBtn icon={Undo} onClick={() => editor.dispatchCommand(Undo, undefined)} title="Geri Al" />
            <ToolbarBtn icon={Redo} onClick={() => editor.dispatchCommand(Redo, undefined)} title="İleri Al" />
            <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>

            <ToolbarBtn icon={Bold} onClick={() => formatText('bold')} isActive={isBold} title="Kalın" />
            <ToolbarBtn icon={Italic} onClick={() => formatText('italic')} isActive={isItalic} title="İtalik" />
            <ToolbarBtn icon={UnderlineIcon} onClick={() => formatText('underline')} isActive={isUnderline} title="Altı Çizili" />
            <ToolbarBtn icon={Strikethrough} onClick={() => formatText('strikethrough')} isActive={isStrikethrough} title="Üstü Çizili" />
            <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>

            <ToolbarBtn icon={Heading1} onClick={() => formatHeading('h1')} title="Başlık 1" />
            <ToolbarBtn icon={Heading2} onClick={() => formatHeading('h2')} title="Başlık 2" />
            <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>

            <ToolbarBtn icon={AlignLeft} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} title="Sola Hizala" />
            <ToolbarBtn icon={AlignCenter} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} title="Ortala" />
            <ToolbarBtn icon={AlignRight} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} title="Sağa Hizala" />
            <div className="w-px h-6 bg-white/10 mx-1 self-center"></div>

            <ToolbarBtn icon={List} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} title="Liste" />
            <ToolbarBtn icon={ListOrdered} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} title="Sıralı Liste" />
            <ToolbarBtn icon={Quote} onClick={formatQuote} title="Alıntı" />
            <ToolbarBtn icon={Eraser} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, '')} title="Temizle" />
        </div>
    );
};

// --- HTML ÇIKTISI VE GİRİŞİ YÖNETİMİ ---
const HtmlPlugin = ({ initialHtml }) => {
    const [editor] = useLexicalComposerContext();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!initialHtml || isInitialized.current) return;

        editor.update(() => {
            const root = $getRoot();
            if (root.getTextContentSize() > 0) return; // Zaten içerik varsa dokunma

            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);

            root.clear();
            root.append(...nodes);
            isInitialized.current = true;
        });
    }, [editor, initialHtml]);

    return null;
};

// --- ANA EDİTÖR BİLEŞENİ ---
export default function Editor({ value, onChange }) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError(error) {
            console.error(error);
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            LinkNode,
            AutoLinkNode
        ]
    };

    return (
        <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full ring-1 ring-transparent focus-within:ring-cyan-500/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />
                <div className="relative flex-1 overflow-y-auto custom-scrollbar bg-black/10">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-full p-6 focus:outline-none" />
                        }
                        placeholder={
                            <div className="absolute top-6 left-6 text-gray-600 pointer-events-none italic">
                                Hikayeni yazmaya başla...
                            </div>
                        }
                    />
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <AutoFocusPlugin />
                    <HtmlPlugin initialHtml={value} />
                    <OnChangePlugin
                        onChange={(editorState, editor) => {
                            editorState.read(() => {
                                const html = $generateHtmlFromNodes(editor);
                                if (html !== value) {
                                    onChange(html);
                                }
                            });
                        }}
                    />
                </div>
            </LexicalComposer>
        </div>
    );
}