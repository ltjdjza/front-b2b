import axios from "axios";

export const getAmazonOrders = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/amazon/orders",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAmazonVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/amazon/ventasporsku",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAmazonVtasPorSkuPagi = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v3/amazon/ventasporsku",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
