import React from 'react';

export function EmptyResult(props: { resourceName: string }) {
    const { resourceName } = props;
    return (
        <div className="flex bg-stone-50 py-16 w-full items-center justify-center">
            <h1 className="text-2xl font-bold text-subdued">
                No {resourceName} found
            </h1>
        </div>
    );
}

export default EmptyResult;