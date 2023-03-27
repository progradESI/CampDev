const Utilisateur = require('./models/utilisateur');
const Role = require('./models/role');
const Permission = require('./models/permission');
const Compte = require('./models/compte');
const MembreDeProjet = require('./models/membreDeProjet');
const CompteRole = require('./models/CompteRole');
const RolePermission = require('./models/RolePermission');
const Projet = require('./models/projet');
const ProjetParams = require('./models/projetParams');
const Encadrement = require('./models/encadrement');


Compte.roles = Compte.belongsToMany(Role, {
    through: CompteRole,
    foreignKeyConstraint: true,
    foreignKey: 'idCompte',
    as: 'roles',
});

Role.comptes = Role.belongsToMany(Compte, {
    through: CompteRole,
    foreignKeyConstraint: true,
    foreignKey: 'idRole',
    as: 'comptes',
});

Role.permissions = Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKeyConstraint: true,
    foreignKey: 'idRole',
    as: 'permissions',
});

Permission.roles = Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKeyConstraint: true,
    foreignKey: 'idPermission',
    as: 'roles',
});

Compte.utilisateur = Compte.hasOne(Utilisateur, {
    as: 'utilisateur',
    foreignKey: 'idCompte',
    foreignKeyConstraint: true,
});

Utilisateur.compte = Utilisateur.belongsTo(Compte, {
    as: 'compte',
    foreignKey: 'idCompte',
    foreignKeyConstraint: true,
});

Compte.etudiant = Compte.hasOne(MembreDeProjet, {
    as: 'etudiant',
    foreignKey: 'idCompte',
    foreignKeyConstraint: true,
});

MembreDeProjet.compte = MembreDeProjet.belongsTo(Compte, {
    as: 'compte',
    foreignKey: 'idCompte',
    foreignKeyConstraint: true,
});

/* sprint 2 */

Projet.chef = Projet.belongsTo(MembreDeProjet, {
    as:'chef',
    foreignKey:'idChef',
    foreignKeyConstraint:true
});

Projet.membres = Projet.hasMany(MembreDeProjet, {
    as:'membre',
    foreignKey:'idProjet',
    foreignKeyConstraint:true
});

MembreDeProjet.projet = MembreDeProjet.belongsTo(Projet, {
    as:'projet',
    foreignKey:'idProjet',
    foreignKeyConstraint:true
});

ProjetParams.projets = ProjetParams.hasMany(Projet, {
    as:'projects',
    foreignKey: 'anne',
    foreignKeyConstraint:true
});

Projet.projectParams = ProjetParams.belongsTo(ProjetParams, {
    as:'params',
    foreignKey: 'anne',
    foreignKeyConstraint:true
});

Projet.encadreurs = Projet.belongsToMany(Utilisateur, {
    as:'encadreurs',
    foreignKey:'idProjet',
    foreignKeyConstraint:true,
    through: Encadrement
});

Utilisateur.projetsEncadrées = Utilisateur.belongsToMany(Projet, {
    as:'encadreurs',
    foreignKey:'idEncadreur',
    foreignKeyConstraint:true,
    through: Encadrement
});