import { Router, Request, Response } from "express";
import prisma from "./config/db.js";

const router = Router();

// helper function to remove null, undefined, duplicated from array
function unique<T>(arr: (T | null | undefined)[]): T[] {
  return Array.from(new Set(arr.filter((v) => v != null)));
}

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phone number is required" });
  }

  // 1. Find all contacts matching with email OR phoneNumber
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [email ? { email } : {}, phoneNumber ? { phoneNumber } : {}],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //   console.log(contacts);

  if (existingContacts.length === 0) {
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

  // 3. Matches found. Find all contacts linked by email or phone
  // collect all contacts with any matching email or phone from any of the found contacts.
  let contactIds = existingContacts.map((c) => c.id);
  let emailsToCheck = unique(existingContacts.map((c) => c.email));
  let phonesToCheck = unique(existingContacts.map((c) => c.phoneNumber));

  console.log(contactIds, emailsToCheck, phonesToCheck);

  let allContacts = [...existingContacts];
  let keepSearching = true;
  while (keepSearching) {
    const nextContacts = await prisma.contact.findMany({
      where: {
        OR: [{ email: { in: emailsToCheck } }, { phoneNumber: { in: phonesToCheck } }],
      },
    });
    // Add any new contacts found
    let beforeCount = allContacts.length;
    for (const c of nextContacts) {
      if (!contactIds.includes(c.id)) {
        allContacts.push(c);
        contactIds.push(c.id);
        if (c.email && !emailsToCheck.includes(c.email)) emailsToCheck.push(c.email);
        if (c.phoneNumber && !phonesToCheck.includes(c.phoneNumber))
          phonesToCheck.push(c.phoneNumber);
      }
    }
    keepSearching = allContacts.length > beforeCount;
  }
});

export default router;
