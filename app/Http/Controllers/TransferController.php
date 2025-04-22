<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransfersExport;

class TransferController extends Controller
{
    public function index()
    {
        $transfers = Transfer::latest()->orderBy('id','desc')->paginate(7);
        return Inertia::render('transfers/index', [
            'transfers' => $transfers,
        ]);
    }

    public function fetchPaginated()
    {
        $transfers = Transfer::latest()->orderBy('id','desc')->paginate(7);

        return response()->json([
            'transfers' => $transfers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string',
            'details' => 'nullable|string',

            'sender_firstname' => 'nullable|string|max:255',
            'sender_lastname'  => 'nullable|string|max:255',
            'sender_email'     => 'nullable|email',

            'receiver_firstname' => 'nullable|string|max:255',
            'receiver_lastname'  => 'nullable|string|max:255',
            'receiver_email'     => 'nullable|email',

            'file_1' => 'nullable|file|max:2048',
        ]);

        $transfer = new Transfer($request->except('file_1'));

        if ($request->hasFile('file_1')) {
            $transfer->file_1 = fileStore($request->file('file_1'), 'uploads');
        }

        $transfer->save();

        return response()->json([
            'message' => '✅ Transfer created successfully',
            'transfer' => $transfer,
        ]);
    }
    public function articles($id)
    {
        $transfer = Transfer::with('articles')->findOrFail($id);
    
        return Inertia::render('articles/index', [
            'articles' => [
                'data' => $transfer->articles,
                'current_page' => 1,
                'last_page' => 1,
                'next_page_url' => null,
                'prev_page_url' => null,
            ],
            'transfer_id' => $transfer->id,
        ]);
    }
    
    
    public function update(Request $request, $id)
    {
        $request->validate([
            'description' => 'nullable|string',
            'details' => 'nullable|string',

            'sender_firstname' => 'nullable|string|max:255',
            'sender_lastname'  => 'nullable|string|max:255',
            'sender_email'     => 'nullable|email',

            'receiver_firstname' => 'nullable|string|max:255',
            'receiver_lastname'  => 'nullable|string|max:255',
            'receiver_email'     => 'nullable|email',

            'file_1' => 'nullable|file|max:2048',
        ]);

        $transfer = Transfer::findOrFail($id);
        $transfer->fill($request->except('file_1'));

        if ($request->hasFile('file_1')) {
            $transfer->file_1 = fileUpdate(
                $request->file('file_1'),
                'uploads',
                $transfer->file_1
            );
        }

        $transfer->save();

        return response()->json(['transfer' => $transfer], 200);
    }

    public function show($id)
    {
        $transfer = Transfer::findOrFail($id);
        return response()->json(['transfer' => $transfer]);
    }

    public function destroy($id)
    {
        Transfer::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Transfer::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Transfers deleted successfully']);
    }

    public function exportExcel()
    {
        return Excel::download(new TransfersExport, 'transfers.xlsx');
    }
}
