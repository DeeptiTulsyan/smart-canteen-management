const axios = require("axios");

const getMenuItemById = async (menuId) => {
  try {
    const response = await axios.get(
      `${process.env.MENU_SERVICE}/menu/${menuId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching menu item:", error.message);
    throw new Error("Menu item not found");
  }
};

module.exports = { getMenuItemById };