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
    const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
    const mes = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
}

function formatDateWithCheck(data) {
    if (data && data !== '1969-12-31T00:00:00.000Z') {
        return formatDate(data);
    } else {
        return 'Pendente';
    }
}

async function sendDeliveryConfirmationEmail(recipientEmail, id, username, itemName, requester, deliveryDate) {
    try {
        const mailBody = `
            Prezados,
            
            O equipamento: ${itemName} foi entregue com sucesso pelo usuário ${requester} na data ${formatDate(deliveryDate)}.

            Identificação da Solicitação: #${id}

            Técnico responsável pela finalização: ${username}
            
            Atenciosamente,

            Kian Inventário`

        const mailOptions = {
            from: 'iluminacaokian@gmail.com',
            to: recipientEmail,
            subject: 'Kian Inventário - Confirmação de Entrega',
            text: mailBody
        };

        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw error
    }
}

async function checkAndSendEmail() {
    const currentDate = new Date();

    try {
        const [rows, fields] = await database.pool.query('SELECT * FROM kian_emprestimos WHERE previsao_entrega <= ?', [currentDate])
       
        for (const row of rows) {
            const recipientEmail = 'raphael.sousa@kian.com.br'
            const dateFromDatabase = new Date(row.previsao_entrega)

            const differenceInMilliseconds = dateFromDatabase - currentDate

            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))

            if (differenceInDays <= 1) {
                const mailBody = `
                Prezados,
                    
                Este é um lembrete de que a seguinte entrega está prevista para o dia ${formatDate(row.previsao_entrega)}:
                    - Identificação da Solicitação: #${row.id}
                    - Solicitante: ${row.solicitante}
                    - Data de Saída do Setor: ${formatDate(row.saida_setor)}
                    - Equipamento: ${row.equipamento}
                    - Código de Identificação: ${row.codigo_identificacao}

                Atenciosamente,
                
                Kian Inventário
                `;

                const mailOptions = {
                    from: 'iluminacaokian@gmail.com',
                    to: recipientEmail,
                    subject: 'Kian Inventário - Está chegando a data de recuperarmos nosso equipamento',
                    text: mailBody
                };

                await transporter.sendMail(mailOptions)
            }
        }

    } catch (error) {
        console.error('Erro ao executar a consulta:', error)
    }
}

module.exports = { checkAndSendEmail, sendDeliveryConfirmationEmail, formatDateWithCheck, formatDate }