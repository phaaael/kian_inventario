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
        if (action === 'accept') {
            swal("Aceita", "A solicitação foi aceita com sucesso.", "success")
        } else {
            swal("Recusada", "A solicitação foi recusada com sucesso.", "success")
        }
    }).catch(error => {
        console.error('Houve um erro:', error)
        swal("Erro", "Não foi possível processar a sua solicitação.", "error")
    }).finally(() => {
        location.reload()
    })
}

function showAlert(message) {
    swal("Motivo da Solicitação", message)
}