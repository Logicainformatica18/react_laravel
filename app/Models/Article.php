<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'details',
        'sender_email',
        'receiver_email',
        'file_1',
        'file_2',
        'file_3',
        'file_4',
    ];
}
