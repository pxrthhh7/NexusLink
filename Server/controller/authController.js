import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const signtoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const errors = {};

        // NAME VALIDATION
        if (!name || name.trim() === "") {
            errors.name = "Name is required";
        } else if (name.length < 3) {
            errors.name = "Name must be at least 3 characters";
        }

        // EMAIL VALIDATION 
        if (!email || email.trim() === "") {
            errors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Invalid email format";
            }
        }

        // PASSWORD VALIDATION
        if (!password || password.trim() === "") {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
            errors.password =
                "Password must include at least one uppercase letter, one number, and one special character";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        const ExistingUser = await User.findOne({ email });
        if (ExistingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({ name, email, password: hashedPassword })
        const token = signtoken(user._id)

        res.status(201).json({
            success: true,
            message: 'Registration successfull.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                subscription: user.subscription
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const errors = {}

    if (!email || email.trim() === "") {
        errors.email = "Email is required"
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "Invalid email format"
        }
    }

    if (!password || password.trim() === "") {
        errors.password = "Password is required"
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long"
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
        errors.password =
            "Password must include at least one uppercase letter, one number, and one special character";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid password.' })
    }

    const token = signtoken(user._id)
    res.status(200).json({
        success: true,
        message: `${user.name}, Welcome to NexusLink!`,
        token,
    });
}