import { signIn } from 'next-auth/react';
import React from 'react'

export const Header = () => {
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 px-8" aria-label="Global">
                <div className="flex flex-1 justify-end">
                    <a className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer" onClick={() => { void signIn(); }}>Log in</a>
                </div>
            </nav>
        </header>
    )
}
