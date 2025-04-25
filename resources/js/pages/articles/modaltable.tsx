import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ArticleListTable({ articles, onDelete, onSubmit }: {
  articles: { description: string; quanty: number }[];
  onDelete: (index: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Artículos agregados</h2>
      {articles.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-black dark:text-white">Artículo</th>
                <th className="px-4 py-2 text-left text-black dark:text-white">Cantidad</th>
                <th className="px-4 py-2 text-left text-black dark:text-white">Estado</th>
                <th className="px-4 py-2 text-left text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-black dark:text-white">{article.description}</td>
                  <td className="px-4 py-2 text-black dark:text-white">{article.quanty}</td>
                  <td className="px-4 py-2 text-black dark:text-white">{article.state}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(index)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button onClick={onSubmit}>Guardar Todo</Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No hay artículos agregados aún.</p>
      )}
    </div>
  );
}
