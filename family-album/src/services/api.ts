import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface Photo {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
}

const api = {
  getAllPhotos: async (): Promise<Photo[]> => {
    const response = await axios.get(`${API_BASE_URL}/photos`);
    return response.data;
  },

  uploadPhoto: async (file: File, uploadedBy: string): Promise<Photo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy);

    const response = await axios.post(`${API_BASE_URL}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPhotoUrl: (fileName: string): string => {
    return `${API_BASE_URL}/photos/file/${fileName}`;
  },
};

export default api; 