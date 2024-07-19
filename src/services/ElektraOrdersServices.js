import axios from "axios";

const apiURL = import.meta.env.VITE_API_ELEKTRA_URL;

export const getElektraOrders = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elektra/orders`,
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

export const getElektraVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elektra/ventasporsku`,
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

export const getElektraVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      `${apiURL}/api/v1/elektra/ventasporsku/semanal`,
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
