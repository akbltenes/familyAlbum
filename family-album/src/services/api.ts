import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://familyalbum-9.onrender.com';

console.log('API Base URL:', BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor ekle
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        baseURL: error.config?.baseURL,
      }
    });
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
  console.error('API Error Details:', {
    error,
    response: error.response,
    request: error.request,
    config: error.config
  });
  const apiError: ApiError = {
    message: error.response?.data?.message || error.message || 'Bir hata oluştu',
    status: error.response?.status || 500,
  };
  throw apiError;
};

const api = {
  getAllPhotos: async (): Promise<Photo[]> => {
    try {
      console.log('Fetching photos from:', `${BASE_URL}/photos`);
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
      console.log('Uploading photo to:', `${BASE_URL}/photos/upload`);
      console.log('Upload data:', { file, uploadedBy });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', uploadedBy);

      const response = await apiClient.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload Error:', error);
      return handleError(error);
    }
  },

  getPhotoUrl: (fileName: string): string => {
    const url = `${BASE_URL}/photos/file/${fileName}`;
    console.log('Generated photo URL:', url);
    return url;
  },

  deletePhoto: async (id: number): Promise<void> => {
    try {
      console.log('Deleting photo:', id);
      await apiClient.delete(`/photos/${id}`);
      console.log('Photo deleted successfully');
    } catch (error) {
      console.error('Delete Error:', error);
      return handleError(error);
    }
  },
};

export default api; 