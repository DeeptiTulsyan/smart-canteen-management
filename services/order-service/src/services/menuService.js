const axios = require("axios");

const getMenuItemById = async (menuId) => {
  try {
    const response = await axios.get(
      `${process.env.MENU_SERVICE}/api/menu/${menuId}`
    );

    const menuItem = response.data;

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (menuItem.isAvailable === false) {
      throw new Error("Menu item is currently unavailable");
    }

    return {
      _id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      isAvailable: menuItem.isAvailable
    };
  } catch (error) {
    console.error("Error fetching menu item:", error.message);
    throw new Error(error.response?.data?.message || "Menu item not found");
  }
};

module.exports = { getMenuItemById };