const { validaCPF } = require('./validaCPF');

function validaEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validaTelefone(telefone) {
    const regex = /^\s*(?:\+?55\s?)?(?:\(?\d{2}\)?)[\s-]?\d{4,5}-?\d{4}\s*$/;
    return regex.test(telefone);
}

module.exports = {
    validaEmail,
    validaTelefone,
    validaCPF
};
