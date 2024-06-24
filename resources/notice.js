const nodemailer = require('nodemailer')
const database = require('./database')
const dateUtils = require('./dateUtils')

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'inventario@kian.com.br',
        //pass: 'Yav34246'
        pass: 'SENHA_INVALIDA'
    },
    tls: {
        ciphers: 'SSLv3'
    }
})

async function updateRecord(recipientEmail, requester, changesText, id, admin) {
    try {
        if (typeof changesText !== 'string') changesText = 'Não foi possível interpretar as alterações'

        const mailToUser = `Prezado(a) ${requester}, \n\nSua solicitação de equipamento foi atualizada com as seguintes alterações: \n\n${changesText} \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            subject: 'Kian Inventário - Solicitação Atualizada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação #${id} foi atualizada pelo técnico ${admin} com as seguintes alterações: \n\n${changesText} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }

        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch (error) {
        console.error('Erro ao enviar notificação:', error)
        throw error
    }
}

async function requestRefused(recipientEmail, requester, reason, id, admin) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nSua solicitação de equipamento foi recusada. \n\nTécnico responsável pela recusa: ${admin}. \n\nMotivo: "${reason}" \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Recusada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação de equipamento foi recusada pelo técnico ${admin}. \n\nIdentificação da Solicitação: #${id}. \n\nMotivo da Recusa: ${reason} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }


        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestApproved(recipientEmail, requester, id, admin) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nSua solicitação de equipamento foi aprovada. Nossa equipe está prosseguindo com o processo e em breve entrará em contato com você. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Aprovada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação de equipamento foi aprovada pelo técnico ${admin}. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }

        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestConfirmation(recipientEmail, id, requester) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nRecebemos sua solicitação de equipamento, e ela será analisada por nossa equipe. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nRecebemos uma nova solicitação de empréstimo. Identificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Recebida',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Registrada',
            text: mailToAdmin
        }


        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function sendDeliveryConfirmationEmail(recipientEmail, id, username, itemName, requester, deliveryDate, hostname) {
    try {
        const mailToUser = `Prezado(a) ${requester}, \n\nInformamos que o equipamento foi entregue com sucesso na data ${dateUtils.formatDate(deliveryDate)}. \n\nIdentificação do Empréstimo: #${id}. \n\nTécnico responsável pela finalização: ${username}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nInformamos que o equipamento ${itemName}, identificação "${hostname}" foi entregue com sucesso pelo usuário ${requester} na data ${dateUtils.formatDate(deliveryDate)}. \n\nIdentificação do Empréstimo: #${id}. \n\nTécnico responsável pela finalização: ${username}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            subject: 'Kian Inventário - Confirmação de Entrega',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Finalização de Empréstimo',
            text: mailToAdmin
        }

        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch (error) {
        throw error
    }
}

async function requestRefusedSupplement(recipientEmail, requester, reason, id, admin) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nSua solicitação de suprimento foi recusada. \n\nTécnico responsável pela recusa: ${admin}. \n\nMotivo: "${reason}" \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            subject: 'Kian Inventário - Solicitação Recusada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação de suprimento foi recusada pelo técnico ${admin}. \n\nIdentificação da Solicitação: #${id}. \n\nMotivo da Recusa: ${reason} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }


        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestApprovedSupplement(recipientEmail, requester, id, admin) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nSua solicitação de suprimento foi aprovada. Nossa equipe está prosseguindo com o processo e em breve entrará em contato com você. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Aprovada',
            text: mailToUser
        }

        const mailToAdmin = `Prezados, \n\nSolicitação de suprimento foi aprovada pelo técnico ${admin}. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Atualização de Solicitação',
            text: mailToAdmin
        }

        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function requestConfirmationSupplement(recipientEmail, id, requester) {
    try {
        const mailToUser = `Prezado(a), ${requester} ! \n\nRecebemos sua solicitação de suprimento, e ela será analisada por nossa equipe. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToAdmin = `Prezados, \n\nRecebemos uma nova solicitação de suprimento. \n\nIdentificação da Solicitação: #${id}. \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

        const mailToUserOptions = {
            from: 'inventario@kian.com.br',
            to: recipientEmail,
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Recebida',
            text: mailToUser
        }

        const mailToAdminOptions = {
            from: 'inventario@kian.com.br',
            to: 'ti@Kian.com.br',
            cc: 'servicedesk@kian.com.br',
            subject: 'Kian Inventário - Solicitação Registrada',
            text: mailToAdmin
        }


        // await transporter.sendMail(mailToUserOptions)
        // await transporter.sendMail(mailToAdminOptions)
    } catch {
        throw error
    }
}

async function checkAndSendEmail() {
    const currentDate = new Date()

    try {
        const [rows] = await database.pool.query('SELECT * FROM kian_emprestimos WHERE previsao_entrega <= ?', [currentDate])

        for (const row of rows) {
            if (row.dt_finalizacao === null || row.entregue === 0) {
                const recipientEmail = 'ti@kian.com.br'
                const dateFromDatabase = new Date(row.previsao_entrega)

                const differenceInMilliseconds = dateFromDatabase - currentDate
                const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))

                if (differenceInDays === 1) {
                    const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está prevista para amanhã (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Requerente: ${row.requerente} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

                    const mailOptions = {
                        from: 'inventario@kian.com.br',
                        to: recipientEmail,
                        subject: 'Kian Inventário - Está chegando a data de recuperarmos nosso equipamento',
                        text: mailBody
                    }

                    // // await transporter.sendMail(mailOptions)
                } else if (differenceInDays === 0) {
                    const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está prevista para hoje (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Requerente: ${row.requerente} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

                    const mailOptions = {
                        from: 'inventario@kian.com.br',
                        to: recipientEmail,
                        subject: 'Kian Inventário - A entrega está prevista para hoje',
                        text: mailBody
                    }

                    // // await transporter.sendMail(mailOptions)
                } else if (differenceInDays < 0 && !row.entregue) {
                    const mailBody = `Prezados, \n\nEste é um lembrete de que a seguinte entrega está atrasada (${dateUtils.formatDate(row.previsao_entrega)}): \n\n- Identificação da Solicitação: #${row.id} \n\n- Responsável pelo Empréstimo: ${row.responsavel_emprestimo} \n\n- Requerente: ${row.requerente} \n\n- Data da Requisição: ${dateUtils.formatDate(row.dt_req)} \n\n- Equipamento: ${row.equipamento} \n\n- Código de Identificação: ${row.codigo_identificacao} \n\nAtenciosamente, \n\nEquipe de Inventário Kian`

                    const mailOptions = {
                        from: 'inventario@kian.com.br',
                        to: recipientEmail,
                        subject: 'Kian Inventário - A entrega está atrasada',
                        text: mailBody
                    }

                    // // await transporter.sendMail(mailOptions)
                }
            }
        }
    } catch (error) {
        console.error('Erro ao executar a consulta:', error)
    }
}

async function checkStockAndSendEmail() {
    try {
        const [rows] = await database.pool.query('SELECT * FROM kian_suprimentos WHERE 1=1')

        const lowStockKyocera = rows.filter(item => item.qtd_item < item.qtd_critica && item.item === 'Toner Kyocera')
        const lowStockVersaLinkM = rows.filter(item => item.qtd_item < item.qtd_critica && item.item === 'Toner VersaLink - Magenta')
        const lowStockVersaLinkP = rows.filter(item => item.qtd_item < item.qtd_critica && item.item === 'Toner VersaLink - Preto')
        const lowStockVersaLinkA = rows.filter(item => item.qtd_item < item.qtd_critica && item.item === 'Toner VersaLink - Amarelo')
        const lowStockVersaLinkC = rows.filter(item => item.qtd_item < item.qtd_critica && item.item === 'Toner VersaLink - Ciano')

        if (lowStockKyocera.length > 0) {
            const mailBody = `Prezados, \n\nSolicito por gentileza 14 unidades de toner para impressora Kyocera M3655. \n\nSegue os números de series:\n\n- R4P9634105\n- R4P9633715\n- R4P9634108\n- R4P9633520\n- R4P9633527\n- R4P9639482\n- R4P9633517\n- R4P9639214\n- R4P9633947\n- R4P9633786\n- R4P9639219\n- R4P9633729\n- R4P9634113\n- R4P9633722 \n\nDesde já, agradeço !`

            const mailOptions = {
                from: 'inventario@kian.com.br',
                to: 'suprimentos@officetotal.com.br',
                cc: 'servicedesk@kian.com.br, ti@kian.com.br',
                subject: 'Solicitação de Suprimentos',
                text: mailBody
            }

            // // await transporter.sendMail(mailOptions)
        }

        if(lowStockVersaLinkM.length > 0) {
            const mailBody = `Prezados, \n\nSolicito por gentileza 1 unidade de toner para impressora VersaLink C7025. \n\nNúmero de serie: 7TX141779 \n\nCor: Magenta \n\nDesde já, agradeço !`

            const mailOptions = {
                from: 'inventario@kian.com.br',
                to: 'suprimentos@officetotal.com.br',
                cc: 'servicedesk@kian.com.br, ti@kian.com.br',
                subject: 'Solicitação de Suprimentos',
                text: mailBody
            }

            // // await transporter.sendMail(mailOptions)

            console.log(mailBody)
        }

        if(lowStockVersaLinkP.length > 0) {
            const mailBody = `Prezados, \n\nSolicito por gentileza 1 unidade de toner para impressora VersaLink C7025. \n\nNúmero de serie: 7TX141779 \n\n Cor: Preta \n\nDesde já, agradeço !`

            const mailOptions = {
                from: 'inventario@kian.com.br',
                to: 'suprimentos@officetotal.com.br',
                cc: 'servicedesk@kian.com.br, ti@kian.com.br',
                subject: 'Solicitação de Suprimentos',
                text: mailBody
            }

            // // await transporter.sendMail(mailOptions)
        }

        if(lowStockVersaLinkA.length > 0) {
            const mailBody = `Prezados, \n\nSolicito por gentileza 1 unidade de toner para impressora VersaLink C7025. \n\nNúmero de serie: 7TX141779 \n\n Cor: Amarelo \n\nDesde já, agradeço !`

            const mailOptions = {
                from: 'inventario@kian.com.br',
                to: 'suprimentos@officetotal.com.br',
                cc: 'servicedesk@kian.com.br, ti@kian.com.br',
                subject: 'Solicitação de Suprimentos',
                text: mailBody
            }

            // await transporter.sendMail(mailOptions)
        }

        if(lowStockVersaLinkC.length > 0) {
            const mailBody = `Prezados, \n\nSolicito por gentileza 1 unidade de toner para impressora VersaLink C7025. \n\nNúmero de serie: 7TX141779 \n\n Cor: Ciano \n\nDesde já, agradeço !`

            const mailOptions = {
                from: 'inventario@kian.com.br',
                to: 'suprimentos@officetotal.com.br',
                cc: 'servicedesk@kian.com.br, ti@kian.com.br',
                subject: 'Solicitação de Suprimentos',
                text: mailBody
            }

            // // await transporter.sendMail(mailOptions)
        }

    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
    }
}

module.exports = { 
    checkAndSendEmail,
    checkStockAndSendEmail,
    updateRecord,
    sendDeliveryConfirmationEmail,
    requestApprovedSupplement,
    requestConfirmationSupplement,
    requestRefusedSupplement,
    requestConfirmation,
    requestApproved,
    requestRefused
}