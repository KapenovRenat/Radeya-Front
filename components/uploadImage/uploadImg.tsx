import React, { useState } from "react";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
    handleSelectImage: (images: File[], previews: string[]) => void;
}

function ImageUploader(props: Props) {
    const {handleSelectImage} = props;

    const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // создаём превью для отображения
        const urls = files.map((file) => URL.createObjectURL(file));

        handleSelectImage(files, urls)
    };

    return (
        <div className="image-uploader">
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Загрузить изображения
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleSelectImages}
                />
            </Button>
        </div>
    )
}

export default ImageUploader;