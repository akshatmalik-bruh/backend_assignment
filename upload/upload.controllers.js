import { uploadService } from "./upload.services.js";
import { uploadValidation } from "./upload.validation.js";

export const uploadController = async (req, res) => {
    try {
        const validation = uploadValidation.safeParse(req.body);
        if(req.user.role !== "teacher"){
            return res.status(403).json({ message: "Unauthorized: Only teachers can upload content" });
        }
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid input", error: validation.error });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const { subject, title, description, startTime, endTime, rotationDuration } = validation.data;
        const userId = req.user.id;
        const role = req.user.role;

        const result = await uploadService({
            file: req.file,
            userId,
            role,
            subject,
            title,
            description,
            startTime,
            endTime,
            rotationDuration
        });

        return res.status(201).json({ message: "File uploaded successfully", content: result });
    }
    catch (e) {
        return res.status(e.message === "Unauthorized" ? 403 : 400).json({ 
            message: e.message || "Internal server error" 
        });
    }
}