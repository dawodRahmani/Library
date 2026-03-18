<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Kitchen — any authenticated user can listen
Broadcast::channel('kitchen', fn($user) => $user !== null);

// Restaurant — any authenticated user can listen
Broadcast::channel('restaurant', fn($user) => $user !== null);
