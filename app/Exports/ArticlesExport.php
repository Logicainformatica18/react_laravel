<?php

namespace App\Exports;

use App\Models\Article;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ArticlesExport implements FromCollection, WithHeadings
{
    protected $transferId;

    public function __construct($transferId)
    {
        $this->transferId = $transferId;
    }

    public function collection()
    {
        return Article::where('transfer_id', $this->transferId)
            ->select([
                'id',
                'title',
                'description',
                'details',
                'quanty',
                'price',
                'code',
                'condition',
                'state',
                'file_1',
                'file_2',
                'file_3',
                'file_4',
                'created_at',
                'updated_at',
            ])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Título',
            'Descripción',
            'Detalles',
            'Cantidad',
            'Precio',
            'Código',
            'Condición',
            'Estado',
            'Archivo 1',
            'Archivo 2',
            'Archivo 3',
            'Archivo 4',
            'Creado el',
            'Actualizado el',
        ];
    }
}
