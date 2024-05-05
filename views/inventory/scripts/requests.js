function handleRequest(id, action) {
    swal({
        title: "Tem certeza?",
        text: action === 'accept' ? "Você tem certeza que deseja aceitar este requerimento?" : "Você tem certeza que deseja recusar este requerimento?",
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
                        swal("Aviso", "Você precisa fornecer um motivo para recusar o requerimento.", "warning")
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
        text: "Por favor, aguarde enquanto o requerimento está sendo processado.",
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
        const message = action === 'accept' ? "O requerimento foi aceito com sucesso." : "O requerimento foi recusado com sucesso."
        swal({
            title: action === 'accept' ? "Requerimento Aceito" : "Requerimento Recusado",
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
            text: "Não foi possível processar o seu requerimento.",
            icon: "error",
            button: "OK",
        }).then(() => {
            location.reload()
        })
    })
}

function showAlert(message) {
    swal("Motivo do Requerimento", message)
}