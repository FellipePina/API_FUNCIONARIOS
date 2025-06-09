document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api/funcionarios'; 

    // --- Elementos do Formulário de Cadastro/Atualização ---
    const formFuncionario = document.getElementById('form-funcionario');
    const funcionarioIdInput = document.getElementById('funcionario-id');
    const nomeInput = document.getElementById('nome');
    const idadeInput = document.getElementById('idade');
    const sexoInput = document.getElementById('sexo');
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const celularInput = document.getElementById('celular');
    const cargoInput = document.getElementById('cargo');
    const setorInput = document.getElementById('setor');
    const cargaHorariaSemanalInput = document.getElementById('cargaHorariaSemanal');
    const salarioInput = document.getElementById('salario');
    const estadoCivilInput = document.getElementById('estadoCivil');
    const gastosPorMesInput = document.getElementById('gastosPorMes');
    const btnSalvarFuncionario = document.getElementById('btn-salvar-funcionario');
    const btnLimparForm = document.getElementById('btn-limpar-form');

    // --- Elementos da Seção de Busca ---
    const buscarIdInput = document.getElementById('buscar-id');
    const buscarCpfInput = document.getElementById('buscar-cpf');
    const buscarCargoInput = document.getElementById('buscar-cargo');
    const buscarSetorInput = document.getElementById('buscar-setor');
    // REMOVIDO: const buscarSalarioInput = document.getElementById('buscar-salario');
    const btnBuscarFuncionario = document.getElementById('btn-buscar-funcionario');
    const btnLimparBuscar = document.getElementById('btn-limpar-buscar');

    // --- Elementos da Tabela de Lista ---
    const tabelaFuncionariosBody = document.querySelector('#tabela-funcionarios tbody');
    const btnAtualizarLista = document.getElementById('btn-atualizar-lista');
    const noDataMessage = document.getElementById('no-data-message');

    // --- Funções da Aplicação ---

    function clearForm() {
        formFuncionario.reset();
        funcionarioIdInput.value = '';
    }

    function toggleNoDataMessage(show, message = 'Nenhum funcionário encontrado.') {
        noDataMessage.textContent = message;
        noDataMessage.style.display = show ? 'block' : 'none';
    }

    async function fetchFuncionarios(params = {}) {
        let query = new URLSearchParams();
        if (params.id) query.append('id', params.id);
        if (params.cpf) query.append('cpf', params.cpf);
        if (params.cargo) query.append('cargo', params.cargo);
        if (params.setor) query.append('setor', params.setor);
        // REMOVIDO: if (params.salario) query.append('salario', params.salario);

        const url = `${API_BASE_URL}${query.toString() ? `?${query.toString()}` : ''}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    displayFuncionarios([]);
                    toggleNoDataMessage(true, 'Nenhum funcionário corresponde aos critérios de busca ou nenhum cadastrado.');
                    return;
                }
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const funcionarios = await response.json();
            displayFuncionarios(funcionarios);
            if (funcionarios.length === 0) {
                toggleNoDataMessage(true, 'Nenhum funcionário corresponde aos critérios de busca.');
            } else {
                toggleNoDataMessage(false);
            }
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            alert('Erro ao carregar a lista de funcionários. Verifique o console para mais detalhes e o CORS da sua API.');
            displayFuncionarios([]);
            toggleNoDataMessage(true, 'Erro ao carregar dados. Verifique a conexão com a API.');
        }
    }

    function displayFuncionarios(funcionarios) {
        tabelaFuncionariosBody.innerHTML = '';
        if (funcionarios.length === 0) {
            toggleNoDataMessage(true);
            return;
        }
        toggleNoDataMessage(false);

        funcionarios.forEach(funcionario => {
            const row = tabelaFuncionariosBody.insertRow();
            row.innerHTML = `
                <td>
                    <button class="edit-btn" data-id="${funcionario.id}">✏️</button> 
                    <button class="delete-btn" data-id="${funcionario.id}">🗑️</button>
                </td>
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.idade}</td>
                <td>${funcionario.sexo}</td>
                <td>${funcionario.cpf}</td>
                <td>${funcionario.email}</td>
                <td>${funcionario.celular}</td>
                <td>${funcionario.cargo}</td>
                <td>${funcionario.setor}</td>
                <td>${funcionario.cargaHorariaSemanal}</td>
                <td>${funcionario.salario ? funcionario.salario.toFixed(2) : '0.00'}</td>
                <td>${funcionario.estadoCivil}</td>
                <td>${funcionario.gastosPorMes ? funcionario.gastosPorMes.toFixed(2) : '0.00'}</td>
            `;
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => loadFuncionarioForEdit(e.target.dataset.id));
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteFuncionario(e.target.dataset.id));
        });
    }

    async function loadFuncionarioForEdit(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const funcionario = await response.json();

            funcionarioIdInput.value = funcionario.id;
            nomeInput.value = funcionario.nome;
            idadeInput.value = funcionario.idade;
            sexoInput.value = funcionario.sexo;
            cpfInput.value = funcionario.cpf;
            emailInput.value = funcionario.email;
            celularInput.value = funcionario.celular;
            cargoInput.value = funcionario.cargo;
            setorInput.value = funcionario.setor;
            cargaHorariaSemanalInput.value = funcionario.cargaHorariaSemanal;
            salarioInput.value = funcionario.salario;
            estadoCivilInput.value = funcionario.estadoCivil;
            gastosPorMesInput.value = funcionario.gastosPorMes;

            formFuncionario.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Erro ao carregar funcionário para edição:', error);
            alert('Erro ao carregar os dados do funcionário para edição.');
        }
    }

    formFuncionario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = funcionarioIdInput.value;

        const funcionarioData = {
            id: id ? parseInt(id) : 0, 
            nome: nomeInput.value,
            idade: parseInt(idadeInput.value) || 0,
            sexo: sexoInput.value,
            cpf: cpfInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            cargo: cargoInput.value,
            setor: setorInput.value,
            cargaHorariaSemanal: parseInt(cargaHorariaSemanalInput.value) || 0,
            salario: parseFloat(salarioInput.value) || 0.0,
            estadoCivil: estadoCivilInput.value,
            gastosPorMes: parseFloat(gastosPorMesInput.value) || 0.0
        };

        try {
            let response;
            if (id) {
                response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(funcionarioData)
                });
            } else {
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(funcionarioData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'A API retornou uma resposta não JSON ou vazia.' }));
                const errorMessage = errorData.message || JSON.stringify(errorData) || `Erro HTTP! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            alert(id ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!');
            clearForm();
            fetchFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            alert(`Erro ao salvar funcionário: ${error.message}`);
        }
    });

    async function deleteFuncionario(id) {
        if (!confirm(`Tem certeza que deseja excluir o funcionário com ID ${id}? Esta ação não pode ser desfeita.`)) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro HTTP! status: ${response.status}, Mensagem: ${errorText}`);
            }

            alert('Funcionário excluído com sucesso!');
            fetchFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            alert(`Erro ao excluir funcionário: ${error.message}`);
        }
    }

    // --- Listeners de Eventos ---

    btnBuscarFuncionario.addEventListener('click', () => {
        const params = {
            id: buscarIdInput.value.trim(),
            cpf: buscarCpfInput.value.trim(),
            cargo: buscarCargoInput.value.trim(),
            setor: buscarSetorInput.value.trim()
        };
        fetchFuncionarios(params);
    });

    btnLimparBuscar.addEventListener('click', () => {
        buscarIdInput.value = '';
        buscarCpfInput.value = '';
        buscarCargoInput.value = '';
        buscarSetorInput.value = '';
        // REMOVIDO: buscarSalarioInput.value = '';
        fetchFuncionarios();
    });

    btnLimparForm.addEventListener('click', clearForm);
    btnAtualizarLista.addEventListener('click', () => fetchFuncionarios());

    // --- Inicialização ---
    fetchFuncionarios(); 
});