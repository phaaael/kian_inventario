const nodemailer = require('nodemailer')
const database = require('./database')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'iluminacaokian@gmail.com',
        pass: 'vgps snsg tvjv alit'
    }
})

function formatDate(data) {
    if (!(data instanceof Date)) {
        data = new Date(data)
    }

    if (isNaN(data.getTime())) {
        return 'Data inválida'
    }

    const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
    const mes = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}


function formatDateForUpdate(input) {
    if (!input) return null
    
    if (input instanceof Date) return input
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return new Date(input)
    }

    const parts = input.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1
        const year = parseInt(parts[2], 10)
        return new Date(year, month, day)
    }

    return null
}

function formatDateWithCheck(data) {
    if (data && data !== '1969-12-31T00:00:00.000Z') {
        return formatDate(data)
    } else {
        return 'Pendente'
    }
}

async function requestRefused(recipientEmail, requester, reason) {
    try {
        const mailBody = `
        Prezado(a), ${requester} !
        
        Sua solicitação foi Recusada.

        Motivo: ${reason}

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Recusada',
            text: mailBody
        }

        await transporter.sendMail(mailOptions)
    } catch {
        throw error
    }
}

async function requestApproved(recipientEmail, requester) {
    try {
        const mailBody = `
        Prezado(a), ${requester} !
        
        Sua solicitação foi aprovada. Nossa equipe está prosseguindo com o processo e em breve entrará em contato com você.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Aprovada',
            text: mailBody
        }

        await transporter.sendMail(mailOptions)
    } catch {
        throw error
    }
}

async function requestConfirmation(recipientEmail, id, requester) {
    try {
        const mailBody = `
        Prezado(a), ${requester} !
        
        Recebemos sua solicitação, e ela será analisada por nossa equipe.

        Identificação da Solicitação: #${id}.

        Atenciosamente,

        Equipe de Inventário Kian`

        const mailOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            // cc: '',
            subject: 'Kian Inventário - Solicitação Registrada',
            text: mailBody
        }

        await transporter.sendMail(mailOptions)
    } catch {
        throw error
    }
}

async function sendDeliveryConfirmationEmail(recipientEmail, id, username, itemName, requester, deliveryDate) {
    try {
        const mailBody = `
            Prezados,

            Informamos que o equipamento ${itemName} foi entregue com sucesso pelo usuário ${requester} na data ${formatDate(deliveryDate)}.
            
            Identificação da Solicitação: #${id}.
            
            Técnico responsável pela finalização: ${username}.
            
            Atenciosamente,
            
            Equipe de Inventário Kian`

        const mailOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            subject: 'Kian Inventário - Confirmação de Entrega',
            text: mailBody
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw error
    }
}

async function checkAndSendEmail() {
    const currentDate = new Date()

    try {
        const [rows, fields] = await database.pool.query('SELECT * FROM kian_emprestimos WHERE previsao_entrega <= ?', [currentDate])
       
        for (const row of rows) {
            const recipientEmail = 'raphael.sousa@kian.com.br'
            const dateFromDatabase = new Date(row.previsao_entrega)

            const differenceInMilliseconds = dateFromDatabase - currentDate

            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))

            if (differenceInDays === 1) {
                const mailBody = `
                Prezados,
                    
                Este é um lembrete de que a seguinte entrega está prevista para amanhã (${formatDate(row.previsao_entrega)}):
                    - Identificação da Solicitação: #${row.id}
                    - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                    - Solicitante: ${row.solicitante}
                    - Data de Saída do Setor: ${formatDate(row.saida_setor)}
                    - Equipamento: ${row.equipamento}
                    - Código de Identificação: ${row.codigo_identificacao}

                Atenciosamente,
                
                Kian Inventário
                `

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
                    
                Este é um lembrete de que a seguinte entrega está prevista para hoje (${formatDate(row.previsao_entrega)}):
                    - Identificação da Solicitação: #${row.id}
                    - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                    - Solicitante: ${row.solicitante}
                    - Data de Saída do Setor: ${formatDate(row.saida_setor)}
                    - Equipamento: ${row.equipamento}
                    - Código de Identificação: ${row.codigo_identificacao}

                Atenciosamente,
                
                Kian Inventário
                `

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
                    
                Este é um lembrete de que a seguinte entrega está atrasada (${formatDate(row.previsao_entrega)}):
                    - Identificação da Solicitação: #${row.id}
                    - Responsável pelo Empréstimo: ${row.responsavel_emprestimo}
                    - Solicitante: ${row.solicitante}
                    - Data de Saída do Setor: ${formatDate(row.saida_setor)}
                    - Equipamento: ${row.equipamento}
                    - Código de Identificação: ${row.codigo_identificacao}

                Atenciosamente,
                
                Kian Inventário
                `

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
    requestConfirmation,
    requestApproved,
    requestRefused,
    formatDateWithCheck,
    formatDateForUpdate, 
    formatDate
}