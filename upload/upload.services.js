import prisma from "../utils/prisma.js";

export const uploadService = async ({ file, userId, role, subject, title, description, startTime, endTime, rotationDuration }) => {
    if (role !== "teacher") {
        throw new Error("Unauthorized: Only teachers can upload content");
    }
    
    if (!file || !subject || !title) {
        throw new Error("File, subject, and title are required");
    }

    const content = await prisma.content.create({
        data: {
            title,
            description,
            subject,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: file.size,
            uploadedBy: userId,
            status: "pending",
            startTime: startTime ? new Date(startTime) : null,
            endTime: endTime ? new Date(endTime) : null,
            rotationDuration: rotationDuration ? parseInt(rotationDuration) : null
        }
    });

    return content;
}
