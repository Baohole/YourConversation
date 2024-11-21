import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const body = document.querySelector('.chat-area .chat-messages');

if (body) {
    body.scrollTop = body.scrollHeight;
    const user_info = document.querySelector('[my-id]');
    // console.log(user_info)
    if (user_info) {
        const input = document.querySelector('.message-input input[id=messageInput]');
        const isTyping = document.querySelector('.chat-area .typing-indicators');

        // chat.js
        const upload = document.querySelector('.chat-container #fileInput')
        // console.log(upload);
        const form = document.querySelector('.chat-container .message-input');

        if (form) {
            const sendButton = document.querySelector('.chat-container .send-btn');
            let files = [];

            const handleSubmit = (e) => {
                e.preventDefault();
                const message = input.value;
                if (message || files.length > 0) {
                    // console.log(files);
                    socket.emit('CLIENT_SEND_MESSAGE', {
                        message: message,
                        files: files,
                        _id:_id
                    });
                    input.value = '';
                    files = [];
                    // upload.resetPreviewPanel(); // clear all selected images
                }
            };

            sendButton.addEventListener('click', handleSubmit);
            form.addEventListener('submit', handleSubmit);

            const previewcontainer = document.querySelector('.preview-container ');
            if (previewcontainer && upload) {

                const bytesToSize = (bytes, decimals = 2) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const dm = decimals < 0 ? 0 : decimals;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                }


                const previewfile = previewcontainer.querySelector('.files-preview');
                upload.addEventListener('change', (e) => {
                    previewfile.innerHTML = '';
                    const filesArray = Array.from(e.target.files);
                    let preview = document.createElement('ul');

                    filesArray.forEach(async file => {
                        let type = file.type.split('/')[0];
                        console.log(type);
                        // let data = await readFileAsDataURL(file);
                        let size = bytesToSize(file.size);
                        if (type == 'image' || type == 'video') {
                            type = 'media';
                            const url = URL.createObjectURL(file);
                            preview.innerHTML += `
                            <li class="mb-2">
                                <img src=${url} class='preview max-h-full max-w-full rounded object-contain w-full h-full'>
                            <\li>
                        `
                        }
                        else {
                            type = 'file'
                            preview.innerHTML += `
                            <li class='flex items-center cursor-pointer p-2 rounded-lg shadow-md space-x-4 w-80 hover:bg-slate-300'>
                                <div class="flex items-center justify-center w-12 h-12 bg-black text-white rounded-md">
                                    <span class="font-bold text-lg"><i class="fa-solid fa-file-lines"></i></span>
                                </div>
                                <div>
                                    <p class="text-gray-800 font-medium">${file.name}</p>
                                    <p class="text-gray-500 text-sm">${size}</p>
                                </div>
                            <\li>
                        `
                        }
                        // console.log(data)
                        files.push({
                            file,
                            type,
                            size,
                            name: file.name
                        });

                    });
                    previewfile.appendChild(preview);

                    if (previewfile.children.length > 0) {
                        previewcontainer.classList.remove('hidden');
                    }
                });

                const sendbtn = previewcontainer.querySelector('.send-files-btn');
                if (sendbtn) {
                    sendbtn.addEventListener('click', () => {
                        const msg = previewcontainer.querySelector('input');
                        input.value = msg.value.trim();
                        handleSubmit({ preventDefault: () => { } });  // Create mock event object

                        // Reset and hide preview container
                        msg.value = '';
                        previewcontainer.classList.add('hidden');
                    });

                }
                const closeuploadcontainer = previewcontainer.querySelector('.close-upload-container');
                if (closeuploadcontainer) {
                    closeuploadcontainer.addEventListener('click', () => {
                        previewcontainer.classList.add('hidden');
                    });
                }

            }

        }

        socket.on('SERVER_SEND_MESSAGE', (message) => {
            // Display the message in the chat
            // console.log(message);
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            //const chatBody = body.querySelector('.main-content .chat-area .chat-container');
            console.log(_id, message.user_id)
            const existTyping = isTyping.querySelector(`[user-id="${message.user_id}"]`);
            let messageowner = "";
            if (existTyping) {
                existTyping.remove();
            }
            if (_id === message.user_id) {
                messageElement.classList.add('sent');

            }
            else {
                messageElement.classList.add('received');
                messageElement.innerHTML = `
                <div class='avatar'>
                    <img src=${message.user_avatar} alt=${message.user_name}>
                <\div>
            `
                messageowner = `
                    <div class="username">
                        <span class='name'>${message.user_name}</span>
                    </div>
            `
            }
            let content = "";
            if (message.files.length > 0) {
                for (const file of message.files) {
                    if (file.type == 'media') {
                        content += `
                        <img class="inner-img rounded-lg cursor-pointer object-cover max-h-[200px]" 
                            src=${file.link}
                            alt="Image">`;
                    }
                    else {
                        content += `
                        <a class="flex items-center cursor-pointer p-2 space-x-4 w-80" href=${file.link} download=${file.name}>
                            <div class="flex items-center justify-center w-12 h-12 bg-black text-white rounded-md">
                                <span class="font-bold text-lg">
                                    <i class="fa-solid fa-file-lines"></i>
                                </span>
                            </div>
                            <div>
                                <p class="text-gray-800 font-medium">${file.name}</p>
                                <p class="text-gray-500 text-sm">${file.size}</p>
                            </div>
                        </a>`;
                    }

                }

            }

            if (message.message) {
                content += `<p>${message.message}</p>`;
            }
            const date = new Date(message.timestamp);

            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            const timestamp = `${hours}:${minutes} ${ampm}`;
            content += `<span class='timestamp'>${timestamp}</span>`;


            messageElement.innerHTML += `
            <div class="message-content">
                <div class="inner-content">
                <div class="username">
                    <span class="name">${messageowner}</span>
                    <span class="role">owner</span>
                </div>
                    <div class="content">
                        ${content}
                    </div>
                </div>
            </div>
        `

            isTyping.parentElement.insertBefore(messageElement, isTyping);
            // chatBody.appendChild(messageElement);
            body.scrollTop = body.scrollHeight;
        });

        const emoji_btn = document.querySelector('.chat-input .emoji-btn');
        if (emoji_btn) {
            const tooltip = document.querySelector('.tooltip')
            Popper.createPopper(emoji_btn, tooltip);

            emoji_btn.onclick = () => {
                tooltip.classList.toggle('shown');
            }
        }
        const emoji_picker = document.querySelector('emoji-picker');
        if (emoji_picker) {
            emoji_picker.addEventListener('emoji-click', event => {
                input.value += event.detail.unicode;
                input.setSelectionRange(input.value.length, input.value.length);
                input.focus();
            });
        }

        var timeOut;
        input.addEventListener('keyup', () => {
            socket.emit('CLIENT_SEND_TYPING', {
                user_id: _id,
                is_typing: true
            });

            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                socket.emit('CLIENT_SEND_TYPING', {
                    user_id: _id,
                    is_typing: false
                });
            }, 1000);
        });

        socket.on('SERVER_SEND_TYPING', (data) => {
            isTyping.classList.remove('hidden');
            const existTyping = isTyping.querySelector(`[user-id="${data.user_id}"]`);
            // console.log(existTyping);

            if (!existTyping && data.is_typing) {
                const userTyping = document.createElement('div');
                userTyping.classList.add('indicator');
                userTyping.setAttribute('user-id', data.user_id);
                userTyping.innerHTML += `
                    <span>${data.user_name} is typing</span>
                    <div class='dot-container'>
                        <span class='dot'></span>
                        <span class='dot'></span>
                        <span class='dot'></span>
                    <\div>
            `;
                isTyping.appendChild(userTyping);
                body.scrollTop = body.scrollHeight;
            }
            else if (existTyping && !data.is_typing) {
                existTyping.remove();
            }

        });

        // document.addEventListener('click', function (event) {
        //     if (!fileContainer.contains(event.target) && !btnImage.contains(event.target)) {
        //         fileContainer.classList.remove('show');
        //     }
        // });
    }

    const creatGroupBtn = document.querySelector('.create-group');
    if (creatGroupBtn) {
        creatGroupBtn.addEventListener('click', () => {
            createForm.classList.add('show');
        });

        const createForm = document.querySelector('.create-form');
        if (createForm) {
            createForm.addEventListener('click', function (event) {
                if (event.target === createForm) {
                    createForm.classList.remove('show');
                }
            });

            const closebtn = createForm.querySelector('.close-btn');
            closebtn.addEventListener('click', () => {
                createForm.classList.remove('show');
            });

            const creaBtn = createForm.querySelector('.create-group-btn');
            creaBtn.addEventListener('click', () => {
                const form = createForm.querySelector('.form-creat-group');
                const user_list = createForm.querySelectorAll('.user-list .user-item .form-check-input');
                const users = [];
                user_list.forEach((user) => {
                    if (user.checked) {
                        users.push(user.value);
                    }
                });
                const ids = form.querySelector('input[name=ids]');
                ids.value = users.join(',');
                form.submit();
            });
        }
    }

    const chatHeader = document.querySelector('.chat-area .chat-header .user-info');
    const chatProperty = document.querySelector('.chat-property')
    if (chatHeader) {
        chatHeader.childNodes.forEach(node => {
            node.addEventListener('click', () => {
                if (chatProperty) {
                    chatProperty.classList.toggle('hidden');
                }
            });
        });
    }

    if (chatProperty) {
        const sections = chatProperty.querySelector('.chat-detail .chat-sections ul');
        sections.childNodes.forEach(node => {
            node.addEventListener('click', () => {
                const opt = node.getAttribute('opt');
                const url = new URL(window.location.href);
                node.childNodes[0].classList.add('active');
                sections.childNodes.forEach(tmp => {
                    if (tmp != node) {
                        tmp.childNodes[0].classList.remove('active');
                    }
                });

                url.searchParams.set('property', opt);
                window.location.href = url;
            });

        });

        const notification = chatProperty.querySelector('.notification-section');
        const notificationInput = notification.querySelector('input[type=checkbox]');
        // notification.childNodes.forEach(child => {
        notification.addEventListener('click', () => {
            console.log(notificationInput);
            notificationInput.checked = !notificationInput.checked;
            socket.emit('CLIENT_CHANGE_NOTIFICATION', {
                id: _id,
                notification: notificationInput.checked ? 'on' : 'off',
            });
        });

        const closeproperty = chatProperty.querySelector('.close-btn');
        closeproperty.addEventListener('click', () => {
            chatProperty.classList.add('hidden');
        });
        // });
    }


}