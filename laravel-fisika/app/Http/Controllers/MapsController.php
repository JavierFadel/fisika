<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('page.maps');
    }

    public function traffic()
    {
        return view('page.traffic');
    }

    public function time()
    {
        return view('page.time');
    }

    public function avoid()
    {
        return view('page.avoid');
    }

    public function gallery()
    {
        return view('page.gallery');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
