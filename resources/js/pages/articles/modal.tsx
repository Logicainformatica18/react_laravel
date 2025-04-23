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
import { Loader2 } from 'lucide-react';

export default function ArticleModal({
  open,
  onClose,
  onSaved,
  articleToEdit,
  transfer_id,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (article: any) => void;
  articleToEdit?: any;
  transfer_id?: number;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    quanty: 0,
    price: 0,
    code: '',
    condition: '',
    state: '',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    file_1: null,
    file_2: null,
    file_3: null,
    file_4: null,
  });

  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    file_1: null,
    file_2: null,
    file_3: null,
    file_4: null,
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        title: articleToEdit.title || '',
        description: articleToEdit.description || '',
        details: articleToEdit.details || '',
        quanty: articleToEdit.quanty || 0,
        price: articleToEdit.price || 0,
        code: articleToEdit.code || '',
        condition: articleToEdit.condition || '',
        state: articleToEdit.state || '',
      });
    } else {
      handleReset();
    }
  }, [articleToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quanty' || name === 'price' ? Number(value) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFiles((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({
        ...prev,
        [name]: file.type.startsWith('image') ? URL.createObjectURL(file) : file.name,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setProgress(0);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (transfer_id) {
        data.append('transfer_id', String(transfer_id));
      }

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      const url = articleToEdit ? `/articles/${articleToEdit.id}` : '/articles';
      if (articleToEdit) {
        data.append('_method', 'PUT');
      }

      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      toast.success(articleToEdit ? 'Artículo actualizado ✅' : 'Artículo guardado ✅');
      onSaved(response.data.article);
      handleReset();
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error('Hubo un error al guardar');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      details: '',
      quanty: 0,
      price: 0.0,
      code: '',
      condition: '',
      state: '',
    });
    setFiles({ file_1: null, file_2: null, file_3: null, file_4: null });
    setPreviews({ file_1: null, file_2: null, file_3: null, file_4: null });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{articleToEdit ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
        </DialogHeader>

        {uploading && (
          <div className="w-full mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">{progress}%</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          {transfer_id && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Transfer ID</Label>
              <div className="col-span-3 text-sm text-gray-700">{transfer_id}</div>
            </div>
          )}

          {['title', 'description', 'details', 'quanty', 'price', 'code', 'condition'].map((field) => (
            <div key={field} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field} className="text-right capitalize">{field.replace('_', ' ')}</Label>
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
                  type={field === 'quanty' || field === 'price' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  min={field === 'quanty' || field === 'price' ? 0 : undefined}
                  className="col-span-3"
                />
              )}
            </div>
          ))}

          {/* Campo Select para state */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">Estado</Label>
            <select
              name="state"
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="col-span-3 border rounded px-3 py-2 text-sm"
            >
              <option value="">Selecciona una opción</option>
              <option value="bueno">Bueno</option>
              <option value="daño leve">Daño leve</option>
              <option value="daño moderado">Daño moderado</option>
            </select>
          </div>

          {[1, 2, 3, 4].map((num) => {
            const field = `file_${num}`;
            const file = files[field];
            const isImage = previews[field]?.startsWith('blob:');
            const fileSizeKB = file ? file.size / 1024 : 0;
            const fileSizeText = file ? `${fileSizeKB.toFixed(1)} KB` : null;
            const sizeColor = fileSizeKB > 2000 ? 'text-red-600' : 'text-blue-600';

            return (
              <div key={field} className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor={field} className="text-right mt-2">Archivo {num}</Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <Input type="file" name={field} id={field} onChange={handleFileChange} />
                    {previews[field] &&
                      (isImage ? (
                        <img src={previews[field]!} alt={`preview ${num}`} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <span className="text-sm text-gray-600 truncate max-w-[120px]">{previews[field]}</span>
                      ))}
                  </div>
                  {fileSizeText && (
                    <div className={`text-xs mt-1 ${sizeColor}`}>Tamaño: {fileSizeText}</div>
                  )}
                </div>
              </div>
            );
          })}

          <span className="text-xs text-right block text-gray-600">Los archivos deben de ser menores a 2000 KB</span>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={uploading}>Nuevo</Button>
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {articleToEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} disabled={uploading}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
