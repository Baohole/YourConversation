import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const body = document.querySelector('.chat');
if(body){
    body.scrollTop = body.scrollHeight;
}

const user_info = document.querySelector('[my-id]');
if(user_info){
    const _id = user_info.getAttribute('my-id');
    const isTyping = document.querySelector('.chat .users-typing');

    // chat.js
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-multiple', {
        multiple: true
    });


    const form = document.querySelector('.chat .inner-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = e.target.message.value;
            console.log(message);
            const files = upload.cachedFileArray;
            if (message || files.length > 0) {
                socket.emit('CLIENT_SEND_MESSAGE', { 
                    message: message, 
                    images: files,
                });
                e.target.message.value = '';
                upload.resetPreviewPanel(); // clear all selected images
            }
        });
    }

    socket.on('SERVER_SEND_MESSAGE', (message) => {
        // Display the message in the chat
        const chatBody = document.querySelector('.chat .inner-body');
        const messageElement = document.createElement('div');
        const existTyping = isTyping.querySelector(`[user-id="${message.user_id}"]`);
        if(existTyping){
            existTyping.remove();
        }
        if (_id === message.user_id) {
            messageElement.classList.add('inner-outgoing');
        } else {
            messageElement.classList.add('inner-incoming');
            messageElement.innerHTML = `<div class="inner-name">${message.user_name}</div>`;
        }

        if(message.message){
            console.log(message);
            messageElement.innerHTML += `<div class="inner-message">${message.message}</div>`;
        }
        
        if(message.images.length > 0){
            for(const url of message.images){
                const fileElement = document.createElement('img');
                fileElement.classList.add('inner-img');
                fileElement.src = url;
                messageElement.appendChild(fileElement);
            }

        }
        isTyping.parentElement.insertBefore(messageElement, isTyping);
        //chatBody.appendChild(messageElement);
        body.scrollTop = body.scrollHeight;
    });

    const input = document.querySelector('.chat .inner-foot input[name=message]');
    const button_icon = document.querySelector('.chat .inner-foot .btn-icon');
    if(button_icon){
        const tooltip = document.querySelector('.tooltip')
        Popper.createPopper(button_icon, tooltip)

        button_icon.onclick = () => {
            tooltip.classList.toggle('shown')
        }
    }
    const emoji_picker = document.querySelector('emoji-picker');
    if(emoji_picker){
        emoji_picker.addEventListener('emoji-click', event => {
            input.value += event.detail.unicode;
            input.setSelectionRange(input.value.length, input.value.length);
            input.focus();
        });
    }

    var timeOut;
    input.addEventListener('keyup', () => {
        socket.emit('CLIENT_SEND_TYPING' , {
            user_id: _id,
            is_typing: true
        });

        clearTimeout(timeOut);
        timeOut = setTimeout (() => {
            socket.emit('CLIENT_SEND_TYPING' , {
                user_id: _id,
                is_typing: false
            });
        }, 3000);
    });

    socket.on('SERVER_SEND_TYPING', (data) => {
        const existTyping = isTyping.querySelector(`[user-id="${data.user_id}"]`);
        if (!existTyping && data.is_typing) {
            const userTyping = document.createElement('div');
            userTyping.classList.add('box-typing');
            userTyping.setAttribute('user-id', data.user_id);
            userTyping.innerHTML += `
                <div class='inner-name'>${data.user_name}</div>
                <div class='inner-dots'>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `
            isTyping.appendChild(userTyping);
            ///console.log(isTyping);
        }
        else if(existTyping && !data.is_typing){
            existTyping.remove();
        }
    });


    const btnImage = document.querySelector('.btn-imge');
    const fileContainer = document.querySelector('.upload-box');
    btnImage.addEventListener('click', function(event) {
        event.stopPropagation();
        fileContainer.classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
        if (!fileContainer.contains(event.target) && !btnImage.contains(event.target)) {
            fileContainer.classList.remove('show');
        }
    });

}