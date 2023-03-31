import { useState } from 'react';
import logo1 from '../icons/logo-1.png';
import logo2 from '../icons/logo-2.png';
import logo from '../icons/logo.png';
import logout from '../icons/logout.png';

export default function MySideBar({onOpen, onClose}) {

    const [isOpen,setIsOpen] = useState(false);

    return (
        <div className="bg-[#2ED2D2] z-10 rounded-r-2xl w-1/12 
            hover:w-[20%] fixed hover:rounded-none h-[100vh]
            transition-width md:text-xs md:hidden "
            onMouseEnter={() => {
                onOpen()
                setIsOpen(true);
            }}
            onMouseLeave={() => {
                onClose()
                setIsOpen(false)
            }}
        >
            <ul className='m-auto flex flex-col h-full items-center mb-4'>
                <li className='w-11/12'>
                    <div className='flex items-center gap-2 justify-center' >
                        <div className='rounded-full p-2' >
                            <img className='w-14 aspect-square' src={logo} alt="" />
                        </div>
                    </div>
                </li>
                <SideBarListItem 
                    open={isOpen} 
                    icon={logo1} 
                    bgColor={'#D9D9D9'} 
                    content={'Comité Scientifique'} 
                />
                <SideBarListItem 
                    open={isOpen} 
                    icon={logo2} 
                    bgColor={'#D9D9D9'} 
                    content={'Incubateur'} 
                />
                <SideBarListItem 
                    open={isOpen} 
                    icon={logo1} 
                    bgColor={'#D9D9D9'} 
                    content={'Encadreur'} 
                />
                <SideBarListItem 
                    open={isOpen} 
                    icon={logo1} 
                    bgColor={'#D9D9D9'} 
                    content={'Membre de Jury'} 
                />
                <li className='w-11/12 mt-auto mb-4'>
                    <div className='flex items-center gap-2 justify-center' >
                        <div className='rounded-full p-2' >
                            <img className='items-end w-11 aspect-square' src={logout} alt="" />
                        </div>
                        {isOpen && <p className='w-[10ch]'></p>}
                    </div>
                </li>
            </ul>
        </div>
    );
}

function SideBarListItem({icon,bgColor,content,open}) {
    return (
        <li className='w-11/12'>
            <div className='flex items-center gap-2 justify-center mb-4' >
                <div className='md:hidden rounded-full p-2' 
                    style={{backgroundColor:bgColor}}>
                    <img className='w-11 aspect-square' src={icon} alt="" />
                </div>
                {open && content && <p className='grow max-w-[10ch] text-center text-white'>
                    {content}
                </p>}
            </div>
        </li>
    )
}