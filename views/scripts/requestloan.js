document.querySelector('.request_loan').addEventListener('submit', function(event) {
    event.preventDefault();  // Previne o comportamento padrão de envio do formulário
    console.log('Formulário enviado');  // Para depuração, verificar se o evento de submit está sendo capturado

    let formData = new FormData(this);  // Cria um FormData a partir do formulário
    let object = {};
    formData.forEach((value, key) => { object[key] = value; });  // Converte os dados do formulário para um objeto
    let json = JSON.stringify(object);  // Converte o objeto para uma string JSON

    fetch('/inventory/request_loan', {  // Faz uma solicitação POST para o servidor
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: json  // Envia os dados do formulário convertidos em JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Houve um problema com a resposta da rede');  // Lança um erro se a resposta não for ok
        }
        return response.json();  // Converte a resposta para JSON
    })
    .then(data => {
        console.log('Dados recebidos:', data);  // Para depuração, exibe os dados recebidos
        if (data.success) {  // Verifica se a operação foi bem-sucedida
            swal({  // Exibe um alerta de sucesso
                title: "Sucesso",
                text: data.message,
                icon: "success",
            }).then(() => {
                location.reload();  // Recarrega a página após o fechamento do alerta
            });
        } else {
            swal({  // Exibe um alerta de erro se success for false
                title: "Erro",
                text: data.message || "Não foi possível concluir a solicitação",
                icon: "error",
            });
        }
    })
    .catch(error => {
        console.error('Houve um problema com a operação:', error);  // Para depuração, exibe o erro no console
        swal({  // Exibe um alerta de erro em caso de falha na operação
            title: "Erro",
            text: "Não foi possível concluir a solicitação",
            icon: "error",
        });
    });
});

