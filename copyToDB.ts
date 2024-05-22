import { $ } from "bun";
import { readdir } from "fs/promises";
import { join } from "path";
import { pipe } from "./utils";
import { processImages } from "./processImage";

// const absoluteDirectoryPath = "/Users/alien/Projects/testImages/";

export async function copyToDB(absoluteDirectoryPath: string) {
  try {
    await $`cp ${absoluteDirectoryPath}/* db/media/`;
    const files = await readdir("db/media/");
    return files.map((file) => join("db/media/", file)); //todo: tag processed media in DB.
  } catch (error) {
    throw new Error("Error copying files to DB:" + error);
  }
}

export async function postImageDetails(
  imageDetails: {
    imgPath: string;
    tags: string[];
    title: string;
    description: string;
    timeStamp: number;
  }[]
) {
  for (const details of imageDetails) {
    try {
      const response = await fetch("http://localhost:9000/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new Error("Error posting image:" + error);
    }
  }
}

function processImagesFake(filePaths: string[]) {
  const imageDetails = [
    {
      imgPath: "db/media/8.png",
      tags: ["fantasy", "mythology", "celestial", "vibrant"],
      title: "divine-mythical-scene",
      description:
        "A vibrant, fantastical scene with a central divine figure, surrounded by mythological elements, celestial bodies, and intricate, colorful details.",
      timeStamp: 1716383071412,
    },
    {
      imgPath: "db/media/9.png",
      tags: ["mythological", "celestial", "vibrant", "surreal"],
      title: "fantastical-scene",
      description:
        "A fantastical scene with mythological and celestial figures, intricate architectural elements, vibrant colors, and surreal landscapes.",
      timeStamp: 1716383080923,
    },
    {
      imgPath: "db/media/12.png",
      tags: ["whale", "watermelon hat", "aurora", "ocean"],
      title: "whale-watermelon-hat",
      description:
        "A whale in the ocean wearing a hat shaped like a watermelon, under aurora lights.",
      timeStamp: 1716383102451,
    },
    {
      imgPath: "db/media/11.png",
      tags: ["dogs", "jumping", "living room", "cozy"],
      title: "dogs-jumping-indoors",
      description:
        "Several dogs are jumping through an open window into a cozy, well-lit living room.",
      timeStamp: 1716383116257,
    },
    {
      imgPath: "db/media/10.png",
      tags: ["surreal", "regal", "mythical", "otherworldly"],
      title: "regal-mythical-scene",
      description:
        "A surreal scene featuring a regal figure in intricate attire, floating orbs, mythical creatures, and an otherworldly landscape with futuristic and classical elements.",
      timeStamp: 1716383125824,
    },
    {
      imgPath: "db/media/4.png",
      tags: ["fantasy", "mythological", "cosmic", "otherworldly"],
      title: "cosmic-fantasy-realm",
      description:
        "Surreal, vibrant fantasy scene with diverse mythological and cosmic elements, depicting various humanoid, animal, and celestial beings in an intricate, otherworldly environment.",
      timeStamp: 1716383137711,
    },
    {
      imgPath: "db/media/5.png",
      tags: ["surreal", "mythical", "cosmic", "earthly"],
      title: "fantastical-cosmic-landscape",
      description:
        "Fantastical scene: surreal landscape with diverse mythical beings, celestial bodies, and vivid colors, symbolizing cosmic and earthly realms.",
      timeStamp: 1716383148813,
    },
    {
      imgPath: "db/media/7.png",
      tags: ["surreal", "fantastical", "colorful", "celestial"],
      title: "surreal-colorful-scene",
      description:
        "A surreal, colorful scene with various fantastical creatures, human figures, celestial elements, and a central figure in purple robes.",
      timeStamp: 1716383157508,
    },
    {
      imgPath: "db/media/6.png",
      tags: ["fantasy", "mythological", "celestial", "vibrant"],
      title: "mythical-celestial-pool",
      description:
        "A detailed, surreal, and colorful fantasy scene with mythological and celestial elements, featuring numerous human figures, angels, mythical creatures, and a central pool.",
      timeStamp: 1716383172162,
    },
    {
      imgPath: "db/media/2.png",
      tags: ["Colosseum", "celestial bodies", "figure", "flowing dress"],
      title: "colosseum-celestial-figure",
      description:
        "Surreal image of the Colosseum with two celestial bodies and a figure in a flowing dress.",
      timeStamp: 1716383182305,
    },
    {
      imgPath: "db/media/3.png",
      tags: ["surreal", "multi-armed", "mystical", "dining"],
      title: "mystical-dining-scene",
      description:
        "A surreal image featuring a multi-armed, purple woman surrounded by various mystical elements, amidst people dining and interacting.",
      timeStamp: 1716383194011,
    },
    {
      imgPath: "db/media/1.png",
      tags: ["cathedral", "moons", "Hummer", "silhouette"],
      title: "surreal-night-sky",
      description:
        "Surreal scene featuring a large cathedral, numerous moons in the sky, a Hummer, and a silhouette of a woman.",
      timeStamp: 1716383209954,
    },
  ];

  imageDetails;
}

export async function folderToDB(absoluteDirectoryPath: string) {
  return await pipe(absoluteDirectoryPath, [
    copyToDB,
    processImagesFake,
    postImageDetails,
  ]);
}
