const {User, Thought} = require('../models');

module.exports = {
    //get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //get single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId});
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
              }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: thought._id}},
                {runValidators: true, new: true}
            )
            res.json({user, message: 'Thought created successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$set: req.body},
                {runValidators: true, new: true}
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
              }
            res.json({thought, message: 'Thought updated succesfully.'})
        } catch(err) {
            res.status(500).json(err);
        }
    },
    //delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete(
                {_id: req.params.thoughtId}
            )
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
              }
            res.json({message: 'Thought deleted successfully'})
        } catch(err) {
            res.status(500).json(err)
        }
    },
    //add reaction
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$push: {reactions: req.body}},
                {runValidators: true, new: true}
                );
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with that id' });
                  }
            res.json({thought,message: 'Reaction added successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.params.reactionId}}},
                {runValidators: true, new: true}
                );
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with that id' });
                  }
            res.json({thought, message: 'Reaction deleted successfully.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
}