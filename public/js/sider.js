const actionBtn = document.querySelector('.action-btn');
const menuContainer = document.querySelector('.menu-container');
if (actionBtn) {
    actionBtn.addEventListener('click', () => {
        menuContainer.classList.toggle('hidden');
        // console.log(menu)
    });
}
const recentList = [];
const showSideBar = (barClass) => {
    const sideBar = document.querySelectorAll('.sidebar');
    sideBar.forEach(node => {
        // console.log(node.className);
        if (node.classList.contains(barClass)) {
            node.classList.remove('hidden');
        }
        else if (!node.classList.contains('hidden')) {
            node.classList.add('hidden');
            recentList.push(node.classList.value);
            //console.log(recentList);
        }
    })
}

const backArrow = document.querySelectorAll('.back-arrow');
backArrow.forEach(arrow => {
    arrow.addEventListener('click', () => {
        arrow.closest('.sidebar').classList.add('hidden');
        if (recentList.length) {
            const barClass = recentList.pop().split(' ')[1];
            showSideBar(barClass);
        }
        //console.log(recentList);
    });
});


const menu = menuContainer.querySelectorAll('ul li');
menu.forEach(opt => {
    opt.addEventListener('click', () => {
        // console.log(opt)
        const barClass = opt.getAttribute('opt');
        showSideBar(barClass);
    });
});
// console.log(menu);

const profileSider = document.querySelector('.profilesider');
if (profileSider) {
    const editBtn = document.querySelector('.settingsider .header .edit');
    editBtn.addEventListener('click', () => {
        profileSider.classList.remove('hidden');
        editBtn.closest('.sidebar').classList.add('hidden');
        recentList.push(editBtn.closest('.sidebar').classList.value);
        //console.log(recentList);
    });

    const profileForm = profileSider.querySelector('.profile-form');
    if (profileForm) {
        const avatarInput = profileForm.querySelector('#avatar');
        let file;
        avatarInput.addEventListener('change', (e) => {
            file = e.target.files[0];
            const url = URL.createObjectURL(file);
            const profileAvatar = profileForm.querySelector('.profile-picture label');
            profileAvatar.childNodes.forEach(child => {
                if (child.nodeName === 'IMG') {
                    child.src = url;
                    child.classList.remove('hidden');
                }
                else {
                    child.classList.add('hidden');
                }
            });

        });
        const changeProfile = document.querySelector('.change-profile');
        changeProfile.addEventListener('click', () => {
            const inputField = profileForm.querySelectorAll('input');
            const newProfile = {
                _id
            };
            inputField.forEach(field => {
                if (field.id !== 'avatar') {
                    newProfile[field.id] = field.value;
                }
                else if (file) {
                    newProfile[field.id] = {
                        buffer: file,
                        name: file.name
                    };
                }
            });
            socket.emit('CLIENT_SENT_NEW_PROFILE', {
                ...newProfile
            });
            console.log(newProfile);
        });

        socket.on('SERVER_SENT_CHANGE_PROFILE_RESULT', result => {
            const alertBox = document.createElement('div');
            alertBox.classList.add('messages', 'info');
            alertBox.innerHTML += `
                <div class="alert alert-${result.type}" show-alert="show-alert" data-time="5000"> 
                    <i class="fa-solid ${result.type == 'error' ? 'fa-circle-exclamation' : 'fa-check'}"></i>
                    <span>${result.message}</span>
                    <div class="timebar"></div>
                </div>
            `

            document.body.insertBefore(alertBox, document.body.firstChild);

            document.querySelectorAll('[show-alert]').forEach((alert) => {
                const timeout = parseInt(alert.getAttribute('data-time'), 10) || 3000;

                // Initialize the timebar
                const timebar = alert.querySelector('.timebar');
                if (timebar) {
                    timebar.style.transitionDuration = `${timeout}ms`;
                    requestAnimationFrame(() => {
                        timebar.style.width = '0%';
                    });
                }

                // Automatically dismiss the alert
                setTimeout(() => {
                    alert.classList.add('hide');
                    setTimeout(() => alert.remove(), 500); // Remove after fade-out animation
                }, timeout);
            });

            // Close alert manually
            document.querySelectorAll('.messages.info').forEach((alertBox) => {
                alertBox.addEventListener('click', function () {
                    // const alert = this.parentElement;
                    alertBox.classList.add('hide');
                    setTimeout(() => alertBox.remove(), 500);
                });
            });

        });
    }

}

