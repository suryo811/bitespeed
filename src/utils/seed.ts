import prisma from "../config/db.js";

async function seed() {
  await prisma.contact.createMany({
    data: [
      {
        phoneNumber: "123456",
        email: "lorraine@hillvalley.edu",
        linkPrecedence: "primary",
      },
      {
        phoneNumber: "123456",
        email: "mcfly@hillvalley.edu",
        linkPrecedence: "secondary",
        linkedId: 1,
      },
      {
        phoneNumber: "919191",
        email: "george@hillvalley.edu",
        linkPrecedence: "primary",
      },
      {
        phoneNumber: "717171",
        email: "biffsucks@hillvalley.edu",
        linkPrecedence: "primary",
      },
    ],
  });
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
