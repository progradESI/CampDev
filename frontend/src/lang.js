const strings = {
    'full-name' : {
        'fr': 'nom et prénom',
        'en': 'full name'
    },
    'inactive': {
        'fr': 'dèsactivé',
        'en': 'inactive'
    }
};

let lang;

module.exports = {
    init: (_lang) => {
        lang = _lang;
    },
    get: (key) => {
        return strings[key][lang];
    }
}