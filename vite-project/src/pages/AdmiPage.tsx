import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './admin.css';

interface Product {
  id: string;
  nazev: string;
  popis: string;
  obrazky: string[];
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    nazev: '',
    popis: '',
    obrazky: [],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:5003/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Chyba při načítání produktů:', error));
  }, []);

  const getMaxId = (): string => {
    const maxId = products.reduce(
      (max, product) => (parseInt(product.id) > parseInt(max) ? product.id : max),
      '0'
    );
    return (parseInt(maxId) + 1).toString();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
  
      setSelectedImages((prevSelected) => [...prevSelected, ...newFiles]);
  
      const newFilePreviews = newFiles.map((file) => URL.createObjectURL(file));
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        obrazky: [...prevProduct.obrazky, ...newFilePreviews], 
      }));
    } else {
      alert('Žádný obrázek nebyl vybrán.');
    }
    event.target.value = '';
  };
  
  
  
  
  

  const handleAddProduct = () => {
    if (!newProduct.nazev || !newProduct.popis) {
      alert('Název a popis jsou povinné před nahráním obrázků.');
      return;
    }
  
    if (selectedImages.length > 0) {
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append('image', file, file.name));
  
      fetch(
        `http://localhost:5003/upload?nazev=${encodeURIComponent(newProduct.nazev)}&popis=${encodeURIComponent(newProduct.popis)}`,
        {
          method: 'POST',
          body: formData,
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Chyba při nahrávání obrázků');
          }
          return response.json();
        })
        .then((imagePaths: string[]) => {
          const newId = getMaxId();
          const productWithId = { ...newProduct, id: newId, obrazky: imagePaths };
  
          fetch('http://localhost:5003/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productWithId),
          })
            .then((response) => response.json())
            .then((addedProduct) => {
              setProducts((prevProducts) => [...prevProducts, addedProduct]);
              setNewProduct({ id: '', nazev: '', popis: '', obrazky: [] });
              setSelectedImages([]);
            })
            .catch((error) => console.error('Chyba při přidávání produktu:', error));
        })
        .catch((error) => console.error(error.message));
    } else {
      alert('Vyberte alespoň jeden obrázek.');
    }
  };
  
  const handleUpdateProduct = (id: string) => {
    const existingImages = newProduct.obrazky.filter((image) => !image.startsWith('blob:'));
    const newFiles = selectedImages;
  
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append('image', file, file.name));
  
      fetch(`http://localhost:5003/upload`, { method: 'POST', body: formData })
        .then((response) => {
          if (!response.ok) throw new Error('Chyba při nahrávání obrázků');
          return response.json();
        })
        .then((newImagePaths: string[]) => {
          const updatedProduct = {
            ...newProduct,
            obrazky: [...existingImages, ...newImagePaths],
          };
  
          fetch(`http://localhost:5003/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
          })
            .then((response) => response.json())
            .then((updatedProduct) => {
              setProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.id === id ? updatedProduct : product
                )
              );
              setNewProduct({ id: '', nazev: '', popis: '', obrazky: [] });
              setSelectedImages([]);
            })
            .catch((error) => console.error('Chyba při aktualizaci produktu:', error));
        })
        .catch((error) => console.error(error.message));
    } else {
      const updatedProduct = { ...newProduct, obrazky: existingImages };
  
      fetch(`http://localhost:5003/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })
        .then((response) => response.json())
        .then((updatedProduct) => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === id ? updatedProduct : product
            )
          );
          setNewProduct({ id: '', nazev: '', popis: '', obrazky: [] });
          setSelectedImages([]);
        })
        .catch((error) => console.error('Chyba při aktualizaci produktu:', error));
    }
  };
  
  

  
  const handleDeleteProduct = (id: string) => {
    fetch(`http://localhost:5003/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setNewProduct({ id: '', nazev: '', popis: '', obrazky: [] });
        setSelectedImages([]);
      })
      .catch((error) => console.error('Chyba při odstraňování produktu:', error));
  };
  

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      ...product,
      obrazky: [...product.obrazky], 
    });
  };
  
  return (
    <div className="LogicBody">
      <div className="admin-container">
        <h1 className="admin-title">Admin stránka</h1>
        <p className="admin-message">Vítejte v administrátorské sekci!</p>

        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.nazev}</h2>
              <p>{product.popis}</p>
              <div className="product-images">
                {product.obrazky.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5003/uploads/${image}`}
                    alt={`product-image-${index}`}
                  />
                ))}
              </div>
              <button onClick={() => handleDeleteProduct(product.id)}>
                Odstranit
              </button>
              <button onClick={() => handleEditProduct(product)}>
                Upravit
              </button>
            </div>
          ))}
        </div>

        <div className="product-form">
          <h2>{newProduct.id ? 'Upravit produkt' : 'Přidat nový produkt'}</h2>
          <input
            type="text"
            placeholder="Název produktu"
            value={newProduct.nazev}
            onChange={(e) =>
              setNewProduct({ ...newProduct, nazev: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Popis produktu"
            value={newProduct.popis}
            onChange={(e) =>
              setNewProduct({ ...newProduct, popis: e.target.value })
            }
          />
          <input
            type="file"
            name="image"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
         <div className="image-preview">
  {newProduct.obrazky.map((image, index) => (
    <img
      key={index}
      src={
        image.startsWith('blob:')
          ? image 
          : `http://localhost:5003/uploads/${image}`
      }
      alt={`preview-${index}`}
    />
  ))}
</div>


          <button onClick={newProduct.id ? () => handleUpdateProduct(newProduct.id) : handleAddProduct}>
  {newProduct.id ? 'Upravit produkt' : 'Přidat produkt'}
</button>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;
