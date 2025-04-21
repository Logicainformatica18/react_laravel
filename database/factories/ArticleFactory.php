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
            'quanty' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->randomFloat(2, 0, 1000),
            'file_1' => $this->faker->image('public/uploads', 640, 480, null, false),
            'file_2' => $this->faker->image('public/uploads', 640, 480, null, false),
            'file_3' => $this->faker->image('public/uploads', 640, 480, null, false),
            'file_4' => $this->faker->image('public/uploads', 640, 480, null, false),
        ];
    }
}
