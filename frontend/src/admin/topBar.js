import { Link, useNavigate } from "react-router-dom";
import search from '../icons/search.png';
import home from '../icons/home.png';
import notifications from '../icons/notification.png';
import settings from '../icons/settings.png';

export default function TopBar() {

    const navigate = useNavigate();

    return (
        <div className="w-full md:text-xs">
            <div className="h-12 flex w-[95%] m-auto">
                <div className="grow" />
                <ul className="p-2 flex gap-4">
                    <NavBarListItem img={search} />
                    <NavBarListItem img={home} />
                    <NavBarListItem img={notifications} />
                    <NavBarListItem img={settings} />
                </ul>
            </div>
            <div className="w-11/12 m-auto">
                <h3 style={{
                    background: 'linear-gradient(#0080B7, #11C8A7)',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent'
                }} 
                    className="text-4xl font-semibold mt-"  
                >
                    comptes
                </h3>
                <div className="inline-block align-middle">
                    <p 
                        className="inline-block align-middle mt-4 mb-4"
                    >
                        37 comptes existant
                    </p>
                </div>
                <button style={{background: 'linear-gradient(#0080B7, #11C8A7)'}} 
                    className="p-2 text-white rounded float-right"
                    onClick={() => navigate('create-account')}
                >
                    Ajouter un compte
                </button>
            </div>
        </div>
    )
}

function NavBarListItem({img,to}) {
    return (
        <li className="h-6 bg-white aspect-square">
            <Link to={to || ''}>
                <img src={img} alt="" />
            </Link>
        </li>
    );
}