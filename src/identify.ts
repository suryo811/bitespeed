import { Router, Request, Response } from "express";
import prisma from "./config/db.js";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phone number is required" });
  }

  // 1. Find all contacts matching with email OR phoneNumber
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [email ? { email } : {}, phoneNumber ? { phoneNumber } : {}],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //   console.log(contacts);

  if (contacts.length === 0) {
    // 2. If no match found, create a new primary contact
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: [],
      },
    });
  }

  return res.status(200).json({ status: "success", contacts });
});

export default router;
