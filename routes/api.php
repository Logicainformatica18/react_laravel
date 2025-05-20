<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Login API
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => '❌ Credenciales inválidas'], 401);
    }

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json([
        'message' => '✅ Login exitoso',
        'token' => $token,
        'user' => $user
    ]);
});

// Logout API
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => '✅ Logout exitoso']);
});

// Usuario autenticado
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

// Rutas protegidas de usuarios
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/roles', [UserController::class, 'syncRoles']);
});


Route::get('/test', function () {
    return response()->json([
        'message' => '✅ API funcionando correctamente',
        'timestamp' => now(),
    ]);
});
