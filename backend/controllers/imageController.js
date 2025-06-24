import FormData from "form-data";
import userModel from "../models/userModel.js";
import axios from "axios";

export const generateImage = async (req, res) => {
    try {
        const userId  = req.user?.id;
        console.log("User ID:", userId); // Debugging line to check userId
        const { prompt } = req.body; // Assuming the prompt is sent in the request body
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.status(404).json({ success: false, message: "Missing Details" });
        }

        if (user.creditBalance <= 0) {
            return res.status(400).json({ success: false, message: "Insufficient credits", creditBalance: user.creditBalance });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API, // Ensure you have this in your .env file
            },
            responseType: 'arraybuffer', // Use arraybuffer to handle binary data
        })
        console.log("Image data received from API");
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;
        await userModel.findByIdAndUpdate(user._id,
            { creditBalance: user.creditBalance - 1 } // Deduct 1 credit for the image generation
        );
        res.status(200).json({ success: true, message: "Image generated successfully", resultImage, creditBalance: user.creditBalance - 1 });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}