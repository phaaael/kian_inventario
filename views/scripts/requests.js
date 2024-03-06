function handleRequest(id, action) {
    let url = `/inventory/${action}/${id}`
    let successMessage = action === 'accept' ? "Solicitação Aceita." : "Solicitação Recusada."
    let title = 'Sucesso'

    fetch(url, {
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
        swal({
            title: title,
            text: data.message || successMessage,
            icon: "success",
        }).then(() => {
            location.reload()
        })
    })
    .catch(error => {
        console.error('Houve um problema com a operação:', error)
        swal({
            title: "Erro",
            text: "Não foi possível concluir a solicitação",
            icon: "error",
        })
    })
}