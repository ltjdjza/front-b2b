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
import { formatMoney } from "../../utils/helpers";
import Container from "@mui/material/Container";
import { TextField } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

const TableVtas = (props) => {
  const { ventasPorSKU, marketplace, onSkuSelected } = props;
  const [sortConfig, setSortConfig] = useState({
    key: "sku",
    direction: "asc",
  });
  const [searchText, setSearchText] = useState("");
  const [filteredVentas, setFilteredVentas] = useState([]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);

    if (event.target.value === "") {
      setFilteredVentas([]);
    }
  };

  const handleSort = (key) => {
    //limpiar el search text
    setSearchText("");
    console.log(key);
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    if (filteredVentas.length > 0) {
      const sorted = ventasPorSKU.sort((a, b) => {
        if (direction === "asc") {
          return a[key] > b[key] ? 1 : -1;
        } else {
          return a[key] < b[key] ? 1 : -1;
        }
      });
      setFilteredVentas(sorted);
    } else {
      ventasPorSKU.sort((a, b) => {
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
      const filtered = ventasPorSKU.filter((venta) =>
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
            {filteredVentas.length > 0 && searchText.length > 0
              ? filteredVentas.map((row) => (
                  <TableRow
                    key={row.sku}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        onSkuSelected(row.sku);
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
              : ventasPorSKU.map((row) => (
                  <TableRow
                    key={row.sku}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                    onClick={() => {
                      onSkuSelected(row.sku);
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

TableVtas.propTypes = {
  ventasPorSKU: PropTypes.array,
  marketplace: PropTypes.string,
  fechaInicial: PropTypes.string,
  fechaFinal: PropTypes.string,
  onSkuSelected: PropTypes.func,
};

export default TableVtas;
