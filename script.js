document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed"); // Check if DOMContentLoaded event is fired

  async function fetchImages() {
    try {
      const response = await fetch("http://localhost:3000/testImages");
      if (!response.ok) {
        console.error("Network response was not ok");
        return;
      }
      const images = await response.json();

      console.log("Starting to process images");
      const gridContainer = document.getElementById("imageGrid");
      images.forEach((imageUrl) => {
        console.log(
          `Fetching image from URL: http://localhost:3000${imageUrl}`
        );
        fetch(`http://localhost:3000${imageUrl}`)
          .then((response) => {
            console.log(
              `Received response for URL: http://localhost:3000${imageUrl}`
            );
            if (!response.ok) {
              console.error(
                `Network response was not ok for URL: http://localhost:3000${imageUrl}`
              );
              throw new Error("Network response was not ok");
            }
            return response.blob();
          })
          .then((imageBlob) => {
            console.log(
              `Creating object URL for image blob from URL: http://localhost:3000${imageUrl}`
            );
            const imageObjectURL = URL.createObjectURL(imageBlob);
            const buttonElement = document.createElement("button");
            const imgElement = document.createElement("img");
            imgElement.src = imageObjectURL;
            buttonElement.appendChild(imgElement);
            buttonElement.onclick = () => processImage(imageUrl);

            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");

            const imageName = document.createElement("p");
            imageName.textContent = imageUrl.split("/").pop(); // Extract the image name from the URL
            gridItem.appendChild(imageName);

            gridItem.appendChild(buttonElement);

            const jsonDataElement = document.createElement("div");
            jsonDataElement.classList.add("json-data");
            gridItem.appendChild(jsonDataElement);

            gridContainer.appendChild(gridItem);
            console.log(
              `Appended image to grid container from URL: http://localhost:3000${imageUrl}`
            );

            // Fetch and display JSON data if it exists
            const jsonFilePath = `/db/testImages/${imageUrl
              .split("/")
              .pop()}.json`;
            fetch(jsonFilePath)
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("JSON file not found");
              })
              .then((jsonData) => {
                const jsonContent = `
                                    <span>Title:</span><span class="title">${
                                      jsonData[0].title
                                    }</span>
                                    <span>Tags:</span><span class="tags">${jsonData[0].tags.join(
                                      ", "
                                    )}</span>
                                    <span>Description:</span><span class="description">${
                                      jsonData[0].description
                                    }</span>
                                `;
                jsonDataElement.innerHTML = jsonContent;
              })
              .catch((error) =>
                console.log("No JSON data found for this image:", error)
              );
          })
          .catch((error) => console.error("Error fetching image:", error));
      });
      console.log("Finished processing images");
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  async function fetchDbData() {
    try {
      const response = await fetch("http://127.0.0.1:3000/db");
      if (!response.ok) {
        console.error("Network response was not ok");
        return;
      }
      const dbData = await response.json();
      console.log("DB Data:", dbData);
    } catch (error) {
      console.error("Error fetching DB data:", error);
    }
  }

  fetchImages();
  fetchDbData();
});

async function processImage(imageUrl) {
  try {
    const response = await fetch("http://localhost:3000/processImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgPath: imageUrl }),
    });
    if (!response.ok) {
      console.error("Network response was not ok");
      return;
    }
    console.log("Image processed successfully");
  } catch (error) {
    console.error("Error processing image:", error);
  }
}
