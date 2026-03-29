
import validator from "validator";

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId } = req.body;
    if (!firstName || !lastName) {
        throw new Error("name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("email is not valid!");
    } else if (!validator.isStrongPassword(req.body.password)) {
        throw new Error("password is not strong enough!");
    }
};

const validateEditProfileData = (req,res) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "password",
        "age",
        "about",
        "skills"
    ];
   const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedEditFields.includes(field)
    );
   
};


export {
    validateSignUpData,
    validateEditProfileData
};