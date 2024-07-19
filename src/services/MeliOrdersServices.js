import axios from "axios";

const apiURL = import.meta.env.VITE_API_MELI_URL;

export const getMeliOrders = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/meli/orders`,
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

export const getMeliVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v2/meli/ventasporsku`,
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

export const getMeliVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/meli/ventasporsku/semanal`,
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
