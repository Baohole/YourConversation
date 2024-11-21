const User = require('../../models/user.model');
const uploadHelper = require('../../helper/upload.helper');

module.exports = async (req, res, socket) => {
    socket.on('CLIENT_SENT_NEW_PROFILE', async (newProfile) => {
        // console.log(res.locals.user.id === newProfile._id)
        // console.log(newProfile);
        if (res.locals.user.id === newProfile._id) {
            let result = {
                type: 'success',
                message: 'Thay đổi thông tin thành công'
            }
            if(!newProfile.username || !newProfile.full_name){
                result.type='error';
                result.message="Tên và username không được để trống!";
            }
            else {
                const eixstUsername = await User.findOne({
                    username: `@${newProfile.username}`,
                    _id: { $ne: newProfile._id } // Exclude current user from check
                });
                if (eixstUsername) {
                    result.type='error';
                    result.message="Username đã tồn tại!";
                }
                else {
                    const data = {
                        full_name: newProfile.full_name,
                        phone: newProfile.phone,
                        username: `@${newProfile.username}`
                    };
                    if (newProfile.avatar) {
                        try {
                            const link = await uploadHelper(newProfile.avatar);
                            data['avatar'] = link;
                        } catch (error) {
                            
                        }
                        
                    }
                    // console.log(data);
                    try {
                        await User.updateOne({
                            _id: newProfile._id
                        }, {
                            ...data
                        });
                        
                    } catch (error) {
                        result.type='error';
                        result.message="Thay đổi thông tin thất bại";
                    }
                }
            }
            
            socket.emit('SERVER_SENT_CHANGE_PROFILE_RESULT',{
                ...result
            })

        }

    });
}