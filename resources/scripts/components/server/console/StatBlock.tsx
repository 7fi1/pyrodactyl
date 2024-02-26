import React from 'react';
import clsx from 'clsx';
import styles from './style.module.css';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    children: React.ReactNode;
    className?: string;
}

export default ({ title, copyOnClick, color, className, children }: StatBlockProps) => {
    // const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <div className={clsx(styles.stat_block, 'bg-[#ffffff09] border-[1px] border-[#ffffff11]', className)}>
                <div className={clsx(styles.status_bar, color || 'bg-zinc-700')} />
                <div className={'flex flex-col justify-center overflow-hidden w-full'}>
                    <p className={'leading-tight text-xs md:text-sm text-zinc-400'}>{title}</p>
                    <div className={'text-[32px] font-extrabold leading-[98%] tracking-[-0.07rem] w-full truncate'}>
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
};
