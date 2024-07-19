import axios from "axios";

const apiURL = import.meta.env.VITE_API_AMAZON_URL;

export const getAmazonOrders = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/amazon/orders`,
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
      `${apiURL}/api/v6/amazon/ventasporsku`,
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

export const getAmazonVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v2/amazon/ventasporsku/semanal`,
      {
        params,
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
