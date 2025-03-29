"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import './styles.css'; // Assurez-vous de lier le fichier CSS dans votre projet

export default function EcommerceDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // Stocke le token dans un état
  const [products, setProducts] = useState<any[]>([]);
  const [productTitle, setProductTitle] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);  // Définir l'état showModal

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchProducts();
    } else {
      router.push("/login");
    }
  }, []);


  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://elipt-test-api.onrender.com/Product/getProduct", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits", error);
    }
  };

  const uploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "your_upload_preset");

    const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", formData);
    return uploadResponse.data.secure_url;
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Télécharge l'image et obtient l'URL de l'image
      const imageUrl = await uploadImage(productImage);

      // Envoie la requête pour créer un produit
      const response = await axios.post(
        "https://elipt-test-api.onrender.com/Product/Create",
        {
          title: productTitle,           // Titre du produit
          description: productDescription, // Description du produit
          image: imageUrl,                // URL de l'image téléchargée
          price: productPrice,            // Prix du produit
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Utilisation du token pour l'authentification
        }
      );

      setLoading(false);
      fetchProducts(); // Récupère la liste des produits après la création
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors de la création du produit", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`https://elipt-test-api.onrender.com/Product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://elipt-test-api.onrender.com/AppUsers/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <div className="container">
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Dashboard</h2>
          <ul>
            <li><a href="#">Tableau de bord</a></li>
            <li><a href="#">Produits</a></li>
            <li><a href="#">Commandes</a></li>
            <li><a href="#">Profil</a></li>
            <li><button onClick={handleLogout} className="logout-button">Se déconnecter</button></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <h1>Gestion des produits</h1>
            <button onClick={() => setShowModal(true)} className="add-product-button">Ajouter un produit</button>
          </div>

          {/* Products Table */}
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><img src={product.image} alt={product.title} className="product-image" /></td>
                  <td>{product.title}</td>
                  <td>{product.price} €</td>
                  <td>
                    <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Ajouter un produit</h2>
              <form onSubmit={handleCreateProduct}>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Nom du produit"
                  required
                />
                <input
                  type="text"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Description"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setProductImage(e.target.files![0])}
                  required
                />
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                  placeholder="Prix"
                  required
                />
                <div className="modal-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="submit-button">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
