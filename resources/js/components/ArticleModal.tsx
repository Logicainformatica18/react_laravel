import { useState } from 'react';
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
export default function ArticleModal({
    open,
    onClose,
    onSaved,
}: {
    open: boolean;
    onClose: () => void;
    onSaved: (article: any) => void;
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        details: '',
        sender_email: '',
        receiver_email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


const handleSave = async () => {
    try {
        const response = await axios.post('/articles', formData);
        toast.success('Artículo guardado correctamente ✅');
        onSaved(response.data.article);
        handleReset();
        onClose();
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        toast.error('Hubo un error al guardar');
    }
};


    const handleUpdate = () => {
        console.log('Actualizando...', formData);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            details: '',
            sender_email: '',
            receiver_email: '',
        });
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Formulario de Artículo</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Título</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Descripción</Label>
                        <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="details" className="text-right">Detalles</Label>
                        <Input id="details" name="details" value={formData.details} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sender_email" className="text-right">Remitente</Label>
                        <Input id="sender_email" name="sender_email" value={formData.sender_email} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="receiver_email" className="text-right">Receptor</Label>
                        <Input id="receiver_email" name="receiver_email" value={formData.receiver_email} onChange={handleChange} className="col-span-3" />
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset}>Nuevo</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                        <Button variant="secondary" onClick={handleUpdate}>Actualizar</Button>
                    </div>
                    <Button variant="ghost" onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
