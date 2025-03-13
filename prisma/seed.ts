import 'tsconfig-paths/register';
import prisma from '@/utils/prisma';
// import { generateUsername } from 'unique-username-generator';
// import { upgradesData } from '@/utils/upgrades-data';
// import { TaskType } from '@prisma/client';
// import { earnData } from '@/utils/tasks-data';
// import { unlockRequirementsData } from '@/utils/unlock-requirements-data';
// import { hashPassword } from '@/lib/utils';

// function getRandomNumber(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }

async function main() {
  console.log('Start seeding...');

  // for (const category of earnData) {
  //   for (const task of category.tasks) {
  //     // Convert the string type to TaskType enum
  //     const taskType = TaskType[task.type as keyof typeof TaskType];

  //     const createdTask = await prisma.task.create({
  //       data: {
  //         title: task.title,
  //         description: task.description,
  //         points: task.points,
  //         type: taskType, // Use the converted TaskType enum value
  //         image: task.image,
  //         callToAction: task.callToAction,
  //         taskData: task.taskData
  //       }
  //     });
  //     console.log(`Created task with id: ${createdTask.id}`);
  //   }
  // }

  // * Create upgrades
  // await prisma.upgrade.createMany({ data: upgradesData });

  // * Create unlock requirements
  // await prisma.unlockRequirement.deleteMany();
  // await prisma.unlockRequirement.createMany({ data: unlockRequirementsData });

  // const taskActions = ['VISIT', 'TELEGRAM', 'TWITTER', 'REFERRAL'];
  // for (const action of taskActions) {
  //   const createdTaskAction = await prisma.taskAction.create({
  //     data: {
  //       name: action
  //     }
  //   });
  //   console.log(`Created task action with id: ${createdTaskAction.id}`);
  // }

  // *  Clear existing items
  // await prisma.shopItem.deleteMany();

  // * Create shop items
  // for (const item of shopItems) {
  //   let invoiceUrl = item.invoiceUrl || null;

  //   if (!invoiceUrl && !(item.price === 0 || item.price === null) && !item.isBasic) {
  //     invoiceUrl = await createInvoiceLink(item);
  //   }

  //   await prisma.shopItem.create({
  //     data: { ...item, invoiceUrl }
  //   });
  // }

  // * Create admin user
  // const hashedPassword = await hashPassword('12345');
  // const admin = await prisma.adminUser.create({
  //   data: {
  //     username: 'admin',
  //     passwordHash: hashedPassword,
  //     firstName: 'JOK',
  //     lastName: 'Admin'
  //   }
  // });

  // * Create fake airdrops

  // *  100 airdrops in the last 5 days
  // await prisma.userAirdrop.deleteMany();
  // const DAYS_COUNT = 1;
  // const FAKE_AIRDROPS_COUNT = 10;
  // for (let i = 0; i < DAYS_COUNT; i++) {
  //   const date = dayjs().subtract(i, "day").toDate(); // Subtract 1 day
  //   for (let j = 0; j < FAKE_AIRDROPS_COUNT; j++) {
  //     const username = generateUsername("");
  //     const price = getRandomNumber(10, 30000);
  //     const airdrop = await prisma.userAirdrop.create({
  //       data: {
  //         createdAt: date,
  //         isFake: true,
  //         price,
  //         priceInTon: price / 5.43,
  //         username,
  //       },
  //     });
  //
  //     console.log(airdrop);
  //   }
  // }

  // * Create fake airdrops from price list
  // const TON_PRICE = 5.43;
  // await prisma.userAirdrop.deleteMany();
  // const createdAt = new Date("2025-01-20T11:12:10.173Z");
  // const airdrops = [
  //   {
  //     isFake: true,
  //     price: 30000,
  //     priceInTon: 30000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "naruto",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 20000,
  //     priceInTon: 20000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "luffy",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 10000,
  //     priceInTon: 10000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "hulk",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character12",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character6",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character5",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character4",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character3",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character2",
  //     createdAt,
  //   },
  //   {
  //     isFake: true,
  //     price: 5000,
  //     priceInTon: 5000 / TON_PRICE,
  //     username: generateUsername("").toUpperCase(),
  //     equippedAvatar: "character1",
  //     createdAt,
  //   },
  // ];

  // for (let airdrop of airdrops) {
  //   console.log(airdrop);
  //   await prisma.userAirdrop.create({
  //     data: airdrop,
  //   });
  // }

  // const BATCH_SIZE = 1000; // Adjust based on your needs
  // let skip = 0;
  // let totalUpdated = 0;
  // let hasMoreRecords = true;

  // // Get total count for logging purposes
  // const totalUsers = await prisma.user.count();
  // console.log(`Found ${totalUsers} users to update`);

  // // Process in batches
  // while (hasMoreRecords) {
  //   // Get a batch of user IDs
  //   const users = await prisma.user.findMany({
  //     select: { id: true },
  //     skip: skip,
  //     take: BATCH_SIZE
  //   });

  //   if (users.length === 0) {
  //     hasMoreRecords = false;
  //     continue;
  //   }

  //   // Extract IDs for the current batch
  //   const userIds = users.map((user) => user.id);

  //   // Update this batch
  //   const updateResult = await prisma.user.updateMany({
  //     where: {
  //       id: {
  //         in: userIds
  //       }
  //     },
  //     data: {
  //       totalStars: 0,
  //       earnedStars: 0
  //     }
  //   });

  //   totalUpdated += updateResult.count;
  //   console.log(`Updated batch: ${skip} to ${skip + users.length} (${updateResult.count} records)`);

  //   // Move to the next batch
  //   skip += BATCH_SIZE;

  //   // Safety check - exit if we've processed all records
  //   if (users.length < BATCH_SIZE) {
  //     hasMoreRecords = false;
  //   }
  // }

  // console.log(`Total updated: ${totalUpdated} out of ${totalUsers} users`);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
