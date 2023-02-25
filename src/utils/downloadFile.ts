import axiosInstance from '../api/axiosInstance';
import { IFile } from '../entities/File';

export const downloadFile = async (file: IFile) => {
    const { data, status } = await axiosInstance.get<Blob>('files/download', {
        params: { id: file._id },
        responseType: 'blob',
    });

    if (status === 200) {
        const downloadUrl = window.URL.createObjectURL(data);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
