const users = [
    {
        matricule:'202037033337',
        nom:'Fellah',
        prénom:'Abdelnour',
        dateDeNaissance:'2003-04-06',
        lieuDeNaissance:'sidi lakhdar,mostaganem',
        niveau:3,
        sexe:'M',
        etablissement:'Ecole Superieiure en informatique 08 Mai 1945',
        departement:'',
        motDePasse:'CeSGJhQe'
    }
];

module.exports = (matricule,motDePasse) => {

    const user = users.filter(u => u.matricule === matricule).at(0);

    if(!user) {
        return {
            error: 'user not found',
            data:null
        };
    }

    if(user.motDePasse !== motDePasse) {
        return {
            error: 'wrong password',
            data:null
        };
    }

    return {
        error: null,
        data:user
    };

};