describe('POST /characters', () => {

    /* Função usada antes de implementar os comandos customizáveis do cypress (support/commands.js)
    before(function(){

        //realizando a autenticação do usuário na api para pegar o token e enviar na requisição de cadastro.
        cy.request({
            method: 'POST',
            url: '/sessions',
            body: {
                email: 'gerlan.ferreira@qacademy.io',
                password: 'qa-cademy-G3rl@N'
            }
        }).then(function(response){
            expect(response.status).to.eql(200)
            cy.log('TOKEN: ' + response.body.token) //cy.log é o log do cypress. Apenas para um teste.
            Cypress.env('token', response.body.token) //Variável de ambiente do Cypress para armazenar o token
        })

        //request para deletar os dados dos personagens criados após o teste, e garantir que o ambiente de teste estará limpo após rodar os testes.
        cy.request({
            method: 'DELETE',
            url: '/back2thepast/629e159562354f001624edd5',

        }).then(function(response){
            expect(response.status).to.eql(200)
            cy.log('Ambiente limpado com sucesso!')
        })
    })
    */

    /* O cypress em si é bom para testar api, porém ele tem algunas limitações, como por exemplo para capturar
    os dados do response, sempre vou ter que usar o cy.log(). Dessa forma pode ser instalado um plugin para que 
    os testes de api com o cypress, sejam muito melhores em termos de agilidade, performance e facilidade de se 
    trabalhar, bem como gerar relatórios dos testes no próprio browser. Esse plugin é instaldo com o comando: 
                                    npm install @bahmutov/cy-api --save-dev 
    Após instalado deve ser importado no arquivo index.js que fica dentro da pasta de support para que esse plugin possa
    ser utilizado.*/

    before(() => {

        //realizando a autenticação do usuário na api para pegar o token e enviar na requisição de cadastro.
        cy.setToken()

        //deletar os dados dos personagens criados após o teste
        cy.deletarPersonagens()

    })

    //teste para enviar a requisição e cadastrar um novo personagem.
    it('deve cadastrar um personagem', () => {

        //dados do personagem
        const character = {
            name: 'Kitty Pryde',
            alias: 'Lince Negra',
            team: ['x-men'],
            active: true
        }

        //requisição para cadastro do personagem
        cy.postCharacter(character)
            .then((response) => {
                expect(response.status).to.eql(201)
                expect(response.body.character_id.length).to.eql(24) //checando se o ID do personagem que foi cadastrado é igual a 24 caracteres, é o tamanho padrão do ID dos bancos mongoDB.
            })
    })

    //o context.only é utilizado para quando se quer rodar exclusivamente esse contexto, e mais nenhum outro
    context('quando o personagem já existe', () => {

        const character = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: [
                'vingadores da costa oeste',
                'irmandade mutante'
            ],
            active: true
        }

        before(() => {
            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(201)
                })

        })
        it('não deve cadastrar personagem duplicado', () => {
            cy.postCharacter(character)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.error).to.eql('Duplicate character')
                })

        })

    })

    context('validar campos obrigatórios no cadastro de personagens', () => {

        const characterNameIsEmpty = {
            name: '',
            alias: 'Mercurio',
            team: [
                'vingadores da costa oeste',
                'irmandade mutante'
            ],
            active: true
        }

        it('valida obrigatoriedade do Name', () => {
            cy.postCharacter(characterNameIsEmpty)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql('\"name\" is not allowed to be empty')
                })

        })

        const characterAliasIsEmpty = {
            name: 'Pietro Maximoff',
            alias: '',
            team: [
                'vingadores da costa oeste',
                'irmandade mutante'
            ],
            active: true
        }

        it('valida obrigatoriedade do Alias', () => {
            cy.postCharacter(characterAliasIsEmpty)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql('\"alias\" is not allowed to be empty')
                })

        })

        const characterTeamIsEmpty = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: [''],
            active: true
        }

        it('valida obrigatoriedade do Team', () => {
            cy.postCharacter(characterTeamIsEmpty)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql('\"team[0]\" is not allowed to be empty')
                })

        })
        const characterActiveIsEmpty = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: ['vingadores da costa oeste', 'irmandade mutante'],
            active: ''
        }

        it('valida obrigatoriedade do Active', () => {
            cy.postCharacter(characterActiveIsEmpty)
                .then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql('"active\" must be a boolean')
                })

        })

    })

})