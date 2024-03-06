document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateRecordForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let formData = new FormData(this); 
        let object = {};
        formData.forEach((value, key) => { object[key] = value; });
        let json = JSON.stringify(object);

        fetch('/inventory/update_record', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: json
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
                text: data.message || "Alteração salva com sucesso",
                icon: "success",
            }).then(() => {
                window.location.href = "/inventory";
            });
        })
        .catch(error => {
            console.error('Houve um problema com a operação:', error);
            swal({
                title: "Erro",
                text: "Não foi possível salvar as alterações",
                icon: "error",
            });
        });
    });
});