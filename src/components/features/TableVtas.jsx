import { Container, Tab, TableContainer } from "@mui/material";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const TableVtas = (vtas) => {
  console.log(vtas.data.datos);
  const [data, setData] = useState(vtas.data.datos);
  const [page, setPage] = useState(vtas.data.paginaActual);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(vtas.data.totalDocumentos);
  const [totalPages, setTotalPages] = useState(vtas.data.totalPaginas);
  return (
    <Container maxWidth="xxl">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Piezas Vendidas</TableCell>
              <TableCell>Ticket Promedio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.sku}>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.piezasVendidas}</TableCell>
                <TableCell>{row.ticketPromedio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TableVtas;
