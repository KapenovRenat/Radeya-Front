import React from 'react';
import Button from '@mui/material/Button';

interface Props {
    previews: string[];
    removeImage: (index: number) => void;
}

function PreviewsImages(props: Props) {
    const { previews, removeImage } = props;

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 20,
            }}

            className="previews-images"
        >
            {previews.map((src, i) => (
                <div
                    key={i}
                >
                    <div className="img-preview">
                        <img
                            src={src}
                            alt={`preview-${i}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    <Button
                        onClick={() => {
                            removeImage(i);
                        }}
                        variant="contained"
                    >
                        Удалить
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default PreviewsImages;