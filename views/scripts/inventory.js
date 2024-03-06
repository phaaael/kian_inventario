document.querySelectorAll('.delivery-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const activeId = this.querySelector('[name="activeId"]').value;

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
                throw new Error('Houve um problema com a resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            swal({
                title: "Sucesso",
                text: data.message || "Entrega marcada com sucesso.",
                icon: "success",
            }).then(() => {
                location.reload();
            });
        })
        .catch(error => {
            console.error('Houve um problema com a operação:', error);
            swal({ 
                title: "Erro",
                text: "Não foi possível concluir a solicitação",
                icon: "error",
            });
        });
    });
});
