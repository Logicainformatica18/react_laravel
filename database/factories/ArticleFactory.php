<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'details' => $this->faker->paragraphs(2, true),
            'sender_email' => $this->faker->safeEmail(),
            'receiver_email' => $this->faker->safeEmail(),
            'file_1' => $this->faker->image('public/storage/articles', 640, 480, null, false),
            'file_2' => $this->faker->image('public/storage/articles', 640, 480, null, false),
            'file_3' => $this->faker->image('public/storage/articles', 640, 480, null, false),
            'file_4' => $this->faker->image('public/storage/articles', 640, 480, null, false),
        ];
    }
}
