document.querySelectorAll('.delivery-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault()

        const activeId = this.querySelector('[name="activeId"]').value

        swal({
            title: "Tem certeza?",
            text: "Você deseja seguir com a ação?",
            icon: "warning",
            buttons: {
                confirm: "Sim",
                cancel: "Não"
            },
            dangerMode: true
        })
        .then((willProceed) => {
            if (willProceed) {
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

                fetch(`/inventory/delivered/${activeId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Houve um problema com a resposta da rede')
                    }
                    return response.json()
                })
                .then(data => {
                    swal.close()
                    swal({
                        title: "Sucesso",
                        text: data.message || "Entrega marcada com sucesso.",
                        icon: "success"
                    }).then(() => {
                        location.reload()
                    })
                })
                .catch(error => {
                    console.error('Houve um problema com a operação:', error)
                    swal.close()
                    swal({ 
                        title: "Erro",
                        text: "Não foi possível concluir a solicitação.",
                        icon: "error"
                    })
                })
            } else {
                swal({
                    title: "Cancelado",
                    text: "A ação foi cancelada.",
                    icon: "info"
                })
            }
        })
    })
})
