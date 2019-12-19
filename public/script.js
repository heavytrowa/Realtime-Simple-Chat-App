const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
//this is for ur own page. which doesnt necessarily needs to be sent to a server
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()//prevent from refreshing the page
  const message = messageInput.value
  appendMessage(`You: ${message}`)//this means you want to show what u sent on ur screen.
  socket.emit('send-chat-message', message)
  messageInput.value = ''//clears out the message box everytime we send a message
})

function appendMessage(message) {//the function we want to append message.
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}