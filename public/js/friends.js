const addFriendButtons = document.querySelectorAll('.add-friend');
if(addFriendButtons) {
    addFriendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userCard = button.closest('.user-card');
            const requestSendButton = userCard.querySelector('.request-send');
            
            button.style.display = 'none';
            requestSendButton.style.display = 'block';
        });
    });
}

const info_card = document.querySelectorAll('.info');
if(info_card.length > 0){
    info_card.forEach(info => {
        const _id = info.getAttribute('id');

        const add_friend = info.querySelector('.add-friend');
        if(add_friend){
            add_friend.addEventListener('click', () => {
                socket.emit('CLIENT_ADD_FRIEND', _id);
            });
        }
       

        const deletedRequest = info.querySelector('.delete-request');
        if(deletedRequest){
            const requestSent = info.querySelector('.request-sent');
            const requestDeleted = info.querySelector('.request-deleted');
            deletedRequest.addEventListener('click', () => {
                requestSent.style.display = 'none';
                deletedRequest.style.display = 'none';
                requestDeleted.style.display = 'block';
                
                socket.emit('CLIENT_DELETE_REQUEST', _id);
            });
        }

        const acceptRequest = info.querySelector('.add-friend-accept');
        const refuseRequest = info.querySelector('.add-friend-refuse');
        const accepted = info.querySelector('.accepted');
        if(acceptRequest){
            acceptRequest.addEventListener('click', () => {
                accepted.style.display = 'block';
                acceptRequest.style.display = 'none';
                refuseRequest.style.display = 'none';

                socket.emit('CLIENT_ACCEPT_REQUEST', _id);
            });
        }

        if(refuseRequest){
            refuseRequest.addEventListener('click', () => {
                accepted.innerHTML = 'Đã từ chối'
                accepted.style.display = 'block';
                acceptRequest.style.display = 'none';
                refuseRequest.style.display = 'none';

                socket.emit('CLIENT_REFUSE_REQUEST', _id);
            });
        }

        // const countRequest = document.querySelector('.requestFriend');
        // if(countRequest){
        //     console.log(_id);
        //     socket.on('SERVER_RETURN_ADD', (user_id) => {
        //         console.log(user_id);
        //         if(_id == user_id){
        //             console.log(user_id)
        //         }
        //     });
        // }
    });
}