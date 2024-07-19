import axios from "axios";

const apiURL = import.meta.env.VITE_API_ELENAS_URL;

export const getElenasOrders = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elenas/orders`,
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

export const getElenasVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elenas/ventasporsku`,
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

export const getElenasVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elenas/ventasporsku/semanal`,
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
