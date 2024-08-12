import { createDataItemSigner, message } from '@permaweb/aoconnect';

let walletAddress = null;

const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const walletStatus = document.getElementById('walletStatus');
const sendMessageSection = document.getElementById('sendMessageSection');
const messageData = document.getElementById('messageData');
const submitMessageBtn = document.getElementById('submitMessageBtn');
const messageStatus = document.getElementById('messageStatus');

connectBtn.addEventListener('click', connectWallet);
disconnectBtn.addEventListener('click', disconnectWallet);
sendMessageBtn.addEventListener('click', toggleSendMessage);
submitMessageBtn.addEventListener('click', sendMessage);

async function connectWallet() {
    if (window.arweaveWallet) {
        try {
            await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
            walletAddress = await window.arweaveWallet.getActiveAddress();
            walletStatus.textContent = `Connected: ${walletAddress}`;
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
            sendMessageBtn.disabled = false;
        } catch (error) {
            console.error('Failed to connect to wallet:', error);
            walletStatus.textContent = 'Failed to connect to wallet: ' + error.message;
        }
    } else {
        walletStatus.textContent = 'ArConnect wallet not detected';
    }
}

function disconnectWallet() {
    walletAddress = null;
    walletStatus.textContent = 'Not connected';
    connectBtn.style.display = 'inline-block';
    disconnectBtn.style.display = 'none';
    sendMessageBtn.disabled = true;
    sendMessageSection.style.display = 'none';
}

function toggleSendMessage() {
    sendMessageSection.style.display = sendMessageSection.style.display === 'none' ? 'block' : 'none';
}

async function sendMessage() {
    if (!walletAddress) {
        messageStatus.textContent = 'Please connect your wallet first.';
        messageStatus.className = 'error';
        return;
    }

    try {
        const signer = createDataItemSigner(window.arweaveWallet);
        const messageId = await message({
            process: 'q6q0mjZ2UYUpdDYmxemVTyjKf6176F2Sse3N7uAW3D0',
            signer: signer,
            tags: [
                { name: 'Action', value: 'SetMessages' }
            ],
            data: messageData.value,
        });
        console.log('Message sent with ID:', messageId);
        messageStatus.textContent = 'Message sent successfully!';
        messageStatus.className = 'success';
    } catch (error) {
        console.error('Error sending message:', error);
        messageStatus.textContent = 'Failed to send message: ' + error.message;
        messageStatus.className = 'error';
    }
}

// Initialize button states
disconnectBtn.style.display = 'none';
sendMessageBtn.disabled = true;