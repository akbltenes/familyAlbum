import axios from 'axios';

// Render'daki backend URL'i
const BASE_URL = 'https://family-album-backend.onrender.com/api';

export interface Photo {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
}

const api = {
  getAllPhotos: async (): Promise<Photo[]> => {
    const response = await axios.get(`${BASE_URL}/photos`);
    return response.data;
  },

  uploadPhoto: async (file: File, uploadedBy: string): Promise<Photo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy);

    const response = await axios.post(`${BASE_URL}/photos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPhotoUrl: (fileName: string): string => {
    return `${BASE_URL}/photos/file/${fileName}`;
  },
};

export default api; 