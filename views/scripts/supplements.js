function handleRequest(id, action) {
    swal({
        title: "Tem certeza?",
        text: action === 'accept' ? "Você tem certeza que deseja aceitar esta solicitação?" : "Você tem certeza que deseja recusar esta solicitação?",
        icon: "warning",
        buttons: {
            confirm: "Sim",
            cancel: "Não"
        },
        dangerMode: true,
    }).then((willProceed) => {
        if (willProceed) {
            if (action === 'refuse') {
                swal({
                    title: "Motivo da Recusa",
                    text: "Por favor, forneça o motivo da recusa:",
                    content: "input",
                    buttons: true,
                    dangerMode: true,
                }).then((reason) => {
                    if (!reason.trim()) {
                        swal("Aviso", "Você precisa fornecer um motivo para recusar a solicitação.", "warning");
                    } else {
                        performAction(id, action, reason);
                    }
                });
            } else {
                performAction(id, action);
            }
        } else {
            swal("Cancelado", "A ação foi cancelada.", "error");
        }
    });
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
            swal.showLoading();
        },
    });

    let actionUrl = action === 'accept' ? 'supplement_accept' : 'supplement_refuse';
    let url = `/inventory/${actionUrl}/${id}`;
    let data = { reason: reason };

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (data.success) {
            swal({
                title: "Sucesso",
                text: data.message,
                icon: "success",
                button: "OK",
            }).then(() => {
                window.location.reload();
            });
        } else {
            throw new Error(data.message || "Erro desconhecido.");
        }
    }).catch(error => {
        console.error('Houve um erro:', error);
        swal({
            title: "Erro",
            text: "Não foi possível processar a sua solicitação: " + error.message,
            icon: "error",
            button: "OK",
        });
    });
}

function showAlert(message) {
    swal("Motivo da Solicitação", message);
}
