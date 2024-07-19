import axios from "axios";

export const getWalmartOrders = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/walmart/orders",
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

export const getWalmartVtasPorSku = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/walmart/ventasporsku",
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

export const getWalmartVtasPorSkuSemanal = async (params) => {
  try {
    const { data } = await axios.get(
      "http://localhost:8000/api/v1/walmart/ventasporsku/semanal",
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
