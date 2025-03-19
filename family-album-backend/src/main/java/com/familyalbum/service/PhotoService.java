package com.familyalbum.service;

import com.familyalbum.model.Photo;
import com.familyalbum.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class PhotoService {

    @Value("${upload.dir}")
    private String uploadDir;

    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public List<Photo> getAllPhotos() {
        return photoRepository.findAll();
    }

    public Photo uploadPhoto(MultipartFile file, String uploadedBy) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file to disk
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        // Create and save photo entity
        Photo photo = new Photo();
        photo.setFileName(newFilename);
        photo.setFileUrl("/photos/file/" + newFilename);
        photo.setUploadedBy(uploadedBy);

        return photoRepository.save(photo);
    }

    public byte[] getPhotoFile(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename);
        return Files.readAllBytes(filePath);
    }

    public void deletePhoto(Long id) throws IOException {
        // Önce veritabanından fotoğraf bilgilerini al
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fotoğraf bulunamadı"));

        // Dosyayı diskten sil
        Path filePath = Paths.get(uploadDir).resolve(photo.getFileName());
        Files.deleteIfExists(filePath);

        // Veritabanından kaydı sil
        photoRepository.deleteById(id);
    }
}