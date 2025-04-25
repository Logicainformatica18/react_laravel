// resources/js/pages/articles/modal.tsx

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
import ProductSearch from '../products/search';
import ArticleListTable from './modaltable';

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
    quanty: 1,
    price: 0,
    code: '',
    condition: '',
    state: '',
    product_id: null,
  });

  const [articles, setArticles] = useState<typeof formData[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setArticles([{
        title: articleToEdit.title || '',
        description: articleToEdit.description || '',
        details: articleToEdit.details || '',
        quanty: articleToEdit.quanty || 1,
        price: articleToEdit.price || 0,
        code: articleToEdit.code || '',
        condition: articleToEdit.condition || '',
        state: articleToEdit.state || '',
        product_id: articleToEdit.product_id || null,
      }]);
    } else {
      setArticles([]);
    }
  }, [articleToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quanty' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleAddArticle = () => {
    if (formData.description && formData.quanty > 0 && formData.product_id) {
      setArticles((prev) => [...prev, formData]);
      setFormData({
        title: '',
        description: '',
        details: '',
        quanty: 1,
        price: 0,
        code: '',
        condition: '',
        state: '',
        product_id: null,
      });
    } else {
      toast.error('Completa los campos obligatorios.');
    }
  };

  const handleDeleteArticle = (index: number) => {
    setArticles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (articles.length === 0) {
      toast.error('Debes agregar al menos un artículo.');
      return;
    }
    try {
      setUploading(true);
      const response = await axios.post('/articles/bulk-store', {
        transfer_id,
        articles,
      });
      toast.success('Artículos guardados correctamente ✅');
      onSaved(response.data);
      setArticles([]);
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      toast.error('Hubo un error al guardar los artículos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{articleToEdit ? 'Editar Artículo' : 'Agregar Artículos'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Buscar producto</Label>
            <div className="col-span-3">
              <ProductSearch
                onSelect={(product) => {
                  setFormData((prev) => ({
                    ...prev,
                    title: product.description,
                    description: product.description,
                    code: product.code ?? '',
                    product_id: product.id,
                  }));
                }}
              />
            </div>
          </div>

          {[
            { name: 'details', label: 'Detalles' },
            { name: 'quanty', label: 'Cantidad' },
            // { name: 'price', label: 'Precio' },
            { name: 'code', label: 'Código' },
            { name: 'condition', label: 'Condición' },
            { name: 'state', label: 'Estado' },
          ].map(({ name, label }) => (
            <div key={name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={name} className="text-right">{label}</Label>
              {name === 'details' ? (
                <textarea
                  id={name}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="col-span-3 border rounded px-3 py-2 text-sm"
                  rows={3}
                />
              ) : name === 'state' ? (
                <select
                  id={name}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="col-span-3 border rounded px-3 py-2 text-sm"
                >
                  <option value="">Selecciona estado</option>
                  <option value="bueno">Bueno</option>
                  <option value="daño leve">Daño leve</option>
                  <option value="daño moderado">Daño moderado</option>
                </select>
              ) : (
                <Input
                  id={name}
                  name={name}
                  type={name === 'quanty' || name === 'price' ? 'number' : 'text'}
                  min={name === 'quanty' || name === 'price' ? 0 : undefined}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="col-span-3"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleAddArticle}>Agregar a lista</Button>
          </div>

          <ArticleListTable
            articles={articles}
            onDelete={handleDeleteArticle}
            onSubmit={handleSubmit}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={uploading}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
