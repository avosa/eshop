<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Categories extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['category_name' => 'Smartphones'],
            ['category_name' => 'Laptops'],
            ['category_name' => 'Accessories'],
            ['Category_name' => 'Ex UK']
        ];

        foreach($categories as $category) {
            DB::table('categories')->insert($category);
        }
    }
}
