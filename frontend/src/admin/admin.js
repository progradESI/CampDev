import '../App.css';
import TopBar from './topBar';
import MySideBar from './sideBar';
import Accounts from './accounts';
import { useState } from 'react';

export default function Admin() {

    const [isSideBarOpen,setIsSideBarOpen] = useState(false);

    return (
        <main className='flex flex-row'>
            <MySideBar 
                onOpen={() => setIsSideBarOpen(true)} 
                onClose={() => setIsSideBarOpen(false)}
            />
            <section className='w-11/12 absolute right-0 h-[100vh] md:w-full'>
                <TopBar />
                <Accounts />
            </section>
            {isSideBarOpen && <div 
                    className='absolute inset-0 w-[100vw]
                    h-[100vh] bg-black opacity-[20%]'
                    
            />}
        </main>
    );
}