//setando para o mode de desenvolvimento
const env = process.env.NODE_ENV || 'dev';
//NODE_ENV determina produção/desenvolvimento, env recebe valor configurado no node_env

const config = () => {
    switch (env) {
        //dev desenvolvimento
        case 'dev' :
            return {
                dbString : 'mongodb+srv://matheus:090401@cluster0.h8kve.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
            //hml homologação
        case 'hml' :
            return {
                dbString : 'mongodb+srv://matheus:090401@cluster0.h8kve.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
            //prod produção
        case 'prod' :
            return {
                dbString : 'mongodb+srv://matheus:090401@cluster0.h8kve.mongodb.net/deliverydb?retryWrites=true&w=majority',
                jwtPass : 'starwarsémelhorquestartrek',
                jwtExpires : '1d'
            }
    }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();