<?php
namespace App\Exports;

use App\Models\Article;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ArticlesExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Article::select([
            'id',
            'title',
            'description',
            'details',
            'quanty',
            'price',
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
        ];
    }
}
