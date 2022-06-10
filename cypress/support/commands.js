// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/* Funções customizadas do cypress, isso torna a função nativa, deixando-a customisável e pode ser usada em todo o 
código apenas chamando ela. E com isso vc economiza linhas de códigos nos testes, bem como deixa mais organizado. 
Geralmente é utilizando esse comando em funções que são usadas repetidamente no código. Ele deve está presente 
dentro da pasta support/commands.js */

 //POST - realizando a autenticação do usuário na api para pegar o token e enviar na requisição de cadastro.
Cypress.Commands.add('setToken', () => {

   
    cy.api({ //após a importação do plugin @bahmutov/cy-api foi trocado o comando cy.request por cy.api
        method: 'POST',
        url: '/sessions',
        body: {
            email: 'gerlan.ferreira@qacademy.io',
            password: 'qa-cademy-G3rl@N'
        }
    }).then( (response) => {
        expect(response.status).to.eql(200)
        //cy.log('TOKEN: ' + response.body.token) //cy.log é o log do cypress. Que foi comentado após instalar o plugin @bahmutov/cy-api
        Cypress.env('token', response.body.token) //Variável de ambiente do Cypress para armazenar o token
    })
})

//DELETE - request para deletar os dados dos personagens criados após o teste, e garantir que o ambiente de teste estará limpo após rodar os testes. 
Cypress.Commands.add('deletarPersonagens', () => {
    
    cy.api({ //após a importação do plugin @bahmutov/cy-api foi trocado o comando cy.request por cy.api
        method: 'DELETE',
        url: '/back2thepast/629e159562354f001624edd5',

    }).then((response) => {

        expect(response.status).to.eql(200)
        //cy.log('Ambiente limpado com sucesso!') comentado após instalar o plugin @bahmutov/cy-api

    })

})

 //POST - requisição para testar o cadastro do personagem
Cypress.Commands.add('postCharacter', (payload) => {
   
    cy.api({ //após a importação do plugin @bahmutov/cy-api foi trocado o comando cy.request por cy.api
        method: 'POST',
        url: '/characters',
        body: payload,
        headers: {
            Authorization: Cypress.env('token')
        },
        //esse parâmetro é passado após o header por que por padrão o cypress espera status codes da faixa 200 ou 300. 
        //Dessa forma se faz necessário passar ele para que a gente possa controlar os status codes e não o cypress.        
        failOnStatusCode: false
    }).then((response) => {
        return response
    })

})
