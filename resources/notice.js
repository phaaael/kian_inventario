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

async function updateRecord(recipientEmail, requester, changesText, id, admin) {
    try {
        if (typeof changesText !== 'string') changesText = 'Não foi possível interpretar as alterações'

        const mailToUser = `Prezado(a) ${requester}, \n\nSua solicitação de equipamento foi atualizada com as seguintes alterações: \n\n${changesText} \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            subject: 'Kian Inventário - Solicitação Atualizada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação #${id} foi atualizada pelo técnico ${admin} com as seguintes alterações: \n\n${changesText} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'iluminacaokian@gmail.com',
            to: 'raphael.sousa@kian.com.br', // ti@Kian.com.br
            // cc: '',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }

        await transporter.sendMail(mailToUserOptions)
        await transporter.sendMail(mailToAdminOptions)
    } catch (error) {
        console.error('Erro ao enviar notificação:', error)
        throw error
    }
}

async function requestRefused(recipientEmail, requester, reason, id, admin) {
    try {
        const mailToUser = `
        Prezado(a), ${requester} ! \n\nSua solicitação foi recusada. \n\nTécnico responsável pela recusa: ${admin}. \n\nMotivo: "${reason}" \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Recusada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação #${id} foi recusada pelo técnico ${admin}. \n\nMotivo da Recusa: ${reason} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
        const mailToUser = `Prezado(a), ${requester} ! \n\nSua solicitação foi aprovada. Nossa equipe está prosseguindo com o processo e em breve entrará em contato com você. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Aprovada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação #${id} foi aprovada pelo técnico ${admin}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
        const mailToUser = `Prezado(a), ${requester} ! \n\nRecebemos sua solicitação, e ela será analisada por nossa equipe. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nRecebemos uma nova solicitação de empréstimo. Identificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
        const mailToUser = `Prezado(a), ${requester} ! \n\nRecebemos sua solicitação, e ela será analisada por nossa equipe. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nRecebemos uma nova solicitação de suprimento. Identificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
        const mailToUser = `Prezado(a) ${requester}, \n\nInformamos que o equipamento "${itemName}" foi entregue com sucesso na data ${dateUtils.formatDate(deliveryDate)}. \n\nIdentificação do Empréstimo: #${id}. \n\nTécnico responsável pela finalização: ${username}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nInformamos que o equipamento "${itemName}" foi entregue com sucesso pelo usuário ${requester} na data ${dateUtils.formatDate(deliveryDate)}. \n\nIdentificação do Empréstimo: #${id}. \n\nTécnico responsável pela finalização: ${username}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
                const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está prevista para amanhã (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Solicitante: ${row.solicitante} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - Está chegando a data de recuperarmos nosso equipamento',
                    text: mailBody
                }

                await transporter.sendMail(mailOptions)
            } else if (differenceInDays === 0) {
                const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está prevista para hoje (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Solicitante: ${row.solicitante} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - A entrega está prevista para hoje',
                    text: mailBody
                }

                await transporter.sendMail(mailOptions)
            } else if (differenceInDays < 0 && !row.entregue) {
                const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está atrasada (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Solicitante: ${row.solicitante} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

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
    updateRecord,
    sendDeliveryConfirmationEmail,
    requestConfirmationSupplement,
    requestConfirmation,
    requestApproved,
    requestRefused
}