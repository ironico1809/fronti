import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const registrarRostro = async (usuarioId, imagenFile) => {
  const formData = new FormData();
  formData.append('usuario', usuarioId);
  formData.append('imagen', imagenFile);
  const response = await axios.post(`${API_BASE_URL}/usuarios/rostros/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const obtenerUsuarios = async () => {
  const response = await axios.get(`${API_BASE_URL}/usuarios/`);
  return response.data;
};
