const excel = require('excel4node')

function exportToExcel(data, res) {
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet('Kian Inventário')

    const headers = Object.keys(data[0])
    headers.forEach((header, index) => {
        ws.cell(1, index + 1).string(header)
    })

    data.forEach((row, rowIndex) => {
        headers.forEach((header, index) => {
            ws.cell(rowIndex + 2, index + 1).string(row[header].toString())
        })
    })
    const fileName = 'kian_inventario.xlsx'

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    wb.writeToBuffer().then(buffer => {
        res.send(buffer)
    }).catch(err => {
        console.error('Erro ao exportar para Excel:', err)
        res.status(500).send('Erro ao exportar para Excel')
    })
}

module.exports = { exportToExcel }
