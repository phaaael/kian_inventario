function handleRequest(id, action) {
    swal({
        title: "Tem certeza?",
        text: action === 'accept' ? "Você tem certeza que deseja aceitar esta solicitação?" : "Você tem certeza que deseja recusar esta solicitação?",
        icon: "warning",
        buttons: {
            confirm: "Sim",
            cancel: "Não"
        },
        dangerMode: true
    }).then((willProceed) => {
        if (willProceed) {
            if (action === 'refuse') {
                swal({
                    title: "Motivo da Recusa",
                    text: "Por favor, forneça o motivo da recusa:",
                    content: "input",
                    buttons: {
                        confirm: {
                            text: "Enviar motivo",
                            closeModal: false
                        },
                        cancel: "Cancelar"
                    }
                }).then((reason) => {
                    if (!reason) {
                        swal("Aviso", "Você precisa fornecer um motivo para recusar a solicitação.", "warning")
                    } else {
                        performAction(id, action, reason)
                    }
                })
            } else {
                performAction(id, action)
            }
        } else {
            swal("Cancelado", "A ação foi cancelada.", "error")
        }
    })
}

function performAction(id, action, reason = '') {
    swal({
        title: "Processando...",
        text: "Por favor, aguarde enquanto a solicitação está sendo processada.",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    })

    let url = `/inventory/${action}/${id}`
    let data = { reason: reason }

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
        const message = action === 'accept' ? "A solicitação foi aceita com sucesso." : "A solicitação foi recusada com sucesso."
        swal({
            title: action === 'accept' ? "Solicitação Aceita" : "Solicitação Recusada",
            text: message,
            icon: "success",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    }).catch(error => {
        console.error('Houve um erro:', error)
        swal({
            title: "Erro",
            text: "Não foi possível processar a sua solicitação.",
            icon: "error",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    })
}

function showAlert(message) {
    swal("Motivo da Solicitação", message)
}