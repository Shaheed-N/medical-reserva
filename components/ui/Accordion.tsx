'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
    id: string;
    question: string;
    answer: string;
}

interface AccordionProps {
    items: AccordionItem[];
    className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-slate-300 transition-colors"
                >
                    <button
                        onClick={() => toggle(item.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                        <span className="text-lg font-semibold text-slate-900 group-hover:text-[#0F766E] transition-colors pr-8">
                            {item.question}
                        </span>
                        <motion.div
                            animate={{ rotate: openId === item.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                        >
                            <ChevronDown
                                size={20}
                                className={`transition-colors ${openId === item.id ? 'text-[#0F766E]' : 'text-slate-400'
                                    }`}
                            />
                        </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                        {openId === item.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                    {item.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
