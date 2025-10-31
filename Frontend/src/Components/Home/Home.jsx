import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { FaStar, FaHome, FaHeart, FaShoppingBag, FaBell } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DEFAULT_CATEGORY_LABEL = "All";

const formatCurrency = (value) => {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("id-ID").format(Math.max(amount, 0));
};

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY_LABEL);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCardClick = (menuId) => {
    if (!menuId) return;
    navigate(`/menu/${menuId}`);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser?.name) {
        throw new Error("Invalid profile data");
      }
      setUserName(parsedUser.name);
    } catch (error) {
      console.warn("Failed to parse stored user profile:", error);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    const fetchMenuData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [categoryResponse, menuResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/menu`),
        ]);

        if (!categoryResponse.ok) {
          throw new Error("Failed to load categories");
        }
        if (!menuResponse.ok) {
          throw new Error("Failed to load menu items");
        }

        const [categoryPayload, menuPayload] = await Promise.all([
          categoryResponse.json(),
          menuResponse.json(),
        ]);

        if (!Array.isArray(menuPayload)) {
          throw new Error("Menu data is not valid");
        }

        if (!Array.isArray(categoryPayload)) {
          throw new Error("Category data is not valid");
        }

        if (!isMounted) return;

        setCategories(categoryPayload);
        setMenuItems(menuPayload);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
        if (isMounted) {
          setErrorMessage(error.message || "Unable to load menu data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayCategories = useMemo(() => {
    const formatted = categories.map((category) => ({
      id: String(category?.id ?? category?.category_id ?? category?.name ?? ""),
      label: category?.name ?? category?.label ?? "Unknown",
    }));

    return [{ id: DEFAULT_CATEGORY_LABEL, label: DEFAULT_CATEGORY_LABEL }, ...formatted];
  }, [categories]);

  const filteredMenu = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const isDefaultCategory = activeCategory === DEFAULT_CATEGORY_LABEL;

    return menuItems.filter((item) => {
      const matchesCategory =
        isDefaultCategory ||
        String(item?.category_id ?? item?.categoryId ?? "") === activeCategory;

      const matchesSearch =
        !normalizedSearch ||
        item?.name?.toLowerCase().includes(normalizedSearch) ||
        item?.description?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, menuItems, searchTerm]);

  const resolveCategoryLabel = (item) => {
    const categoryId = String(item?.category_id ?? item?.categoryId ?? "");
    const category = displayCategories.find((cat) => cat.id === categoryId);
    return category?.label || item?.type || "Coffee";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1b1b1b] to-black text-white flex flex-col pb-20">
      {/* Header */}
      <div className="px-5 pt-8">
        <p className="text-sm text-gray-400">Welcome</p>
        <h2 className="text-lg font-semibold">
          {userName ? `${userName}'s Coffee Shelf` : "Coffee House"}
        </h2>
      </div>

      {/* Search bar */}
      <div className="flex items-center px-5 mt-6 space-x-3">
        <div className="flex items-center bg-[#2c2c2c] rounded-xl px-4 py-3 flex-1">
          <FiSearch className="text-gray-400 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search coffee"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="bg-transparent w-full outline-none text-sm placeholder-gray-400"
          />
        </div>
        <button className="bg-[#b87346] p-3 rounded-xl">
          <HiOutlineAdjustmentsHorizontal className="text-xl" />
        </button>
      </div>

      {/* Promo Banner */}
      <div className="px-5 mt-6">
        <div className="relative bg-[#b87346] rounded-2xl overflow-hidden p-4">
          <img
            src="/assets/promo_img.png"
            alt="promo"
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
          />
          <span className="bg-red-500 text-xs font-semibold px-2 py-1 rounded-md">
            Promo
          </span>
          <h1 className="text-2xl font-bold mt-3 leading-tight">
            Buy one get one FREE
          </h1>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto px-5 mt-6">
        {displayCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-[#b87346] text-white"
                : "bg-[#2c2c2c] text-gray-300"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="px-5 mt-4 min-h-[24px]">
        {isLoading && <p className="text-sm text-gray-400">Loading menu...</p>}
        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}
      </div>

      {/* Coffee Cards */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-6">
        {filteredMenu.map((coffee) => (
          <div
            key={coffee.id ?? coffee.menu_id}
            onClick={() => handleCardClick(coffee.id)}
            className="bg-[#1e1e1e] rounded-2xl p-3 flex flex-col relative cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={coffee.image_url || coffee.image || "/assets/coffee_placeholder.png"}
                alt={coffee.name}
                className="w-full h-36 rounded-xl object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center bg-black/60 px-2 py-1 rounded-md">
                <FaStar className="text-yellow-400 text-xs mr-1" />
                <span className="text-xs font-semibold">
                  {Number.parseFloat(coffee.rating ?? 4.5).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-base font-semibold">{coffee.name}</h3>
              <p className="text-gray-400 text-sm">
                {resolveCategoryLabel(coffee)}
              </p>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="font-semibold text-white">
                Rp{" "}
                {formatCurrency(
                  Number.parseFloat(coffee.price ?? coffee.cost ?? 0)
                )}
              </span>
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="bg-[#b87346] w-8 h-8 flex items-center justify-center rounded-lg text-white text-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
        {!isLoading && !errorMessage && filteredMenu.length === 0 && (
          <p className="text-sm text-gray-400 col-span-2 text-center">
            No menu items match your filters.
          </p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] py-4 flex justify-around items-center border-t border-gray-800">
        <FaHome className="text-[#b87346] text-2xl" />
        <FaHeart className="text-gray-400 text-xl" />
        <FaShoppingBag className="text-gray-400 text-xl" />
        <FaBell className="text-gray-400 text-xl" />
      </div>
    </div>
  );
};

export default Home;
