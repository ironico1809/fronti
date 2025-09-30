import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/usuarios';

export const reconocerRostro = async (imagenFile) => {
  const formData = new FormData();
  formData.append('imagen', imagenFile);
  const response = await axios.post(`${API_URL}/reconocer_rostro/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
