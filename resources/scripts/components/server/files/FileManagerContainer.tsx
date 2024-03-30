import { useEffect, useState } from 'react';
import { httpErrorToHuman } from '@/api/http';
import { For } from 'million/react';
import FileObjectRow from '@/components/server/files/FileObjectRow';
import FileManagerBreadcrumbs from '@/components/server/files/FileManagerBreadcrumbs';
import { FileObject } from '@/api/server/files/loadDirectory';
import NewDirectoryButton from '@/components/server/files/NewDirectoryButton';
import { useLocation } from 'react-router-dom';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';
import { ServerContext } from '@/state/server';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import FileManagerStatus from '@/components/server/files/FileManagerStatus';
import MassActionsBar from '@/components/server/files/MassActionsBar';
import UploadButton from '@/components/server/files/UploadButton';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useStoreActions } from '@/state/hooks';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { Checkbox } from '@/components/elements/CheckboxNew';
import { hashToPath } from '@/helpers';
import NewFileButton from './NewFileButton';
import debounce from 'debounce';
import { MainPageHeader } from '@/components/elements/MainPageHeader';

const sortFiles = (files: FileObject[]): FileObject[] => {
    const sortedFiles: FileObject[] = files
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => (a.isFile === b.isFile ? 0 : a.isFile ? 1 : -1));
    return sortedFiles.filter((file, index) => index === 0 || file.name !== sortedFiles[index - 1]?.name);
};

export default () => {
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const { hash } = useLocation();
    const { data: files, error, mutate } = useFileManagerSwr();
    const filesArray = sortFiles(files?.slice(0, 250) ?? []);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const clearFlashes = useStoreActions((actions) => actions.flashes.clearFlashes);
    const setDirectory = ServerContext.useStoreActions((actions) => actions.files.setDirectory);

    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);
    const selectedFilesLength = ServerContext.useStoreState((state) => state.files.selectedFiles.length);

    useEffect(() => {
        clearFlashes('files');
        setSelectedFiles([]);
        setDirectory(hashToPath(hash));
    }, [hash]);

    useEffect(() => {
        mutate();
    }, [directory]);

    const onSelectAllClick = () => {
        console.log('files', files);
        setSelectedFiles(
            selectedFilesLength === (files?.length === 0 ? -1 : files?.length)
                ? []
                : files?.map((file) => file.name) || [],
        );
    };

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = debounce(setSearchTerm, 50);

    useEffect(() => {
        setSearchTerm('');
    }, [location]);

    if (error) {
        return <ServerError title={'Something went wrong.'} message={httpErrorToHuman(error)} />;
    }

    return (
        <ServerContentBlock title={'File Manager'} showFlashKey={'files'}>
            <ErrorBoundary>
                <MainPageHeader title={'Files'}>
                    <Can action={'file.create'}>
                        <div className='flex flex-row gap-1'>
                            <FileManagerStatus />
                            <NewDirectoryButton />
                            <NewFileButton id={id} />
                            <UploadButton />
                        </div>
                    </Can>
                </MainPageHeader>
                <div className={'flex flex-wrap-reverse md:flex-nowrap mb-4'}>
                    <FileManagerBreadcrumbs
                        renderLeft={
                            <Checkbox
                                className='ml-[1.6rem] mr-4'
                                checked={selectedFilesLength === (files?.length === 0 ? -1 : files?.length)}
                                onCheckedChange={() => onSelectAllClick()}
                            />
                        }
                    />
                </div>
            </ErrorBoundary>
            {!files ? null : (
                <>
                    {!files.length ? (
                        <p className={`text-sm text-zinc-400 text-center`}>This directory seems to be empty.</p>
                    ) : (
                        <>
                            {files.length > 250 && (
                                <div className={`rounded bg-yellow-400 mb-px p-3`}>
                                    <p className={`text-yellow-900 text-sm text-center`}>
                                        This directory is too large to display in the browser, limiting the output to
                                        the first 250 files.
                                    </p>
                                </div>
                            )}
                            <div
                                data-pyro-file-manager-files
                                style={{
                                    background:
                                        'radial-gradient(124.75% 124.75% at 50.01% -10.55%, rgb(16, 16, 16) 0%, rgb(4, 4, 4) 100%)',
                                }}
                                className='p-1 border-[1px] border-[#ffffff12] rounded-xl'
                            >
                                <div className='w-full h-full overflow-hidden rounded-lg flex flex-col gap-1'>
                                    <div className='relative w-full h-full'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='w-5 h-5 absolute top-1/2 -translate-y-1/2 left-5'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                                            />
                                        </svg>

                                        <input
                                            className='pl-14 py-4 w-full rounded-lg bg-[#ffffff11] text-sm font-bold'
                                            type='text'
                                            placeholder='Search'
                                            onChange={(event) => debouncedSearchTerm(event.target.value)}
                                        />
                                    </div>
                                    <For
                                        each={filesArray.filter((file) =>
                                            file.name.toLowerCase().includes(searchTerm.toLowerCase()),
                                        )}
                                        memo
                                    >
                                        {(file) => <FileObjectRow key={file.key} file={file} />}
                                    </For>
                                </div>
                            </div>
                            <MassActionsBar />
                        </>
                    )}
                </>
            )}
        </ServerContentBlock>
    );
};
