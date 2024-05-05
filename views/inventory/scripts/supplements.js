function handleRequest(id, action) {
    swal({
        title: "Tem certeza?",
        text: action === 'accept' ? "Você tem certeza que deseja aceitar este requerimento?" : "Você tem certeza que deseja recusar este requerimento?",
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
                        swal("Aviso", "Você precisa fornecer um motivo para recusar o requerimento.", "warning");
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
        text: "Por favor, aguarde enquanto o requerimento está sendo processado.",
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
            text: "Não foi possível processar o seu requerimento: " + error.message,
            icon: "error",
            button: "OK",
        });
    });
}

function showAlert(message) {
    swal("Motivo do Requerimento", message);
}
