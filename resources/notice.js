const nodemailer = require('nodemailer')
const database = require('./database')
const dateUtils = require('./dateUtils')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'iluminacaokian@gmail.com',
        pass: 'vgps snsg tvjv alit'
    }
})

async function requestRefused(recipientEmail, requester, reason, id, admin) {
    try {
        const mailToUser = `
        Prezado(a), ${requester} !
        
        Sua solicitação foi Recusada.

        Motivo: ${reason}

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Recusada',
            text: mailToUser
        }

        const mailToAdmin = `
        Prezados,
        
        Solicitação #${id} foi recusada pelo técnico ${admin}.

        Motivo da Recusa: ${reason}

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: 'raphael.sousa@kian.com.br', // ti@kian.com.br
            // cc: '',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }


        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestApproved(recipientEmail, requester, id, admin) {
    try {
        const mailToUser = `
        Prezado(a), ${requester} !
        
        Sua solicitação foi aprovada. Nossa equipe está prosseguindo com o processo e em breve entrará em contato com você.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Aprovada',
            text: mailToUser
        }

        const mailToAdmin = `
        Prezados,
        
        Solicitação #${id} foi aprovada pelo técnico ${admin}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: 'raphael.sousa@kian.com.br', // ti@kian.com.br
            // cc: '',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }

        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestConfirmation(recipientEmail, id, requester) {
    try {
        const mailToUser = `
        Prezado(a), ${requester} !
        
        Recebemos sua solicitação, e ela será analisada por nossa equipe.

        Identificação da Solicitação: #${id}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToAdmin = `
        Prezados,
        
        Recebemos uma nova solicitação de empréstimo. Identificação da Solicitação: #${id}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Recebida',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail, // ti@kian.com.br
            // cc: '',
            subject: 'Kian Inventário - Solicitação Registrada',
            text: mailToAdmin
        }


        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestConfirmationSupplement(recipientEmail, id, requester) {
    try {
        const mailToUser = `
        Prezado(a), ${requester} !
        
        Recebemos sua solicitação, e ela será analisada por nossa equipe.

        Identificação da Solicitação: #${id}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToAdmin = `
        Prezados,
        
        Recebemos uma nova solicitação de suprimento. Identificação da Solicitação: #${id}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Recebida',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail, // ti@kian.com.br
            // cc: '',
            subject: 'Kian Inventário - Solicitação Registrada',
            text: mailToAdmin
        }


        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function sendDeliveryConfirmationEmail(recipientEmail, id, username, itemName, requester, deliveryDate) {
    try {
        const mailToUser = `
        Prezados,

        Informamos que o equipamento ${itemName} foi entregue com sucesso pelo usuário ${requester} na data ${dateUtils.formatDate(deliveryDate)}.
            
        Identificação do Empréstimo: #${id}.
            
        Técnico responsável pela finalização: ${username}.
            
        Atenciosamente,
            
        Equipe de Inventário Kian`

        const mailToAdmin = `
        Prezados,

        Informamos que o equipamento ${itemName} foi entregue com sucesso pelo usuário ${requester} na data ${dateUtils.formatDate(deliveryDate)}.
            
        Identificação do Empréstimo: #${id}.
            
        Técnico responsável pela finalização: ${username}.
            
        Atenciosamente,
            
        Equipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            subject: 'Kian Inventário - Confirmação de Entrega',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail, // ti@kian.com.br
            subject: 'Kian Inventário - Finalização de Empréstimo',
            text: mailToAdmin
        }

        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch (error) {
        throw error
    }
}

async function checkAndSendEmail() {
    const currentDate = new Date()

    try {
        const [rows, fields] = await database.pool.query('SELECT * FROM kian_emprestimos WHERE previsao_entrega <= ?', [currentDate])
       
        for (const row of rows) {
            const recipientEmail = 'raphael.sousa@kian.com.br' // ti@kian.com.br
            const dateFromDatabase = new Date(row.previsao_entrega)

            const differenceInMilliseconds = dateFromDatabase - currentDate

            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))

            if (differenceInDays === 1) {
                const mailBody = `
        Prezados,
                    
            Este é um lembrete de que a seguinte entrega está prevista para amanhã (${dateUtils.formatDate(row.previsao_entrega)}):
                - Identificação da Solicitação: #${row.id}
                - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                - Solicitante: ${row.solicitante}
                - Data da Requisição: ${dateUtils.formatDate(row.dt_req)}
                - Equipamento: ${row.equipamento}
                - Código de Identificação: ${row.codigo_identificacao}

        Atenciosamente,
                
        Equipe de Inventário Kian`

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - Está chegando a data de recuperarmos nosso equipamento',
                    text: mailBody
                }

                await transporter.sendMail(mailOptions)
            } else if (differenceInDays === 0) {
                const mailBody = `
        Prezados,
                    
            Este é um lembrete de que a seguinte entrega está prevista para hoje (${dateUtils.formatDate(row.previsao_entrega)}):
                - Identificação da Solicitação: #${row.id}
                - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                - Solicitante: ${row.solicitante}
                - Data da Requisição: ${dateUtils.formatDate(row.dt_req)}
                - Equipamento: ${row.equipamento}
                - Código de Identificação: ${row.codigo_identificacao}

        Atenciosamente,
                
        Equipe de Inventário Kian`

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - A entrega está prevista para hoje',
                    text: mailBody
                }

                await transporter.sendMail(mailOptions)
            } else if (differenceInDays < 0 && !row.entregue) {
                const mailBody = `
        Prezados,
                    
            Este é um lembrete de que a seguinte entrega está atrasada (${dateUtils.formatDate(row.previsao_entrega)}):
                - Identificação da Solicitação: #${row.id}
                - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                - Solicitante: ${row.solicitante}
                - Data da Requisição: ${dateUtils.formatDate(row.dt_req)}
                - Equipamento: ${row.equipamento}
                - Código de Identificação: ${row.codigo_identificacao}

        Atenciosamente,
                
        Equipe de Inventário Kian`

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - A entrega está atrasada',
                    text: mailBody
                }

                await transporter.sendMail(mailOptions)
            }
        }

    } catch (error) {
        console.error('Erro ao executar a consulta:', error)
    }
}

module.exports = { 
    checkAndSendEmail, 
    sendDeliveryConfirmationEmail,
    requestConfirmationSupplement,
    requestConfirmation,
    requestApproved,
    requestRefused
}