import { getContent, approveContent, rejectContent } from "./principal.services.js";

const allowedStatus = ["pending", "approved", "rejected"];


export const getContentController = async (req, res) => {
    try {
        const { role } = req.user;
        const { status } = req.query;

       
        if (status && !allowedStatus.includes(status)) {
            const error = new Error("Invalid status. Must be pending, approved, or rejected.");
            error.statusCode = 400;
            throw error;
        }

        if (role !== "principal") {
            return res.status(403).json({ message: "Unauthorized: Only principals can access this" });
        }

        const result = await getContent({ status });
        return res.status(200).json({ message: "Content fetched successfully", data: result });
    }
    catch (e) {
        return res.status(e.statusCode || 400).json({ message: e.message });
    }
}


export const approveContentController = async (req, res) => {
    try {
        const { role, id: principalId } = req.user;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Content ID is required" });
        }

        if (role !== "principal") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const result = await approveContent({ id, approvedBy: principalId });
        return res.status(200).json({ message: "Content approved successfully", data: result });
    }
    catch (e) {
        return res.status(e.statusCode || 400).json({ message: e.message });
    }
}


export const rejectContentController = async (req, res) => {
    try {
        const { role } = req.user;
        const { id } = req.params;
        const { rejectionReason } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        if (!rejectionReason) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        if (role !== "principal") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const result = await rejectContent({ id, rejectionReason });
        return res.status(200).json({ message: "Content rejected successfully", data: result });
    }
    catch (e) {
        return res.status(e.statusCode || 400).json({ message: e.message });
    }
}
