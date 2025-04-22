<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();
            $table->longText('details')->nullable();

            $table->string('sender_firstname')->nullable();
            $table->string('sender_lastname')->nullable();
            $table->string('sender_email')->nullable();

            $table->string('receiver_firstname')->nullable();
            $table->string('receiver_lastname')->nullable();
            $table->string('receiver_email')->nullable();

            $table->string('file_1')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
