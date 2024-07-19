import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VtasChart from "../components/features/VtasChart";
import { formatDate, withLoader } from "../utils/helpers";
import {
  getAmazonOrders,
  getAmazonVtasPorSku,
} from "../services/AmazonOrdersServices";
import io from "socket.io-client";
import VtasPorSkuChart from "../components/features/VtasPorSkuChart";
import TableVtas from "../components/common/TableVtas";
import VtasPorSkuSemanal from "../components/features/VtasPorSkuSemanal";

const socket = io("http://localhost:8000");

const Dashboard = () => {
  //fecha inicial un mes atras
  const [fechaInicial, setFechaInicial] = useState(
    dayjs().subtract(1, "month")
  );
  const [fechaFinal, setFechaFinal] = useState(dayjs()); //fecha final hoy
  const [ventas, setVentas] = useState([]); //VENTAS
  const [limit, setLimit] = useState(10); //limite de ventas por pagina
  const [page, setPage] = useState(1); //pagina actual
  const [totalPages, setTotalPages] = useState(1); //total de paginas
  const [total, setTotal] = useState(0); //total de ventas
  const [ventasPorSKU, setVentasPorSKU] = useState([]); //ventas por sku
  const [totalVentasAmazon, setTotalVentasAmazon] = useState(0); //total de ventas de amazon
  const [skuSelected, setSkuSelected] = useState(""); //sku seleccionado

  const [params, setParams] = useState({
    startDate: "",
    endDate: "",
    filters: "order_status:paid",
    sortField: "order_status",
    sortOrder: "asc",
    limit,
    page,
  });

  const selectSku = (sku) => {
    setSkuSelected(sku);
  };

  const marketPlaces = [
    "Amazon",
    "Ebay",
    "Shopify",
    "Walmart",
    "Mercado Libre",
  ]; //marketplaces para mostrar en la grafica

  useEffect(() => {
    //traer las ventas de amazon
    fetchAmazonOrders();
    fetchVentasPorSku();
    //Escuchar mensajes del backend
    socket.on("newOrder", (data) => {
      console.log(data);
      fetchAmazonOrders();
      fetchVentasPorSku();
    });

    //Limpiar efecto
    return () => {
      socket.off("newOrder");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaFinal, fechaInicial, page, limit]);

  const fetchAmazonOrders = async () => {
    const data = await withLoader(getAmazonOrders(params));
    setVentas(data.orders);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setTotalVentasAmazon(data.totalVentas);
  };

  const fetchVentasPorSku = async () => {
    const data = await withLoader(
      getAmazonVtasPorSku({
        startDate: formatDate(fechaInicial),
        endDate: formatDate(fechaFinal),
      })
    );
    setVentasPorSKU(data.ventasPorSKU);
  };

  return (
    <Container maxWidth="xxl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000, //para que se vea por encima de los demas elementos
          backgroundColor: "white",
        }}
        id="dashboard"
      >
        <h1>Dashboard</h1>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha Inicial"
              value={fechaInicial}
              onChange={(newValue) => {
                setFechaInicial(newValue);
                console.log(formatDate(newValue));
                setParams({
                  ...params,
                  startDate: formatDate(newValue),
                });
              }}
            />
            <DatePicker
              label="Fecha Final"
              value={fechaFinal}
              onChange={(newValue) => {
                setFechaFinal(newValue);
                console.log(formatDate(newValue));
                setParams({
                  ...params,
                  endDate: formatDate(newValue),
                });
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      {/* Grid 1 */}
      <Grid2 container spacing={3} sx={{ alignItems: "center" }}>
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <h2>Ventas Totales</h2>
            <p>{total}</p>
          </Box>
        </Grid2>
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <h2>Margen</h2>
            <p>1000</p>
          </Box>
        </Grid2>
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <h2>Mejor Plataforma</h2>
            <p>Amazon</p>
          </Box>
        </Grid2>
      </Grid2>
      {/* Grid 2 */}
      <Grid2 container spacing={2} sx={{ alignItems: "center" }}>
        <Grid2 xs={8}>
          {total && (
            <Box sx={{ textAlign: "center", padding: 0 }}>
              <VtasChart
                startDate={formatDate(fechaInicial)}
                endDate={formatDate(fechaFinal)}
                categories={marketPlaces}
                data={[totalVentasAmazon, 0, 0, 0, 0]}
              />
            </Box>
          )}
        </Grid2>
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <VtasPorSkuChart ventasPorSku={ventasPorSKU} />
          </Box>
        </Grid2>
      </Grid2>
      {/* Grid 3 */}
      <Grid2 container spacing={2} sx={{ alignItems: "center" }}>
        {ventasPorSKU && (
          <Grid2 xs={8}>
            <Box sx={{ textAlign: "center", padding: 0 }}>
              <TableVtas
                ventasPorSKU={ventasPorSKU}
                fechaInicial={formatDate(fechaInicial)}
                fechaFinal={formatDate(fechaFinal)}
                setFechaInicial={setFechaInicial}
                setFechaFinal={setFechaFinal}
                marketplace={"Amazon"}
                sx={{ height: "100%" }}
                onSkuSelected={selectSku}
              />
            </Box>
          </Grid2>
        )}
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <VtasPorSkuSemanal sku={skuSelected} />
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Dashboard;
