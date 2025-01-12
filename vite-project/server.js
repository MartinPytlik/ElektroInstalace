import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { log } from 'console';


const app = express();
const port = 5003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json()); 

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const readDb = () => {
  if (fs.existsSync('db.json')) {

    try {
      const data = fs.readFileSync('db.json');

      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading db.json:', error);
      return [];
    }
  }
  return [];
};

const writeDb = (data) => {
  try {
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};


app.post('/upload', upload.array('image'), (req, res) => {
  const db = readDb();

  const nazev = req.query.nazev || '';
  const popis = req.query.popis || '';
  console.log('Nazev je', nazev );
  console.log('Popis je', popis);

  const fileNames = req.files.map((file) => file.originalname);
  
  const existingProduct = db.products.find(product => 
    product.nazev === nazev && 
    product.obrazky.length === fileNames.length &&
    product.obrazky.every(image => fileNames.includes(image))
  );

  if (existingProduct) {
    return res.status(400).json({ error: 'Produkt s těmito obrázky již existuje.' });
  }

  try {
    const maxId = db.products.reduce(
      (max, product) => (parseInt(product.id) > parseInt(max) ? product.id : max),
      '0'
    );
    const newProduct = {
      id: (parseInt(maxId) + 1).toString(),  
      nazev,
      popis,
      obrazky: fileNames,
    };

    db.products.push(newProduct);
    writeDb(db);
    cleanDb();
    res.status(201).json(fileNames);
  } catch (error) {
    console.error('Chyba při ukládání do DB:', error);
    res.status(500).send('Chyba serveru.');
  }
});



app.get('/products', (req, res) => {
  const db = readDb();
  res.json(db.products);
});

app.delete('/products/:id', (req, res) => {
  console.log('DELETE request received with ID:', req.params.id);

  const db = readDb();
  
  const filteredProducts = db.products.filter((product) =>
    (product.id !== req.params.id.toString())
    );
    console.log('Deleting ID:', req.params.id.toString());
console.log('Product IDs:', db.products.map((product) => product.id));


  db.products = filteredProducts;
  writeDb(db);
  cleanDb();
  res.status(200).json({ message: 'Product deleted' });
});

app.post('/products', (req, res) => {
  const db = readDb();
  const newProduct = req.body;

  if (!newProduct.nazev || !newProduct.popis || !newProduct.obrazky) {
    return res.status(400).json({ error: 'Název, popis a obrázky jsou povinné.' });
  }

  const existingProductIndex = db.products.findIndex(product => product.id === newProduct.id);
  
  if (existingProductIndex !== -1) {
    db.products.splice(existingProductIndex, 1);
  }

  db.products.push(newProduct);
  writeDb(db);
  cleanDb();
  res.status(201).json(newProduct);
});
const cleanDb = () => {
  const db = readDb();
  const initialLength = db.products.length;
  
  const filteredProducts = db.products.filter(product => product.nazev.trim() && product.popis.trim());
  console.log("---------> mazu");
  console.log(filteredProducts.id);
  if (filteredProducts.length !== initialLength) {
    db.products = filteredProducts;
    console.log(`Cleaned db.json: Removed ${initialLength - filteredProducts.length} invalid products`);
    writeDb(db); 
  } else {
    console.log('No products removed during cleanDb');
  }
};


app.put('/products/:id', (req, res) => {
  const db = readDb();
  const productId = req.params.id;
  const updatedProduct = req.body;
  console.log("Product id", productId);
  console.log("Updatovanej product", updatedProduct)
  if (!updatedProduct.nazev || !updatedProduct.popis) {
    return res.status(400).json({ error: 'Název a popis jsou povinné' });
  }

  const productIndex = db.products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produkt nenalezen' });
  }

  db.products[productIndex] = { ...db.products[productIndex], ...updatedProduct };
  writeDb(db);
  cleanDb();
  res.status(200).json(db.products[productIndex]); 
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
