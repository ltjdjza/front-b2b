import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { useState } from "react";

const VtasPorSkuChart = (ventasPorSku) => {
  //console.log(ventasPorSku.ventasPorSku);
  //Ordeno el array de mayor a menor
  const ventasPorSkuOrdenadas = [...ventasPorSku.ventasPorSku].sort(
    (a, b) => b.piezasVendidas - a.piezasVendidas
  );
  const [paginaActual, setPaginaActual] = useState(0);
  const skusPorPagina = 10;

  //calcula el numero de paginas
  const totalPaginas = Math.ceil(
    ventasPorSkuOrdenadas.length / skusPorPagina
  );

  //funcion para avanzar pagina
  const siguientePagina = () => {
    setPaginaActual((prev) => (prev + 1 < totalPaginas ? prev + 1 : prev));
  };
  const paginaAnterior = () => {
    setPaginaActual((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  const skus = ventasPorSkuOrdenadas
    .slice(paginaActual * skusPorPagina, (paginaActual + 1) * skusPorPagina)
    .map((sku) => sku.sku);
  const ventas = ventasPorSkuOrdenadas
    .slice(paginaActual * skusPorPagina, (paginaActual + 1) * skusPorPagina)
    .map((sku) => sku.piezasVendidas);

  //configuraciones de la grafica
  let state = {
    series: [
      {
        data: ventas,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled : true,
        formatter: function (val) {
          return val;
        },
      },
      xaxis: {
        categories: skus,
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
      <div>
        <button onClick={paginaAnterior} disabled={paginaActual === 0}>
          Anterior
        </button>
        <button
          onClick={siguientePagina}
          disabled={paginaActual + 1 === totalPaginas}
        >
          Siguiente
        </button>
      </div>

      <div id="html-dist"></div>
    </div>
  );
};

VtasPorSkuChart.propTypes = {
  ventasPorSku: PropTypes.array,
};

export default VtasPorSkuChart;
