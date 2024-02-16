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

async function checkAndSendEmail() {
    const currentDate = new Date();

    try {
        const [rows, fields] = await database.pool.query('SELECT * FROM kian_ativos WHERE previsao_entrega <= ?', [currentDate])
       
        for (const row of rows) {
            const recipientEmail = 'raphael.sousa@kian.com.br'
            const dateFromDatabase = new Date(row.previsao_entrega)

            const differenceInMilliseconds = dateFromDatabase - currentDate

            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))

            if (differenceInDays <= 1) {
                const mailBody = `
                Prezado(a),

                    
                Este é um lembrete de que a seguinte entrega está prevista para o dia ${formatDate(row.previsao_entrega)}:
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
                    subject: 'Kian Inventario - Está chegando a data de recuperarmos nosso equipamento',
                    text: mailBody
                };

                await transporter.sendMail(mailOptions)
                console.log(`E-mail enviado para ${recipientEmail}`)
            }
        }

    } catch (error) {
        console.error('Erro ao executar a consulta:', error)
    }
}

module.exports = { checkAndSendEmail, formatDate }