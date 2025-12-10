document.addEventListener('DOMContentLoaded', () => {
    const orderSummary = document.getElementById('orderSummary')
    const checkoutTotal = document.getElementById('checkoutTotal')
    const checkoutForm = document.getElementById('checkoutForm')
    const checkoutMessage = document.getElementById('checkoutMessage')
    const cepInput = document.getElementById('cep')

    const ruaInput = document.getElementById('rua')
    const numeroInput = document.getElementById('numero')
    const complementoInput = document.getElementById('complemento')
    const bairroInput = document.getElementById('bairro')
    const cidadeInput = document.getElementById('cidade')
    const estadoInput = document.getElementById('estado')
    const pagamentoInput = document.getElementById('pagamento')

    /* =============================
       CARRINHO
    ============================== */
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>Carrinho vazio</p>'
        checkoutTotal.textContent = '0.00'
        return
    }

    orderSummary.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.nome} (x${item.quantity})</span>
            <span>R$ ${(item.preco * item.quantity).toFixed(2)}</span>
        </div>
    `).join('')

    const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0)
    checkoutTotal.textContent = total.toFixed(2)

    /* =============================
       VIA CEP
    ============================== */
  /* =============================
   VIA CEP (CORRETO)
============================== */
cepInput.addEventListener('input', () => {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                mostrarMensagem('CEP não encontrado.', 'erro');
                return;
            }

            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
        })
        .catch(() => {
            mostrarMensagem('Erro ao buscar o CEP.', 'erro');
        });
});


    /* =============================
       SUBMIT DO FORM
    ============================== */
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        if (!pagamentoInput.value) {
            mostrarMensagem('Selecione a forma de pagamento.', 'erro')
            return
        }

        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user') || '{}')

        if (!token || !user.id) {
            mostrarMensagem('Usuário não autenticado.', 'erro')
            return
        }

        const enderecoEntrega = {
            cep: cepInput.value,
            logradouro: ruaInput.value,
            numero: numeroInput.value,
            complemento: complementoInput.value,
            bairro: bairroInput.value,
            localidade: cidadeInput.value,
            uf: estadoInput.value
        }

        const itens = cart.map(item => ({
            idProduto: item.codProduto,
            quantidade: item.quantity
        }))

        const pedido = { itens, enderecoEntrega }

        try {
            const response = await fetch('http://localhost:3000/pedido', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            })

            const data = await response.json()

            if (!response.ok) {
                mostrarMensagem(data.erro || 'Erro ao processar pedido.', 'erro')
                return
            }

            mostrarMensagem('✅ Pedido realizado com sucesso!', 'sucesso')
            localStorage.removeItem('cart')

            setTimeout(() => {
                window.location.href = '../index.html'
            }, 3000)

        } catch (err) {
            console.error(err)
            mostrarMensagem('Erro de conexão com o servidor.', 'erro')
        }
    })

    /* =============================
       MENSAGENS
    ============================== */
    function mostrarMensagem(texto, tipo) {
        checkoutMessage.textContent = texto
        checkoutMessage.className = tipo === 'sucesso'
            ? 'checkout-message success'
            : 'checkout-message error'
    }
    cepInput.addEventListener('input', () => {
    console.log('Digitando CEP:', cepInput.value);
});
})