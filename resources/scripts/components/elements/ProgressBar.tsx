import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { randomInt } from '@/helpers';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';

const BarFill = styled.div`
    ${tw`h-full`};
    transition: 100ms ease-in-out;
    background-color: #ffffff;
    background-image: linear-gradient(to right, #27c4f5, #a307ba, #fd8d32, #70c050, #27c4f5);
`;

type Timer = ReturnType<typeof setTimeout>;

export default () => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const timeout = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [visible, setVisible] = useState(false);
    const progress = useStoreState((state) => state.progress.progress);
    const continuous = useStoreState((state) => state.progress.continuous);
    const setProgress = useStoreActions((actions) => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        setVisible((progress || 0) > 0);

        if (progress === 100) {
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [progress]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(5, 20));
        }
    }, [continuous]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                interval.current = setTimeout(() => setProgress((progress || 0) + randomInt(1, 5)), 500);
            }
        }
    }, [progress, continuous]);

    return (
        // Making this a no-op because it makes things feel slow i think
        <></>
        // <div data-pyro-progressbar className='w-full fixed h-[2px]'>
        //     <CSSTransition timeout={50} appear in={visible} unmountOnExit classNames={'fade'}>
        //         <BarFill style={{ width: progress === undefined ? '100%' : `${progress}%` }} />
        //     </CSSTransition>
        // </div>
    );
};
