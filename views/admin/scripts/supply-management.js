function handleStockRequest(id) {
    swal({
        title: "Entrada de Suprimento",
        text: "Digite a quantidade de suprimento que deseja incluir no estoque",
        content: "input",
        buttons: {
            confirm: {
                text: "Confirmar",
                closeModal: false
            },
            cancel: "Cancelar"
        }
    }).then((quantity) => {
        if (!quantity) {
            swal("Aviso", "Você precisa fornecer uma quantidade.", "warning")
        } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
            swal("Aviso", "Por favor, forneça um número válido.", "warning")
        } else {
            performStockAction(id, quantity)
        }
    })
}

function handleStockCritical(id, currentQuantity) {
    swal({
        title: "Alteração de Estoque Crítico",
        text: "Digite a nova quantidade crítica",
        content: {
            element: "input",
            attributes: { placeholder: "Quantidade Atual: " + currentQuantity }
        },
        buttons: {
            confirm: {
                text: "Confirmar",
                closeModal: false
            },
            cancel: "Cancelar"
        }
    }).then((quantity) => {
        if (!quantity) {
            swal("Aviso", "Você precisa fornecer uma quantidade.", "warning")
        } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
            swal("Aviso", "Por favor, forneça um número válido.", "warning")
        } else {
            performStockCriticalAction(id, quantity)
        }
    })
}

function performStockCriticalAction(id, quantity) {
    swal({
        title: "Processando...",
        text: "Por favor, aguarde enquanto processo a nova quantidade.",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })

    let url = `/admin/supply-change/${id}`
    let data = { quantity: parseInt(quantity) }

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Problema com a resposta da rede')
        }
        return response.json()
    }).then(data => {
        swal.close()
        swal({
            title: "Sucesso",
            text: "O abastecimento foi finalizado com sucesso.",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    }).catch(error => {
        console.error('Houve um erro:', error)
        swal({
            title: "Erro",
            text: "Não foi possível atualizar o estoque.",
            icon: "error",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    })
}


function performStockAction(id, quantity) {
    swal({
        title: "Abastecendo...",
        text: "Por favor, aguarde enquanto o abastecimento está sendo processado.",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })

    let url = `/admin/supply-entry/${id}`
    let data = { quantity: parseInt(quantity) }

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Problema com a resposta da rede')
        }
        return response.json()
    }).then(data => {
        swal.close()
        swal({
            title: "Sucesso",
            text: "O abastecimento foi finalizado com sucesso.",
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    }).catch(error => {
        console.error('Houve um erro:', error)
        swal({
            title: "Erro",
            text: "Não foi possível atualizar o estoque.",
            icon: "error",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    })
}
