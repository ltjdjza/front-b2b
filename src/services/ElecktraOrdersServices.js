import axios from "axios";

export const getElecktraOrders = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/elecktra/orders",
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

export const getElecktraVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/elecktra/ventasporsku",
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

export const getElecktraVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/elecktra/ventasporsku/semanal",
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
