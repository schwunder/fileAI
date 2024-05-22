import pino from "pino";
import pretty from "pino-pretty";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

// Ensure all logs are flushed before the process exits
process.on("beforeExit", async () => {
  logger.flush();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for flush to complete
});

const imageDetails = [
  {
    imgPath: "db/media/8.png",
    tags: ["surrealistic", "mythological", "celestial"],
    title: "radiant-figure-collage",
    description:
      "A surrealistic collage featuring mythological figures, celestial bodies, and intricate patterns, centered around a radiant figure with a trident.",
    timeStamp: 1716334444588,
  },
  {
    imgPath: "db/media/9.png",
    tags: ["surreal", "fantasy", "mythical", "cosmic"],
    title: "surreal-fantastical-scene",
    description:
      "A surreal, fantastical scene featuring a central figure in ornate dress, angels, mythical creatures, and cosmic elements.",
    timeStamp: 1716334455231,
  },
  {
    imgPath: "db/media/12.png",
    tags: ["whale", "watermelon", "northern lights", "top hat"],
    title: "whale-wearing-helmet",
    description:
      "A whale wearing a watermelon helmet and a top hat, with the northern lights in the sky.",
    timeStamp: 1716334464259,
  },
  {
    imgPath: "db/media/11.png",
    tags: ["dogs", "window", "sunlight"],
    title: "dogs-flying-living-room",
    description:
      "Multiple dogs are flying into a living room through an open window, with bright sunlight streaming in.",
    timeStamp: 1716334471818,
  },
  {
    imgPath: "db/media/10.png",
    tags: ["regal figure", "floating planets", "mythical creatures", "surreal"],
    title: "cosmic-fantasy-realm",
    description:
      "A surreal scene with a regal figure, floating planets, mythical creatures, and architectural structures, blending cosmic and fantastical elements.",
    timeStamp: 1716334479305,
  },
  {
    imgPath: "db/media/4.png",
    tags: ["mystical", "fantasy", "celestial"],
    title: "fantasy-mystical-landscape",
    description:
      "A highly detailed, fantastical scene with mystical beings, intricate landscapes, celestial elements, and vibrant, intricate designs.",
    timeStamp: 1716334487905,
  },
  {
    imgPath: "db/media/5.png",
    tags: ["surreal", "mythical", "spiritual", "celestial"],
    title: "mythical-surreal-landscape",
    description:
      "Fantastic, surreal landscape with mythical creatures, celestial beings, and spiritual figures in vibrant, intricate scenery.",
    timeStamp: 1716334496806,
  },
  {
    imgPath: "db/media/7.png",
    tags: ["surreal", "ornate", "collage", "celestial"],
    title: "surreal-ornate-celestial-collage",
    description:
      "A surreal, ornate collage featuring a central figure in purple, surrounded by various celestial, mythical, and historical elements, with angels, skeletons, and intricate patterns.",
    timeStamp: 1716334508888,
  },
  {
    imgPath: "db/media/6.png",
    tags: ["surreal", "figures", "mythological", "celestial"],
    title: "surreal-mythic-figures",
    description:
      "An intricate, surreal scene with various human figures, mythological elements, celestial bodies, and vivid colors.",
    timeStamp: 1716334518515,
  },
  {
    imgPath: "db/media/2.png",
    tags: ["fantasy", "Roman Colosseum", "celestial bodies", "silhouette"],
    title: "colosseum-celestial-scene",
    description:
      "Fantasy scene of the Roman Colosseum with two large celestial bodies in the sky and a silhouetted figure.",
    timeStamp: 1716334525578,
  },
  {
    imgPath: "db/media/3.png",
    tags: ["deity", "cosmic", "vibrant", "feast"],
    title: "cosmic-deity-feast",
    description:
      "A six-armed purple deity is surrounded by a vibrant, cosmic scene with various animated figures and a feast table.",
    timeStamp: 1716334533053,
  },
  {
    imgPath: "db/media/1.png",
    tags: ["surreal", "cathedral", "multiple moons", "silhouetted woman"],
    title: "surreal-cathedral-scene",
    description:
      "A surreal scene with a cathedral, multiple moons, a Hummer, and a silhouetted woman.",
    timeStamp: 1716334538995,
  },
];

const filePaths = [
  "db/media/8.png",
  "db/media/9.png",
  "db/media/12.png",
  "db/media/11.png",
  "db/media/10.png",
  "db/media/4.png",
  "db/media/5.png",
  "db/media/7.png",
  "db/media/6.png",
  "db/media/2.png",
  "db/media/3.png",
  "db/media/1.png",
];
export const postImageDetails = async (
  imageDetails: {
    imgPath: string;
    tags: string[];
    title: string;
    description: string;
    timeStamp: number;
  }[]
) => {
  for (const details of imageDetails) {
    try {
      logger.info(`Posting image details: ${JSON.stringify(details)}`);
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

      const responseData = await response.json();
      logger.info("Image posted successfully:", responseData);
    } catch (error) {
      logger.error("Error posting image:", error);
    }
  }
};

// Pass the imageDetails array to the function
postImageDetails(imageDetails);
