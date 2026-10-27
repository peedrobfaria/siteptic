const btnScan = document.getElementById('btn-scan');
const btnAssign = document.getElementById('btn-assign');
const inputSerial = document.getElementById('nfc-serial');
const statusDiv = document.getElementById('nfc-status');
const usernameInput = document.getElementById('username');

function showStatus(message, isError = false) {
    if (!statusDiv) return;
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'status-error' : 'status-success';
}

// Só executa o código de NFC se estivermos na página de Cadastro
if (btnScan) {
    btnScan.addEventListener('click', async () => {
        if (!("NDEFReader" in window)) {
            showStatus("Erro: A Web NFC API não é suportada neste navegador. Use o Chrome no Android.", true);
            return;
        }

        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            showStatus("Aproxime a tag NFC da traseira do celular...");
            
            ndef.addEventListener("readingerror", () => {
                showStatus("Erro ao ler a tag NFC. Tente novamente.", true);
            });

            ndef.addEventListener("reading", ({ serialNumber }) => {
                inputSerial.value = serialNumber;
                showStatus(`Tag lida com sucesso! Serial: ${serialNumber}`);
                btnAssign.style.display = 'inline-block'; // Mostra botão de atribuir
            });
        } catch (error) {
            showStatus(`Erro ao iniciar o leitor: ${error}`, true);
        }
    });
}

if (btnAssign) {
    btnAssign.addEventListener('click', () => {
        const user = usernameInput.value;
        const serial = inputSerial.value;

        if (!user) {
            showStatus("Por favor, preencha o nome do usuário.", true);
            return;
        }

        console.log(`Dados prontos para envio ao BD -> Usuário: ${user} | NFC ID: ${serial}`);
        showStatus(`Chave ${serial} atribuída a ${user} com sucesso (Simulação pronta para MySQL)!`);
    });
}