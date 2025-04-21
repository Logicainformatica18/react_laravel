<?php

namespace App\Http\Controllers;
use App\Models\Article;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ArticleController extends Controller
{

    public function index()
    {
        $articles = Article::latest()->orderBy('id','desc')->paginate(10);
        return Inertia::render('articles/index', [
            'articles' => $articles,
        ]);
    }
    public function fetchPaginated()
    {
        $articles = Article::latest()->orderBy('id','desc')->paginate(10);

        return response()->json([
            'articles' => $articles,
        ]);
    }

}
