<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admins = array(
            array(
                'full_name' => "webster avosa",
                'email' => 'websterb17@gmail.com',
                'username' => 'webster',
                'password' => '@365office'
            ),
            array(
                'full_name' => "admin admin",
                'email' => 'admin@gmail.com',
                'username' => 'admin',
                'password' => '@365office'
            )
            );

            foreach($admins as $admin) {
                DB::table('admin')->insert($admin);
            }
    }
}


