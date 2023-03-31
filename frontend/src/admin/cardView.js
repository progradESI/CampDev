import lang from '../lang';
import account from '../icons/account.png';
import dropdownArrow from '../icons/downward-arrow.png';
import { useState } from 'react';
import settings from '../icons/settings.png';

export default function CardView({
    idCompte,
    nom,
    prénom,
    email,
    roles,
    estActive,
    photo
}) {
    return(
        <div className='md:w-full md:border md:border-black md:rounded md:mb-2 md:text-xs md:p-1 relative table-row w-full md:flow-root gap-1'>
            <div className='hidden md:inline-block w-3/12 rounded-full float-left md:mr-2'>
                <img 
                    className='w-full rounded-full'
                    src={photo || account} 
                    alt='' 
                />
            </div>
            <div className='table-cell md:hidden underline w-max align-middle border-t border-b border-l rounded-l border-black'>
                <div className='m-auto text-center'>
                    {idCompte}
                </div>
            </div>
            <div className='pt-1 pb-1 table-cell md:block md:mb-1 border-t border-b border-black md:border-0'>
                <div className='flex gap-2 items-center'>
                    <img className='w-12 aspect-square rounded-full md:hidden' 
                        src={photo || account} alt='' 
                    />
                    <div>
                        <span className='hidden md:inline'>nom et prénom : </span>
                        {nom+' '+prénom}
                    </div>
                </div>
            </div>
            <p className='table-cell align-middle md:block md:mb-1 border-t border-b border-black md:border-0'>
                <span className='hidden md:inline'>email : </span>
                {email}
            </p>
            <RolesTableData roles={roles} />
            {estActive?
                <p className='border-t border-b border-black md:border-0 md:mb-1 text-center text-green-400 table-cell align-middle md:block md:text-left'>
                    <span className="text-black hidden md:inline" >status : </span>activé
                </p>:
                <p className='border-t border-b border-black md:border-0 md:mb-1 text-center text-red-500 table-cell align-middle md:block md:text-left'>
                    <span className="text-black hidden md:inline" >status : </span>désctivé
                </p>
            }
            <div className='whitespace-normal hidden md:block'>
                {roles.map(role => (
                    <span className='inline-block mb-1 p-2 bg-green-200 rounded-full mr-2' >
                        {role.toLowerCase()}
                    </span>
                ))}
            </div>
            <td className='md:hidden w-10 border-t border-b border-r border-black rounded-r align-middle'>
                <img className='w-5 aspect-square' src={settings} />
            </td>
        </div>
    )
}

function RolesTableData({ roles }) {

    const [index,setIndex] = useState(0);

    return(
        <td className='border-solid 
            border-t border-b border-black align-middle	md:hidden'
        >
            <div className='flex justify-center'>
                <div className='relative w-max'>
                    <div className='flex items-center'>
                        <p className='inline-block'>{roles.at(index).toLowerCase()}</p>
                        <button 
                            onClick={() => setIndex((index+1)%roles.length)}
                        >
                            <img className='w-5 p-1' src={dropdownArrow} alt='' />
                        </button>
                    </div>
                </div>
            </div>
        </td>
    )
}
