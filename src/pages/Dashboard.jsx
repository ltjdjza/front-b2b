import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VtasChart from "../components/features/VtasChart";
import { formatDate, withLoader } from "../utils/helpers";
import { getAmazonOrders } from "../services/AmazonOrdersServices";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const Dashboard = () => {
  //fecha inicial un mes atras
  const [fechaInicial, setFechaInicial] = useState(
    dayjs().subtract(1, "month")
  );
  //fecha final hoy
  const [fechaFinal, setFechaFinal] = useState(dayjs());
  const [ventas, setVentas] = useState([]); //VENTAS
  const [limit, setLimit] = useState(10); //limite de ventas por pagina
  const [page, setPage] = useState(1); //pagina actual
  const [totalPages, setTotalPages] = useState(1); //total de paginas que se traduce como el total de ventas
  const [total, setTotal] = useState(0); //total de ventas

  const [params, setParams] = useState({
    startDate: "",
    endDate: "",
    filters: "",
    sortField: "order_status",
    sortOrder: "asc",
    limit,
    page,
  });

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
    //Escuchar mensajes del backend
    socket.on("newOrder", (data) => {
      console.log(data);
      fetchAmazonOrders();
    });

    //Limpiar efecto
    return () => {
      socket.off("newOrder");
    };
  }, [fechaFinal, fechaInicial, page, limit]);

  const fetchAmazonOrders = async () => {
    const data = await withLoader(getAmazonOrders(params));
    console.log(data);
    setVentas(data.orders);
    setTotalPages(data.totalPages);
    setTotal(data.total);
  };

  return (
    <Container maxWidth="xxl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha Inicial"
              value={fechaInicial}
              onChange={(newValue) => {
                console.log(newValue);
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
                console.log(newValue);
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
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <VtasChart
              startDate={formatDate(fechaInicial)}
              endDate={formatDate(fechaFinal)}
              categories={marketPlaces}
              data={[total, 0, 0, 0, 0]}
            />
          </Box>
        </Grid2>
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <h2>Productos Mas Vendidos</h2>
            <p>1000</p>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Dashboard;
