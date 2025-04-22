import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';

export default function TransferModal({
  open,
  onClose,
  onSaved,
  transferToEdit,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (transfer: any) => void;
  transferToEdit?: any;
}) {
  const [formData, setFormData] = useState({
    description: '',
    details: '',
    sender_firstname: '',
    sender_lastname: '',
    sender_email: '',
    receiver_firstname: '',
    receiver_lastname: '',
    receiver_email: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (transferToEdit) {
      setFormData({
        description: transferToEdit.description || '',
        details: transferToEdit.details || '',
        sender_firstname: transferToEdit.sender_firstname || '',
        sender_lastname: transferToEdit.sender_lastname || '',
        sender_email: transferToEdit.sender_email || '',
        receiver_firstname: transferToEdit.receiver_firstname || '',
        receiver_lastname: transferToEdit.receiver_lastname || '',
        receiver_email: transferToEdit.receiver_email || '',
      });
      setPreview(transferToEdit.file_1 ? `../../uploads/${transferToEdit.file_1}` : null);
    } else {
      handleReset();
    }
  }, [transferToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null;
    setFile(newFile);
    if (newFile) {
      setPreview(newFile.type.startsWith('image') ? URL.createObjectURL(newFile) : newFile.name);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) data.append('file_1', file);

      const url = transferToEdit ? `/transfers/${transferToEdit.id}` : '/transfers';
      if (transferToEdit) data.append('_method', 'PUT');

      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(transferToEdit ? 'Transfer actualizado ✅' : 'Transfer guardado ✅');
      onSaved(response.data.transfer);
      handleReset();
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error('Hubo un error al guardar');
    }
  };

  const handleReset = () => {
    setFormData({
      description: '',
      details: '',
      sender_firstname: '',
      sender_lastname: '',
      sender_email: '',
      receiver_firstname: '',
      receiver_lastname: '',
      receiver_email: '',
    });
    setFile(null);
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{transferToEdit ? 'Editar Transfer' : 'Nuevo Transfer'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {[
            'description',
            'details',
            'sender_firstname',
            'sender_lastname',
            'sender_email',
            'receiver_firstname',
            'receiver_lastname',
            'receiver_email'
          ].map((field) => (
            <div key={field} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field} className="text-right capitalize">
                {field.replace(/_/g, ' ')}
              </Label>
              {field === 'details' ? (
                <textarea
                  id={field}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="col-span-3 border rounded px-3 py-2 text-sm"
                  rows={3}
                />
              ) : (
                <Input
                  type={field.includes('email') ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="col-span-3"
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="file_1" className="text-right mt-2">Archivo</Label>
            <div className="col-span-3">
              <div className="flex items-center gap-4">
                <Input type="file" name="file_1" id="file_1" onChange={handleFileChange} />
                {preview && (
                  preview.startsWith('blob:') ? (
                    <img src={preview} alt="preview" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <a
                      href={preview}
                      download
                      className="text-sm text-blue-600 underline truncate max-w-[120px]"
                    >
                      {preview}
                    </a>
                  )
                )}
              </div>
              {file && (
                <div className={`text-xs mt-1 ${file.size / 1024 > 2000 ? 'text-red-600' : 'text-blue-600'}`}>
                  Tamaño: {(file.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
          </div>

          <span className="text-xs text-right block text-gray-600">
            El archivo debe ser menor a 2000 KB
          </span>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>Nuevo</Button>
            <Button onClick={handleSubmit}>
              {transferToEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
