const { User, Buyer, Seller, DeliveryPerson, Admin } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("../utils/error");

module.exports = {
    // 🔹 SIGNUP
    signup: async (req, res, next) => {
        try {
            const { name, email, password, confirmPassword, role, address, phoneNumber, shopName, headquartersAddress, vehicleType } = req.body;

            // Vérifier si l'email existe déjà
            if (await User.findOne({ email })) {
                return next(e.errorHandler(400, "Email already in use"));
            }

            // Vérifier si les mots de passe correspondent
            if (password !== confirmPassword) {
                return next(e.errorHandler(400, "Passwords do not match"));
            }

            // Hashage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Définir "buyer" par défaut si le rôle n'est pas fourni
            const userRole = role || "buyer"; 

            let newUser;
            const userData = { name, email, password: hashedPassword, role: userRole };

            switch (userRole) {
                case "buyer":
                    if (!address || !phoneNumber) {
                        return next(e.errorHandler(400, "Fields cannot be empty"));
                    }
                    newUser = new Buyer({ ...userData, address, phoneNumber });
                    break;
                case "seller":
                    if (!shopName || !headquartersAddress) {
                        return next(e.errorHandler(400, "Seller must have shop name and headquarters address"));
                    }
                    newUser = new Seller({ ...userData, shopName, headquartersAddress });
                    break;
                case "delivery":
                    if (!vehicleType) {
                        return next(e.errorHandler(400, "Delivery person must have vehicle type"));
                    }
                    newUser = new DeliveryPerson({ ...userData, vehicleType });
                    break;
                case "admin":
                    newUser = new Admin(userData);
                    break;
                default:
                    return next(e.errorHandler(400, "Invalid role"));
            }

            await newUser.save();
            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            next(error);
        }
    },

    // 🔹 SIGNIN
    signin: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Vérifier si l'utilisateur existe
            const user = await User.findOne({ email });
            if (!user) return next(e.errorHandler(400, "Invalid email or password"));

            // Vérifier le mot de passe
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return next(e.errorHandler(400, "Invalid email or password"));

            // Vérifier si le compte est actif
            if (!user.isActive) {
                return next(e.errorHandler(403, "Your account has been deactivated"));
            }

            // Générer le token JWT
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Envoyer le token dans un cookie sécurisé
            res.cookie("access_token", token, {
                httpOnly: true, // Sécuriser l'accès du cookie
                secure: process.env.NODE_ENV === "production", // Si en production, utiliser HTTPS
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            });

            // Réponse avec les détails de l'utilisateur
            res.status(200).json({
                message: "Signin successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    role: user.role,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // 🔹 GOOGLE AUTH
    google: async (req, res, next) => {
        const { email, name, googlePhotoUrl } = req.body;
    
        try {
            // Check if the user already exists
            const user = await User.findOne({ email });
            if (user) {
                // Ensure the user is a buyer
                if (user.role !== "buyer") {
                    return next(e.errorHandler(403, "Google authentication is only available for buyers."));
                }
    
                // Generate JWT token
                const token = jwt.sign(
                    { userId: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
    
                // Remove password from the user object
                const { password, ...rest } = user._doc;
    
                // Send response with token and user data
                res
                    .status(200)
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    })
                    .json(rest);
            } else {
                // Generate a random password
                const generatedPassword =
                    Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
                const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
    
                // Split name into firstName and lastName
                const [firstName, ...lastNameParts] = name?.split(" ") || [];
                const lastName = lastNameParts.join(" ");
    
                // Validate name fields
                if (!firstName || !lastName) {
                    return next(e.errorHandler(400, "Invalid name provided from Google."));
                }
    
                // Create a new buyer with default values for address and phoneNumber
                const newUser = new Buyer({
                    name: `${firstName} ${lastName}`,
                    email,
                    password: hashedPassword,
                    profilePicture: googlePhotoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', // Default profile picture
                    role: "buyer", // Force the role to be "buyer"
                    isActive: true,
                    address: "Not provided", // Default value for address
                    phoneNumber: "Not provided", // Default value for phoneNumber
                });
    
                // Save the new user to the database
                await newUser.save();
    
                // Generate JWT token for the new user
                const token = jwt.sign(
                    { userId: newUser._id, role: newUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
    
                // Remove password from the user object
                const { password, ...rest } = newUser._doc;
    
                // Send response with token and user data
                res
                    .status(200)
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    })
                    .json(rest);
            }
        } catch (error) {
            next(error);
        }
    },};