import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }
  return [year, month, day].join("-");
};

//funcion asyncrona que recibe una funcion y la ejecuta 
export const withLoader = async (functionToExecute) => {
  try {
    loader();
    return await functionToExecute;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    MySwal.close();
  }
};

//loader sweetalert
export const loader = () => {
  MySwal.fire({
    title: "Cargando...",
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      MySwal.showLoading();
    },
  });
};
