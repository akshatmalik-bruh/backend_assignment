import prisma from "../utils/prisma.js";


export const getContent = async ({ status }) => {
  return await prisma.content.findMany({
    where: {
      ...(status && { status })
    },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};


export const getAllContent = async () => {
  return await prisma.content.findMany({
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};


export const rejectContent = async ({ id, rejectionReason }) => {

  if (!rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  const existing = await prisma.content.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new Error("Content not found");
  }

  if (existing.status !== "pending") {
    throw new Error("Only pending content can be rejected");
  }

  return await prisma.content.update({
    where: { id },
    data: {
      status: "rejected",
      rejectionReason
    }
  });
};


export const approveContent = async ({ id, approvedBy }) => {

  const existing = await prisma.content.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new Error("Content not found");
  }

  if (existing.status !== "pending") {
    throw new Error("Only pending content can be approved");
  }

  return await prisma.content.update({
    where: { id },
    data: {
      status: "approved",
      approvedBy,
      approvedAt: new Date()
    }
  });
};