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

function formatDateForUpdateRecord(data) {
    if (!(data instanceof Date)) {
        data = new Date(data)
    }

    if (isNaN(data.getTime())) {
        return 'Data inválida'
    }

    data.setMinutes(data.getMinutes() + data.getTimezoneOffset())

    const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
    const mes = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}


function formatDateForInput(data) {
    if (!(data instanceof Date)) {
        let parts = data.split('-')
        if (parts.length === 3) {
            data = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
        } else {
            data = new Date(data)
        }
    }

    const dia = data.getUTCDate() < 10 ? '0' + data.getUTCDate() : data.getUTCDate()
    const mes = (data.getUTCMonth() + 1) < 10 ? '0' + (data.getUTCMonth() + 1) : data.getUTCMonth() + 1
    const ano = data.getUTCFullYear()

    return `${ano}-${mes}-${dia}`
}

function formatDateForUpdate(input) {
    if (!input) return null
    
    if (input instanceof Date) return input.toISOString().split('T')[0];
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input

    const parts = input.split('/')
    if (parts.length === 3) {
        const year = parseInt(parts[2], 10)
        const month = parseInt(parts[1], 10) - 1
        const day = parseInt(parts[0], 10)

        const date = new Date(Date.UTC(year, month, day))

        return date.toISOString().split('T')[0]
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

function convertToLocalTimezone(dateString) {
    const date = new Date(dateString)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - userTimezoneOffset)
}

module.exports = {
    formatDate,
    formatDateForInput,
    formatDateForUpdate,
    formatDateWithCheck,
    formatDateForUpdateRecord,
    convertToLocalTimezone
}