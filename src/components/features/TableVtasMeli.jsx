import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import { auto } from "@popperjs/core";
import { useState } from "react";
import Container from "@mui/material/Container";
import { TextField } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { formatMoney } from "../../utils/helpers";

const TableVtasMeli = (props) => {
  //console.log(props);
  const { ventasPorSKUMeli, marketplace, onSkuSelectedMeli } = props;//arreglo de ventas por sku
  const [sortConfig, setSortConfig] = useState({
    key: "sku",
    direction: "asc",
  });//para intercambiar la direccion de la fecha del sorter
  const [searchText, setSearchText] = useState("");//sku a buscar
  const [filteredVentas, setFilteredVentas] = useState([]);//ventasporskuMelifiltradas

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);//se le asigna valor al campo de texto

    if (event.target.value === "") {//si el campo esta vacio limpian las ventas filtradas
      setFilteredVentas([]);
    }
  };

  const handleSort = (key) => {
    //limpiar el search text
    setSearchText("");
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    if (filteredVentas.length > 0) {
      const sorted = ventasPorSKUMeli.sort((a, b) => {
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });
      setFilteredVentas(sorted);
    } else {
      ventasPorSKUMeli.sort((a, b) => {
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const filtered = ventasPorSKUMeli.filter((venta) =>
        venta.sku.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredVentas(filtered);
    }
  };

  return (
    <Container maxWidth="lg">
      <h3 style={{ textAlign: "center", margin: "0" }}>
        Ventas por SKU en {marketplace}
      </h3>
      <TextField
        id="outlined-basic"
        label="Buscar SKU"
        variant="outlined"
        fullWidth
        margin="normal"
        size="small"
        style={{ margin: "0 0 1rem 0" }}
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleSearch}
      />
      <TableContainer
        component={Paper}
        style={{ maxHeight: 440, overflow: "auto", maxWidth: auto }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            style={{
              backgroundColor: "#f5f5f5",
              position: "sticky",
              top: 0,
            }}
          >
            <TableRow>
              <TableCell>
                SKU
                <IconButton onClick={() => handleSort("sku")}>
                  {sortConfig.key === "sku" &&
                  sortConfig.direction === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </TableCell>
              <TableCell align="right" style={{ whiteSpace: "pre-line" }}>
                Piezas Vendidas
                <IconButton onClick={() => handleSort("piezasVendidas")}>
                  {sortConfig.key === "piezasVendidas" &&
                  sortConfig.direction === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </TableCell>
              <TableCell align="right">
                Total Ventas
                <IconButton onClick={() => handleSort("totalVentas")}>
                  {sortConfig.key === "totalVentas" &&
                  sortConfig.direction === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </TableCell>
              <TableCell align="right">
                Ticket Promedio
                <IconButton onClick={() => handleSort("ticketPromedio")}>
                  {sortConfig.key === "ticketPromedio" &&
                  sortConfig.direction === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas?.length > 0 && searchText.length > 0
              ? filteredVentas?.map((row) => (
                  <TableRow
                    key={row.sku}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        onSkuSelectedMeli(row.sku);
                      }}
                    >
                      {row.sku}
                    </TableCell>
                    <TableCell align="right">{row.piezasVendidas}</TableCell>
                    <TableCell align="right">
                      {formatMoney(row.totalVentas)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(row.ticketPromedio.toFixed(2))}
                    </TableCell>
                  </TableRow>
                ))
              : ventasPorSKUMeli?.map((row) => (
                  <TableRow
                    key={row.sku}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                    onClick={() => {
                      onSkuSelectedMeli(row.sku);
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.sku}
                    </TableCell>
                    <TableCell align="right">{row.piezasVendidas}</TableCell>
                    <TableCell align="right">
                      {formatMoney(row.totalVentas)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(row.ticketPromedio.toFixed(2))}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

TableVtasMeli.propTypes = {
  ventasPorSKUMeli: PropTypes.array,
  marketplace: PropTypes.string,
  fechaInicial: PropTypes.string,
  fechaFinal: PropTypes.string,
  onSkuSelectedMeli: PropTypes.func,
};

export default TableVtasMeli;
