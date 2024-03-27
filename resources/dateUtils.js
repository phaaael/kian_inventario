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

function formatDateForInput(data) {
    if (!(data instanceof Date)) data = new Date(data)

    if (isNaN(data.getTime())) return ''

    const dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()
    const mes = (data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
    const ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`
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

module.exports = {
    formatDate,
    formatDateForInput,
    formatDateForUpdate,
    formatDateWithCheck
}