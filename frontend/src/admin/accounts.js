import '../App.css';
import { useEffect, useState } from 'react';
import left from '../icons/left-arrow.png';
import right from '../icons/right-arrow.png';
import account from '../icons/account.png';
import dropdownArrow from '../icons/downward-arrow.png';
import settings from '../icons/settings.png';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/v1';


const _accounts = Array(5).fill(1).map((n,i) => {
    return {
        idCompte:8784+i,
        nom:'fellah',
        prénom:'abdelnour',
        email:'ab.fellah@esi-sba.dz',
        roles:['encadreur','jury','comité'],
        estActive: !!(i%2),
        photo:account
    }
});

export default function Accounts() {

    const [accounts,setAccounts] = useState([]);
    const [offset,setOffset] = useState(0);

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/accounts?offset=${offset}&limit=5`)
            .then(res => {
                setAccounts(res.data.users)
            })
            .catch(err => console.log(err));
    },[offset]);

    return (
        <>
            <div className="w-11/12 m-auto">
                <Roles roles={['Tous les comptes','Etudiant','Encadrant',
                    'Incubateur','Jury','Service des stages']} whoIsActive={0} 
                />
                <table
                    style={{borderSpacing: '0 10px'}}
                    className='w-full mt-4 border-separate table-fixed' 
                >
                    <thead className='md:hidden bg-[#D2F8F5]'>
                        <tr>
                            <TableHeader 
                                name={'ID'} 
                                underline={true} 
                                isFirst={true} 
                            />
                            <TableHeader name={'nom'} />
                            <TableHeader name={'Adresse'} />
                            <TableHeader name={'Role'} />
                            <TableHeader name={'status'} />
                            <th className='w-10' />
                        </tr>
                    </thead>
                    <tbody>
                       {accounts.map(account => (
                          <Account {...account} />
                       ))}
                    </tbody>
                </table>
            </div>
            <Carousel 
                offset={offset%5}
                onNextClicked={() => setOffset(offset+5)}
                onPreviousClicked={()=>{setOffset(offset-5)}}
                onNumClicked={(num) => {setOffset(num*5)}}
            />
        </>
    )
}

export function Account({
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


function Roles({ roles,whoIsActive }) {

    const [active,setActive] = useState(whoIsActive);

    return (
        <div className="flex justify-between flex-nowrap
            md:overflow-scroll
        ">
            {roles.map((role,i) => (
                <button 
                    className={i !== active ? "flex-shrink-0 md:ml-6 text-gray-400" : "flex-shrink-0 md:ml-6 underline"}
                    onClick={() => setActive(i)}
                >
                    {role}
                </button>
            ))}
        </div>
    );
}

function TableHeader({name}) {

    return (
        <th className='text-center pt-3 pb-3 rounded-full'>
            <div className='flex justify-center items-center'>
                <p>{name}</p>
                <button>
                    <img className='w-5 p-1' src={dropdownArrow} alt='' />
                </button>
            </div>
        </th>
    );
}

function Carousel({offset,onNextClicked,onPreviousClicked,onNumClicked}) {
    return (
        <div className='m-auto flex w-32 md:hidden'>
            <button 
                className='w-5'
                onClick={onPreviousClicked}
            >
                <img src={left} alt='' />
            </button>
                {
                    Array(5).fill(1).map((num,i) => (
                        <button 
                            onClick={()=>{
                                onNumClicked(i);
                            }}
                            className={(i===(offset))?'p-1':'p-1 text-gray-400'}
                        >
                            {(offset%5)+i+1}
                        </button>
                    ))
                }
            <button 
                className='w-5'
                onClick={onNextClicked} 
            >
                <img src={right} alt='' />
            </button>
        </div>
    );
}