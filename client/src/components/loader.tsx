import React from 'react';

function Loader() {
    return (
        <div className="relative flex justify-center items-center">
            <div
                className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary-500"></div>
            <img src="/images/logo.png" className="rounded-full h-28 w-28"/>
        </div>
    );
}

export default Loader;