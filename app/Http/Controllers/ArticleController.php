<?php

namespace App\Http\Controllers;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ArticlesExport;
use Illuminate\Support\Facades\Log;
class ArticleController extends Controller
{

    public function index()
    {
        $articles = Article::latest()->orderBy('id','desc')->paginate(7);
        return Inertia::render('articles/index', [
            'articles' => $articles,
        ]);
    }
    public function fetchPaginated()
    {
        $articles = Article::latest()->orderBy('id','desc')->paginate(7);

        return response()->json([
            'articles' => $articles,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'details' => 'nullable|string',
            'quanty' => 'nullable|integer|min:0',
           'price' => 'nullable|numeric|min:0',

            'file_1' => 'nullable|file|max:2048',
            'file_2' => 'nullable|file|max:2048',
            'file_3' => 'nullable|file|max:2048',
            'file_4' => 'nullable|file|max:2048',
        ]);
        

        $article = new Article();
        $article->title = $request->title;
        $article->description = $request->description;
        $article->details = $request->details;
        $article->quanty = $request->quanty;
        $article->price = $request->price;
        $article->transfer_id = $request->transfer_id;

        $directory = 'uploads';

        foreach (['file_1', 'file_2', 'file_3', 'file_4'] as $field) {
            if ($request->hasFile($field)) {
                $article->$field = fileStore($request->file($field), $directory);
            }
        }

        $article->save();

            return response()->json([
                'message' => '✅ Artículo creado correctamente',
                'article' => $article,
            ]);
    }
  

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'details' => 'nullable|string',
            'quanty' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'file_1' => 'nullable|file|max:2048',
            'file_2' => 'nullable|file|max:2048',
            'file_3' => 'nullable|file|max:2048',
            'file_4' => 'nullable|file|max:2048',
        ]);
    
        $article = Article::findOrFail($id);
        $article->fill($request->except('file_1', 'file_2', 'file_3', 'file_4'));
    
        foreach (['file_1', 'file_2', 'file_3', 'file_4'] as $field) {
            if ($request->hasFile($field)) {
                Log::debug("📂 Procesando {$field}", [
                    'originalName' => $request->file($field)->getClientOriginalName(),
                    'size' => $request->file($field)->getSize(),
                    'type' => $request->file($field)->getMimeType(),
                ]);
    
                $article->$field = fileUpdate(
                    $request->file($field),
                    'uploads',
                    $article->$field
                );
            } else {
                Log::debug("⚠️ No se recibió {$field}");
            }
        }
    
        $article->save();
    
        Log::info("✅ Artículo actualizado", ['id' => $article->id]);
    
        return response()->json(['article' => $article], 200);
    }
    
    
    public function show($id)
{
    $article = Article::findOrFail($id);
    return response()->json(['article' => $article]);
}

    public function destroy($id)
    {
        Article::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
    public function bulkDelete(Request $request)
{
    $ids = $request->input('ids', []);
    Article::whereIn('id', $ids)->delete();

    return response()->json(['message' => 'Eliminados correctamente']);
}
public function exportExcel()
{
    return Excel::download(new ArticlesExport, 'articulos.xlsx');
}
}
