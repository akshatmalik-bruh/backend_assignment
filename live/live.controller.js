import { getLiveContentService } from "./live.services.js";

export const getLiveContentController = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subject } = req.query; 

        const result = await getLiveContentService({ teacherId, subject });

        if (!result || (Array.isArray(result) && result.length === 0)) {
            return res.status(200).json({ 
                message: "No content available", 
                data: [] 
            });
        }

        return res.status(200).json({ 
            message: "Live content fetched successfully", 
            data: result 
        });
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
};