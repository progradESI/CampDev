import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Admin from './admin/admin';
import CreateAccount from './admin/create-account';
import TimeLine from './components/timeline';
import CardView from './admin/cardView';
import lang from './lang';


import pic from './icons/account.png';
import { useEffect } from 'react';

const account = {
  idCompte:8784,
  nom:'fellah',
  prénom:'abdelnour',
  email:'ab.fellah@esi-sba.dz',
  roles:['encadreur','jury','comité','etudiant','incubateur'],
  estActive: false,
  photo:pic
}

function App() {

  const router = createBrowserRouter([
    {
      path:'/',
      element: <CardView {...account} />
    },
    {
      path: '/admin',
      element: <Admin />,
    },
    {
      path: '/admin/create-account',
      element: <CreateAccount />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
