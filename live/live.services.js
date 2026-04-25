import prisma from "../utils/prisma.js";

export const getLiveContentService = async ({ teacherId, subject }) => {
    const now = new Date();

    const activeContent = await prisma.content.findMany({
        where: {
            uploadedBy: teacherId,
            status: "approved",
            startTime: { lte: now },
            endTime: { gte: now },
            ...(subject && { subject }) 
        },
        orderBy: {
            createdAt: "asc" 
        }
    });

    if (activeContent.length === 0) {
        return null;
    }

    const subjects = [...new Set(activeContent.map(item => item.subject))];
    const liveItems = [];

    for (const sub of subjects) {
        const subContent = activeContent.filter(item => item.subject === sub);
        
        const totalRotationMinutes = subContent.reduce((sum, item) => sum + (item.rotationDuration || 5), 0);
        const totalRotationMs = totalRotationMinutes * 60 * 1000;

        const currentMs = Date.now() % totalRotationMs;

        let accumulatedMs = 0;
        let selectedItem = subContent[0];

        for (const item of subContent) {
            const durationMs = (item.rotationDuration || 5) * 60 * 1000;
            if (currentMs >= accumulatedMs && currentMs < accumulatedMs + durationMs) {
                selectedItem = item;
                break;
            }
            accumulatedMs += durationMs;
        }
        liveItems.push(selectedItem);
    }

    return subject ? liveItems[0] : liveItems;
};