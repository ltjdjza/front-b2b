import ReactApexChart from "react-apexcharts";
import { getAmazonVtasPorSkuSemanal } from "../../services/AmazonOrdersServices";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const VtasPorSkuSemanal = ({ sku }) => {
  //const [sku, setSku] = useState("bici-az");
  const [data, setData] = useState([]);

  const [series, setSeries] = useState([
    {
      name: "Total Ventas",
      data: [],
    },
    {
      name: "Piezas Vendidas",
      data: [],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    xaxis: {
      categories: [],
    },
    yaxis: [
      {
        title: {
          text: "Total Ventas",
        },
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Piezas Vendidas",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

  const fetchVtasPorSkuSemanal = async () => {
    const response = await getAmazonVtasPorSkuSemanal({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 dias antes
      endDate: new Date().toISOString().split("T")[0],
      sku,
    });
    return response;
  };

  useEffect(() => {
    fetchVtasPorSkuSemanal().then((data) => {
      setData(data);
    });
    const categories = Object.keys(data);
    const totalVentasData = [];
    const piezasVendidasData = [];

    categories.forEach((category) => {
      const dayData = data[category];
      if (dayData.length > 0) {
        totalVentasData.push(dayData[0].totalVentas);
        piezasVendidasData.push(dayData[0].piezasVendidas);
      } else {
        totalVentasData.push(0);
        piezasVendidasData.push(0);
      }
    });

    setSeries([
      { name: "Total Ventas", data: totalVentasData },
      { name: "Piezas Vendidas", data: piezasVendidasData },
    ]);
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { ...prevOptions.xaxis, categories: categories },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku]);

  return (
    <div id="chart">
      {sku}
      <ReactApexChart options={options} series={series} type="line" />
    </div>
  );
};

VtasPorSkuSemanal.propTypes = {
  sku: PropTypes.string,
};

export default VtasPorSkuSemanal;
