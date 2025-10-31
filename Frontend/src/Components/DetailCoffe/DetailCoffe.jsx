import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaStar,
  FaTruck,
  FaCoffee,
  FaGlassWhiskey,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatCurrency = (value) => {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("id-ID").format(Math.max(amount, 0));
};

const DetailCoffee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");
  const [menuItem, setMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!id) {
      navigate("/home", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchMenuItem = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Menu item not found");
          }
          throw new Error("Failed to load menu detail");
        }

        const payload = await response.json();
        if (!isMounted) return;

        setMenuItem(payload);
      } catch (error) {
        console.error("Failed to fetch menu detail:", error);
        if (isMounted) {
          setErrorMessage(error.message || "Unable to load menu detail.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMenuItem();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const descriptionPreview = useMemo(() => {
    if (!menuItem?.description) {
      return "No description available for this coffee.";
    }
    if (menuItem.description.length <= 180) {
      return menuItem.description;
    }
    return `${menuItem.description.slice(0, 177)}...`;
  }, [menuItem]);

  const ratingValue = useMemo(() => {
    const rating = Number.parseFloat(menuItem?.rating ?? 0);
    return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "4.5";
  }, [menuItem]);

  const reviewCount = useMemo(() => {
    const reviews = Number.parseInt(menuItem?.reviews ?? menuItem?.review_count ?? 0, 10);
    return Number.isFinite(reviews) && reviews > 0 ? reviews : 120;
  }, [menuItem]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] text-[#1a1a1a] flex flex-col items-center justify-center">
        <p className="text-[#b87346] text-lg font-semibold animate-pulse">Loading coffee details...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] text-[#1a1a1a] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-red-500 text-lg font-semibold mb-4">{errorMessage}</p>
        <button
          type="button"
          onClick={() => navigate("/home", { replace: true })}
          className="bg-[#b87346] hover:bg-[#a1623f] text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const serveType = menuItem?.type || menuItem?.serve_type || menuItem?.category || "Specialty Coffee";
  const imageSrc = menuItem?.image_url || menuItem?.image || "/assets/coffee_placeholder.png";
  const priceValue = Number.parseFloat(menuItem?.price ?? menuItem?.cost ?? 0);

  return (
    <div className="min-h-screen bg-[#f7f5f3] text-[#1a1a1a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Detail</h1>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <FaHeart className="text-xl text-gray-700" />
        </button>
      </div>

      {/* Coffee Image */}
      <div className="px-5 mt-4">
        <img
          src={imageSrc}
          alt={menuItem?.name}
          className="w-full h-56 object-cover rounded-2xl"
        />
      </div>

      {/* Coffee Info */}
      <div className="px-5 mt-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{menuItem?.name}</h2>
          <p className="text-gray-500 text-sm">{serveType}</p>

          <div className="flex items-center mt-2 text-sm">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{ratingValue}</span>
            <span className="text-gray-400 ml-1">({reviewCount})</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="bg-[#fff6f1] p-3 rounded-xl">
            <FaTruck className="text-[#b87346]" />
          </div>
          <div className="bg-[#fff6f1] p-3 rounded-xl">
            <FaCoffee className="text-[#b87346]" />
          </div>
          <div className="bg-[#fff6f1] p-3 rounded-xl">
            <FaGlassWhiskey className="text-[#b87346]" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 mt-5">
        <h3 className="font-semibold text-base">Description</h3>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          {descriptionPreview}
          {menuItem?.description && menuItem.description.length > 180 && (
            <button
              type="button"
              onClick={() => window.alert(menuItem.description)}
              className="text-[#b87346] font-medium cursor-pointer ml-1"
            >
              Read More
            </button>
          )}
        </p>
      </div>

      {/* Size Selection */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-base mb-3">Size</h3>
        <div className="flex gap-3">
          {["S", "M", "L"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`w-14 py-2 rounded-lg border text-sm font-semibold ${
                selectedSize === size
                  ? "bg-[#fff6f1] border-[#b87346] text-[#b87346]"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price & Button */}
      <div className="mt-auto bg-white px-5 py-5 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-xl font-semibold text-[#b87346]">
              Rp {formatCurrency(priceValue)}
            </p>
          </div>
          <button className="bg-[#b87346] hover:bg-[#a1623f] text-white py-3 px-12 rounded-xl font-semibold transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCoffee;
