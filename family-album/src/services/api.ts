import axios, { AxiosError } from 'axios';

// API URL'lerini ortam değişkenlerinden al
const BASE_URL = process.env.REACT_APP_API_URL || 'https://familyalbum-9.onrender.com/api';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Response interceptor ekle
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export interface Photo {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface ApiError {
  message: string;
  status: number;
}

const handleError = (error: any): never => {
  console.error('API Error Details:', error);
  const apiError: ApiError = {
    message: error.response?.data?.message || 'Bir hata oluştu',
    status: error.response?.status || 500,
  };
  throw apiError;
};

const api = {
  getAllPhotos: async (): Promise<Photo[]> => {
    try {
      const response = await apiClient.get('/photos');
      console.log('Photos response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get Photos Error:', error);
      return handleError(error);
    }
  },

  uploadPhoto: async (file: File, uploadedBy: string): Promise<Photo> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', uploadedBy);

      const response = await apiClient.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getPhotoUrl: (fileName: string): string => {
    return `${BASE_URL}/photos/file/${fileName}`;
  },

  deletePhoto: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/photos/${id}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api; 