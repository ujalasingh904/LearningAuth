import { errorHandler } from "../utils/error.utils.js";
import bcryptjs from "bcryptjs"
import { User } from '../models/User.model.js'

export const test = (req, res) => {
    res.send("Hello World")

}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'you can update only your account'))
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'you can delete only your account'))
    try {

        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted successfully')
    } catch (error) {
        next(error)
    }

}
