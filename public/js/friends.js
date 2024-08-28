const addFriendButtons = document.querySelectorAll('.add-friend');
if(addFriendButtons) {
    addFriendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const profileCard = button.closest('.profile-card');
            const requestSendButton = profileCard.querySelector('.request-send');
            
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
        if(acceptRequest){
            const refuseRequest = info.querySelector('.add-friend-refuse');
            const accepted = info.querySelector('.accepted');
            acceptRequest.addEventListener('click', () => {
                accepted.style.display = 'block';
                acceptRequest.style.display = 'none';
                refuseRequest.style.display = 'none';

                socket.emit('CLIENT_ACCEPT_REQUEST', _id);
            });
        }
    });
}