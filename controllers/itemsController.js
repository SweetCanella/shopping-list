const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/items.json');

const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

const getAllItems = (req, res) => {
  const items = readData();
  res.json(items);
};

const getItemById = (req, res) => {
  const items = readData();
  const id = parseInt(req.params.id);
  
  const item = items.find(item => item.id === id);
  
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Покупка не найдена' });
  }
};

const addItem = (req, res) => {
  const items = readData();

  if (!req.body.name) {
    return res.status(400).json({ error: 'Необходимо указать название покупки' });
  }

  const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

  const newItem = {
    id: newId,
    name: req.body.name,
    quantity: req.body.quantity || 1,
    purchased: false
  };

  items.push(newItem);

  writeData(items);
  
  res.status(201).json(newItem);
};

const updateItem = (req, res) => {
  const items = readData();
  const id = parseInt(req.params.id);

  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Покупка не найдена' });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    ...req.body
  };

  writeData(items);
  
  res.json(items[itemIndex]);
};

const deleteItem = (req, res) => {
  const items = readData();
  const id = parseInt(req.params.id);

  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Покупка не найдена' });
  }

  const deletedItem = items.splice(itemIndex, 1)[0];
  
  writeData(items);
  
  res.json({ message: 'Покупка удалена', item: deletedItem });
};

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem
};