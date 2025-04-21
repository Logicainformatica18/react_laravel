import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import ArticleModal from './modal';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Artículos', href: '/articles' },
];

type Article = {
  id: number;
  title: string;
  description?: string;
  details?: string;
  quanty?: number;
  price?: number;
  file_1?: string;
  file_2?: string;
  file_3?: string;
  file_4?: string;
};

type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export default function Articles() {
  const { articles: initialPagination } = usePage<{ articles: Pagination<Article> }>().props;
  const [articles, setArticles] = useState<Article[]>(initialPagination.data);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  const handleArticleSaved = (saved: Article) => {
    setArticles((prev) => {
      const exists = prev.find((a) => a.id === saved.id);
      return exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [saved, ...prev];
    });
    setEditArticle(null);
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      setArticles(res.data.articles.data);
      setPagination(res.data.articles);
    } catch (e) {
      console.error('Error al cargar página', e);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Listado de Artículos</h1>
        <p className="text-muted-foreground mb-6">Aquí puedes administrar tus artículos.</p>

        <button
          onClick={() => {
            setEditArticle(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nuevo Artículo
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Acciones</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Título</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Descripción</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Detalles</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Cantidad</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Precio</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Archivo 1</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Archivo 2</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Archivo 3</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Archivo 4</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700 space-x-2">
                    <button
                      onClick={() => {
                        setEditArticle(article);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`¿Eliminar artículo "${article.title}"?`)) {
                          try {
                            await axios.delete(`/articles/${article.id}`);
                            setArticles((prev) => prev.filter((a) => a.id !== article.id));
                          } catch (e) {
                            alert('Error al eliminar');
                            console.error(e);
                          }
                        }
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.details}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.quanty}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{article.price}</td>
                  {[article.file_1, article.file_2, article.file_3, article.file_4].map((file, i) => (
                    <td key={i} className="px-4 py-2 text-sm text-gray-700">
                      {file && (
                        <a href={`../../uploads/${file}`} download={file} className="text-blue-600 underline">
                          {file}
                        </a>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(pagination.last_page)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => fetchPage(`/articles/fetch?page=${page}`)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  pagination.current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                disabled={pagination.current_page === page}
              >
                {page}
              </button>
            );
          })}
        </div>
      </div>

      {showModal && (
        <ArticleModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditArticle(null);
          }}
          onSaved={handleArticleSaved}
          articleToEdit={editArticle}
        />
      )}
    </AppLayout>
  );
}
