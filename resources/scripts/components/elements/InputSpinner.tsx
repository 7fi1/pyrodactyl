import Spinner from '@/components/elements/Spinner';
import Fade from '@/components/elements/Fade';
import styled, { css } from 'styled-components';
import Select from '@/components/elements/Select';

const Container = styled.div<{ $visible?: boolean }>`
    position: relative

    ${(props) =>
        props.$visible &&
        css`
            & ${Select} {
                background-image: none;
            }
        `};
`;

const InputSpinner = ({ visible, children }: { visible: boolean; children: React.ReactNode }) => (
    <Container $visible={visible}>
        <Fade appear unmountOnExit in={visible} timeout={150}>
            <div className={`absolute right-0 h-full flex items-center justify-end pr-3`}>
                <Spinner size={'small'} />
            </div>
        </Fade>
        {children}
    </Container>
);

export default InputSpinner;
