import { v2 as cloudinary } from "cloudinary";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import jwt from "jsonwebtoken";

export const capitalLetter = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const files = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      folder: "reminder",
    });
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendEmail = async ({ dynamicData, template }) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: dynamicData.email,
      from: { email: "noreply.pestbytes@gmail.com", name: "PestBytes" },
      dynamic_template_data: dynamicData,
      template_id: template,
    };
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
