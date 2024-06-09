import TSNE from "tsne-js";

const data = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  // Add more data points here...
];

// Create a t-SNE instance and configure it
const model = new TSNE({
  dim: 2,
  perplexity: 30,
  earlyExaggeration: 4.0,
  learningRate: 100,
  nIter: 1000,
  metric: "euclidean",
});

// Initialize the data
model.init({
  data: data,
  type: "dense",
});

// Run the t-SNE algorithm
model.run();

// Get the output in the form of [x, y] coordinates
const result = model.getOutput();
console.log(result);
