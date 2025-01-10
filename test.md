// Mock database
let items = [];
let currentId = 1;

// Create an item
app.post("/items", (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }
  const newItem = { id: currentId++, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Read all items
app.get("/items", (req, res) => {
  res.json(items);
});

// Read a single item by ID
app.get("/items/:id", (req, res) => {
  const { id } = req.params;
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }
  res.json(item);
});

// Update an item by ID
app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }
  if (name) item.name = name;
  if (description) item.description = description;
  res.json(item);
});

// Delete an item by ID
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex((i) => i.id === parseInt(id));
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found." });
  }
  items.splice(itemIndex, 1);
  res.status(204).send();
});