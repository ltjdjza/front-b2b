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
import { getElektraOrders } from "../services/ElektraOrdersServices";
import { getElenasOrders } from "../services/ElenasOrdersServices";
import { getMeliOrders, getMeliVtasPorSku } from "../services/MeliOrdersServices";
import TableVtasMeli from "../components/features/TableVtasMeli";
import { getWalmartOrders } from "../services/WalmartOrdersServices";

const socket = io("http://localhost:8000");
const socket2 = io("http://localhost:8001");
const socketElenas = io(import.meta.env.VITE_ELENAS_URL);
const socketMeli = io(import.meta.env.VITE_MELI_URL);

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
  const [skuSelectedMeli, setSkuSelectedMeli] = useState(""); //sku seleccionado meli

  const [ventasElektra, setVentasElektra] = useState([]); //VENTAS
  const [totalPagesElektra, setTotalPagesElektra] = useState(1); //total de paginas
  const [totalElektra, setTotalElektra] = useState(0); //total de ventas
  const [totalVentasElektra, setTotalVentasElektra] = useState(0); //total de ventas de amazon

  const [ventasElenas, setVentasElenas] = useState([]); //VENTAS
  const [totalPagesElenas, setTotalPagesElenas] = useState(1); //total de paginas
  const [totalElenas, setTotalElenas] = useState(0); //total de ventas
  const [totalVentasElenas, setTotalVentasElenas] = useState(0); //total de ventas de amazon

  const [ventasMeli, setVentasMeli] = useState([]); //VENTAS
  const [totalPagesMeli, setTotalPagesMeli] = useState(1); //total de paginas
  const [totalMeli, setTotalMeli] = useState(0); //total de ventas
  const [totalVentasMeli, setTotalVentasMeli] = useState(0); //total de ventas de amazon
  const [ventasPorSKUMeli, setVentasPorSKUMeli] = useState([]); //ventas por sku

  const [ventasWalmart, setVentasWalmart] = useState([]); //VENTAS
  const [totalPagesWalmart, setTotalPagesWalmart] = useState(1); //total de paginas
  const [totalWalmart, setTotalWalmart] = useState(0); //total de ventas
  const [totalVentasWalmart, setTotalVentasWalmart] = useState(0); //total de ventas de amazon
  const [ventasPorSKUWalmart, setVentasPorSKUWalmart] = useState([]); //ventas por sku


  const [params, setParams] = useState({
    startDate: formatDate(fechaInicial),
    endDate: formatDate(fechaFinal),
    filters: "order_status:paid",
    sortField: "order_status",
    sortOrder: "asc",
    limit,
    page,
  });

  const selectSku = (sku) => {
    setSkuSelected(sku);
  };

  const selectSkuMeli = (sku) => {
    setSkuSelectedMeli(sku);
  };

  const marketPlaces = [
    "Amazon",
    "Elektra",
    "Elenas",
    "Meli",
    "Walmart",
  ]; //marketplaces para mostrar en la grafica

  useEffect(() => {
    //traer las ventas de amazon
    fetchAmazonOrders();
    fetchVentasPorSku();
    fetchElektraOrders();
    fetchElenasOrders();
    fetchMeliOrders();
    fetchVentasPorSkuMeli();
    fetchWalmartOrders();
    //Escuchar mensajes del backend
    socket.on("newOrder", (data) => {
      console.log(data);
      fetchAmazonOrders();
      fetchVentasPorSku();
    });

    socket2.on("newOrder", (data) => {
      console.log(data);
      fetchElektraOrders();
    });

    socketElenas.on("newOrder", (data) => {
      console.log(data);
      fetchElenasOrders();
    });

    socketMeli.on("newOrder", (data) => {
      console.log(data);
      fetchMeliOrders();
    });

    //Limpiar efecto
    return () => {
      socket.off("newOrder");
      socket2.off("newOrder");
      socketElenas.off("newOrder");
      socketMeli.off("newOrder");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaFinal, fechaInicial]);

  const fetchAmazonOrders = async () => {
    const data = await withLoader(getAmazonOrders(params));
    setVentas(data.orders);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setTotalVentasAmazon(data.totalVentas);
  };

  const fetchElektraOrders = async () => {
    const data = await getElektraOrders(params);
    console.log(data);
    setVentasElektra(data.orders);
    setTotalPagesElektra(data.totalPages);
    setTotalElektra(data.total);
    setTotalVentasElektra(data.totalVentas);
  };

  const fetchElenasOrders = async () => {
    const data = await getElenasOrders({
      startDate: params.startDate,
      endDate: params.endDate,
      filters: "status:Completed",
      sortField: "status",
      sortOrder: "asc",
      limit,
      page,
    });
    console.log(data);
    setVentasElenas(data.orders);
    setTotalPagesElenas(data.totalPages);
    setTotalElenas(data.total);
    setTotalVentasElenas(data.totalVentas);
  };

  const fetchMeliOrders = async () => {
    const data = await getMeliOrders({
      startDate: params.startDate,
      endDate: params.endDate,
      filters: "shipping_status:ready_to_ship",
      sortField: "date",
      sortOrder: "asc",
      limit,
      page,
    });
    // console.log(params);
    // console.log(data);
    setVentasMeli(data.orders);
    setTotalPagesMeli(data.totalPages);
    setTotalMeli(data.total);
    setTotalVentasMeli(data.totalVentas);
  };

  const fetchWalmartOrders = async () => {
    const data = await withLoader(getWalmartOrders(params));
    setVentasWalmart(data.orders);
    setTotalPagesWalmart(data.totalPages);
    setTotalWalmart(data.total);
    setTotalVentasWalmart(data.totalVentas);
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

  const fetchVentasPorSkuMeli = async () => {
    const data = await withLoader(
      getMeliVtasPorSku({
        startDate: formatDate(fechaInicial),
        endDate: formatDate(fechaFinal),
      })
    );
    console.log(data.ventasPorSKU);
    setVentasPorSKUMeli(data.ventasPorSKU);
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
                data={[totalVentasAmazon, totalVentasElektra, totalVentasElenas, totalVentasMeli, 0]}
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
      {/* Grid 4 */}
      <Grid2 container spacing={2} sx={{ alignItems: "center" }}>
        {ventasPorSKUMeli && (
          <Grid2 xs={8}>
            <Box sx={{ textAlign: "center", padding: 0 }}>
              <TableVtasMeli
                ventasPorSKUMeli={ventasPorSKUMeli}
                fechaInicial={formatDate(fechaInicial)}
                fechaFinal={formatDate(fechaFinal)}
                setFechaInicial={setFechaInicial}
                setFechaFinal={setFechaFinal}
                marketplace={"Mercado libre"}
                sx={{ height: "100%" }}
                onSkuSelectedMeli={selectSkuMeli}
              />
            </Box>
          </Grid2>
        )}
        <Grid2 xs={4}>
          <Box sx={{ textAlign: "center", padding: 0 }}>
            <VtasPorSkuSemanal sku={skuSelectedMeli} />
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Dashboard;
