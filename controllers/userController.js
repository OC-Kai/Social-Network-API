const {User, Thought} = require('../models');

module.exports = {
    //get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //get single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).populate('thoughts').populate('friends');
            console.log(req.params.userId)
            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
              }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //create a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json({user,message: 'User created successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$set: req.body},
                {runValidators: true, new: true}
            );
            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
              }
            res.json({user, message: 'User updated succesfully.'})
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(
                {_id: req.params.userId}
            )
            if (!user) {
                return res.status(404).json({ message: 'No user found with that id' });
              }
            res.json({message: 'User deleted successfully'})
        } catch(err) {
            res.status(500).json(err)
        }
    },
    //add a friend
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: {friends: req.body.friendId}},
                {runValidators: true, new: true}
                );
                if (!user) {
                    return res.status(404).json({ message: 'No user found with that id' });
                  }
            res.json({user,message: 'Friend added successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete a friend
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$pull: {friends: req.params.friendId}},
                {runValidators: true, new: true}
                );
                if (!user) {
                    return res.status(404).json({ message: 'No user found with that id' });
                  } else if (!req.params.friendId) {
                    return res.status(404).json({message: 'No friend with that id'});
                  }
            res.json({user, message: 'Friend deleted successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
}