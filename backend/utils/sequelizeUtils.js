const { Op } = require("sequelize");
const Projet = require("../models/projet");

function projetFilter(query) {

    const attributes = Object.keys(Projet.getAttributes());

    let ordering = undefined;
    let where = {};

    if(query.ordering) {
        ordering = query.ordering.split(',').map(e => e.split('.'))
            .filter(e => attributes.includes(e[0]) 
                && ['ASC','DESC'].includes(e[1].toUpperCase())
            )
    }

    for(let op in Op) {
        attributes.forEach(att => {
            if(query[op+'_'+att]) {
                if(where[att]) {
                    where[att][Op[op]] = query[op+'_'+att]; 
                } else {
                    where[att] = {
                        [Op[op]] : query[op+'_'+att]
                    }
                }
            }
        });
    }

    return {ordering,where};
}

module.exports = {
    projetFilter
};